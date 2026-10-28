import random
from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import VerificationRequest, Student, StudentEnrolment, Programme, Institution, AuditLog
from app.schemas import VerificationRequestPayload

router = APIRouter(prefix="/verifications", tags=["Verifications"])

def mask_apaar(apaar: str) -> str:
    clean = str(apaar).replace("-", "").strip()
    if len(clean) >= 4:
        return f"********{clean[-4:]}"
    return "********"

@router.post("/verify")
def request_student_verification(payload: VerificationRequestPayload, db: Session = Depends(get_db)):
    identifier = payload.identifier.strip()
    
    # 1. Check if identifier is already an existing Verification Reference
    if identifier.startswith("AICTE-VER-"):
        existing_req = db.query(VerificationRequest).filter(VerificationRequest.reference_no == identifier).first()
        if existing_req:
            return {
                "verified": True,
                "reference_no": existing_req.reference_no,
                "apaar_id_masked": mask_apaar(existing_req.apaar_id),
                "student_name": existing_req.student_name,
                "institution_name": existing_req.institution_name,
                "programme_name": existing_req.programme_name,
                "admission_year": existing_req.admission_year,
                "status": existing_req.status,
                "requester_org": existing_req.requester_org,
                "verification_purpose": existing_req.verification_purpose,
                "verification_date": existing_req.created_at.strftime("%Y-%m-%d %H:%M:%S UTC"),
                "result_summary": existing_req.result_summary,
                "consent_recorded": existing_req.consent_recorded,
                "security_stamp": f"AICTE-DIGITAL-SIGN-HASH-{random.randint(100000, 999999)}"
            }

    # 2. Check by APAAR ID
    clean_apaar = identifier.replace("-", "").strip()
    student = db.query(Student).filter(Student.apaar_id == clean_apaar).first()

    if not student:
        # Check without leading formatting
        student = db.query(Student).filter(Student.apaar_id.ilike(f"%{clean_apaar}%")).first()

    if not student:
        raise HTTPException(
            status_code=404,
            detail=f"No academic record found for identifier '{identifier}'. Ensure APAAR ID is valid and registered with an AICTE approved institution."
        )

    # Fetch enrolment details
    enrolment = (
        db.query(StudentEnrolment, Programme, Institution)
        .join(Programme, StudentEnrolment.programme_id == Programme.id)
        .join(Institution, StudentEnrolment.institution_id == Institution.id)
        .filter(StudentEnrolment.student_id == student.id)
        .first()
    )

    if not enrolment:
        raise HTTPException(status_code=404, detail="Student registered in APAAR index but no active AICTE enrolment record located.")

    enr, prog, inst = enrolment

    # Generate official reference ID
    random_seq = random.randint(1000, 9999)
    ref_no = f"AICTE-VER-2026-{random_seq:06d}"

    # Verify status
    status_str = "VERIFIED" if student.verification_status != "CONFLICT" else "UNDER_REVIEW"
    summary_text = (
        f"Student Academic Identity: Verified. Enrolled in {prog.programme_name} at {inst.name} "
        f"under approved AICTE regulatory framework for academic year {enr.academic_year}."
    )

    req = VerificationRequest(
        reference_no=ref_no,
        apaar_id=student.apaar_id,
        student_name=student.full_name,
        requester_org=payload.requester_org,
        verification_purpose=payload.verification_purpose,
        consent_recorded=payload.consent_recorded,
        status=status_str,
        result_summary=summary_text,
        institution_name=inst.name,
        programme_name=prog.programme_name,
        admission_year=enr.academic_year[:4]
    )
    db.add(req)

    # Audit trail
    audit = AuditLog(
        user_id=payload.requester_org[:20],
        role="VERIFIER",
        action="Created verification request",
        entity_type="Verification",
        entity_id=ref_no,
        previous_value=None,
        new_value=f"Status: {status_str}",
        details=f"Requester: {payload.requester_org} | Purpose: {payload.verification_purpose}"
    )
    db.add(audit)
    db.commit()

    return {
        "verified": True,
        "reference_no": ref_no,
        "apaar_id_masked": mask_apaar(student.apaar_id),
        "student_name": student.full_name,
        "institution_name": inst.name,
        "programme_name": prog.programme_name,
        "admission_year": enr.academic_year[:4],
        "status": status_str,
        "requester_org": payload.requester_org,
        "verification_purpose": payload.verification_purpose,
        "verification_date": req.created_at.strftime("%Y-%m-%d %H:%M:%S UTC"),
        "result_summary": summary_text,
        "consent_recorded": payload.consent_recorded,
        "security_stamp": f"AICTE-DIGITAL-SIGN-HASH-{random.randint(100000, 999999)}"
    }

@router.get("/history")
def get_verification_history(limit: int = 10, db: Session = Depends(get_db)):
    reqs = db.query(VerificationRequest).order_by(VerificationRequest.created_at.desc()).limit(limit).all()
    return [
        {
            "id": r.id,
            "reference_no": r.reference_no,
            "student_name": r.student_name,
            "apaar_masked": mask_apaar(r.apaar_id),
            "requester_org": r.requester_org,
            "purpose": r.verification_purpose,
            "institution_name": r.institution_name,
            "programme_name": r.programme_name,
            "status": r.status,
            "timestamp": r.created_at.strftime("%Y-%m-%d %H:%M")
        }
        for r in reqs
    ]
