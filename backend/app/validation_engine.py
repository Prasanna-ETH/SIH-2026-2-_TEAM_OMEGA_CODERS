import re
from datetime import datetime
from typing import List, Dict, Any, Tuple
from sqlalchemy.orm import Session
from app.models import Student, StudentEnrolment, Programme, Institution

def validate_apaar_format(apaar_id: str) -> Tuple[bool, str]:
    if not apaar_id or not str(apaar_id).strip():
        return False, "APAAR ID is missing. National academic identifier is mandatory."
    
    clean_id = str(apaar_id).replace("-", "").replace(" ", "").strip()
    if not re.match(r"^\d{12}$", clean_id):
        return False, f"Invalid APAAR ID format '{apaar_id}'. Must be exactly 12 numeric digits."
    
    return True, clean_id

def validate_dob(dob_str: str) -> Tuple[bool, str]:
    if not dob_str:
        return False, "Date of Birth is missing."
    try:
        # Accept YYYY-MM-DD or DD/MM/YYYY or DD-MM-YYYY
        dt = None
        for fmt in ("%Y-%m-%d", "%d/%m/%Y", "%d-%m-%Y"):
            try:
                dt = datetime.strptime(dob_str.strip(), fmt)
                break
            except ValueError:
                continue
        if not dt:
            return False, f"Invalid Date of Birth format '{dob_str}'. Expected YYYY-MM-DD."
        
        # Calculate age as of 2026
        age = 2026 - dt.year
        if age < 15 or age > 65:
            return False, f"DOB anomaly: Derived age {age} is outside typical higher education admission range."
        return True, dt.strftime("%Y-%m-%d")
    except Exception as e:
        return False, f"Date of Birth validation error: {str(e)}"

def run_prevalidation_pipeline(
    records: List[Dict[str, Any]],
    institution_id: int,
    programme_id: int,
    academic_year: str,
    db: Session
) -> Dict[str, Any]:
    """
    Executes multi-step regulatory validation pipeline for student records.
    """
    programme = db.query(Programme).filter(Programme.id == programme_id).first()
    approved_intake = programme.approved_intake if programme else 120
    current_reg_enrolment = programme.current_enrolment if programme else 0
    supernumerary_cap = programme.supernumerary_cap if programme else 10
    current_super_enrolment = programme.current_supernumerary if programme else 0

    seen_apaar_in_batch = {}
    validated_records = []
    total_valid = 0
    total_warnings = 0
    total_errors = 0
    duplicate_signals = 0

    projected_reg = current_reg_enrolment
    projected_super = current_super_enrolment

    for idx, row in enumerate(records, start=1):
        issues = []
        raw_apaar = row.get("apaar_id") or row.get("apaar") or ""
        name = row.get("full_name") or row.get("student_name") or f"Candidate #{idx}"
        dob = row.get("dob") or row.get("date_of_birth") or ""
        gender = row.get("gender") or "Not Specified"
        category = row.get("category") or "General"
        seat_type = row.get("seat_type") or "Regular"
        is_supernumerary = bool(row.get("is_supernumerary") in [True, "true", "True", 1, "1"] or seat_type in ["TFWS", "Supernumerary", "PMSSS", "NRI"])
        supernumerary_type = row.get("supernumerary_type") or (seat_type if is_supernumerary else None)
        enrollment_no = row.get("enrollment_no") or f"ENR/2026/{1000 + idx}"
        admission_date = row.get("admission_date") or "2026-07-15"

        # Check 1: APAAR Format
        clean_apaar = None
        if not raw_apaar:
            issues.append({
                "rule": "FORMAT_APAAR",
                "severity": "ERROR",
                "message": "Missing APAAR ID. Cannot register student without national academic identifier."
            })
        else:
            is_valid_fmt, res = validate_apaar_format(raw_apaar)
            if not is_valid_fmt:
                issues.append({
                    "rule": "FORMAT_APAAR",
                    "severity": "ERROR",
                    "message": res
                })
            else:
                clean_apaar = res

        # Check 2: Duplicate APAAR inside batch
        if clean_apaar:
            if clean_apaar in seen_apaar_in_batch:
                issues.append({
                    "rule": "DUPLICATE_BATCH",
                    "severity": "ERROR",
                    "message": f"Duplicate APAAR ID '{clean_apaar}' found multiple times in current upload batch (Row {seen_apaar_in_batch[clean_apaar]} and Row {idx})."
                })
                duplicate_signals += 1
            else:
                seen_apaar_in_batch[clean_apaar] = idx

        # Check 3: Cross-Institution Active Concurrent Enrolment
        if clean_apaar:
            existing_student = db.query(Student).filter(Student.apaar_id == clean_apaar).first()
            if existing_student:
                active_enrolments = (
                    db.query(StudentEnrolment)
                    .filter(
                        StudentEnrolment.student_id == existing_student.id,
                        StudentEnrolment.academic_year == academic_year,
                        StudentEnrolment.status == "Active",
                        StudentEnrolment.institution_id != institution_id
                    )
                    .all()
                )
                if active_enrolments:
                    conflicting_inst_names = []
                    for ae in active_enrolments:
                        inst = db.query(Institution).filter(Institution.id == ae.institution_id).first()
                        if inst:
                            conflicting_inst_names.append(inst.name)
                    inst_str = ", ".join(conflicting_inst_names) if conflicting_inst_names else "Another AICTE Institution"
                    issues.append({
                        "rule": "CROSS_INSTITUTION",
                        "severity": "WARNING",
                        "message": f"Potential concurrent enrolment detected. APAAR {clean_apaar} holds an active registration in: {inst_str}."
                    })
                    duplicate_signals += 1

                # Check 3b: Name/Gender consistency
                if existing_student.full_name.lower().strip() != name.lower().strip():
                    issues.append({
                        "rule": "IDENTITY_INCONSISTENCY",
                        "severity": "WARNING",
                        "message": f"Submitted name '{name}' differs from existing APAAR registry record ('{existing_student.full_name}')."
                    })

        # Check 4: Date of Birth Validation
        is_dob_valid, dob_res = validate_dob(dob)
        if not is_dob_valid:
            issues.append({
                "rule": "DOB_ANOMALY",
                "severity": "WARNING",
                "message": dob_res
            })
            clean_dob = dob
        else:
            clean_dob = dob_res

        # Check 5: Capacity & Supernumerary Check
        if is_supernumerary:
            projected_super += 1
            if projected_super > supernumerary_cap:
                issues.append({
                    "rule": "SUPERNUMERARY_EXCEEDED",
                    "severity": "WARNING",
                    "message": f"Supernumerary seats ({projected_super}) exceed sanctioned quota ({supernumerary_cap}) for {programme.programme_name if programme else 'Programme'}."
                })
        else:
            projected_reg += 1
            if projected_reg > approved_intake:
                issues.append({
                    "rule": "CAPACITY_BREACH",
                    "severity": "ALERT",
                    "message": f"Regular enrolment ({projected_reg}) exceeds AICTE approved intake ({approved_intake}). Requires regulatory capacity audit."
                })

        # Determine Row Classification
        has_errors = any(i["severity"] == "ERROR" for i in issues)
        has_warnings = any(i["severity"] in ["WARNING", "ALERT"] for i in issues)

        if has_errors:
            total_errors += 1
            row_status = "ERROR"
        elif has_warnings:
            total_warnings += 1
            row_status = "WARNING"
        else:
            total_valid += 1
            row_status = "VALID"

        validated_records.append({
            "index": idx,
            "apaar_id": clean_apaar or raw_apaar,
            "full_name": name,
            "dob": clean_dob,
            "gender": gender,
            "category": category,
            "seat_type": seat_type,
            "is_supernumerary": is_supernumerary,
            "supernumerary_type": supernumerary_type,
            "enrollment_no": enrollment_no,
            "admission_date": admission_date,
            "status": row_status,
            "issues": issues
        })

    return {
        "total_records": len(records),
        "valid_count": total_valid,
        "warning_count": total_warnings,
        "error_count": total_errors,
        "duplicate_signals": duplicate_signals,
        "items": validated_records
    }
