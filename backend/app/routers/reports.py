import csv
import io
from fastapi import APIRouter, Depends, Response
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Student, StudentEnrolment, Programme, Institution, StudentValidationResult, DuplicateCase, AuditLog

router = APIRouter(prefix="/reports", tags=["Reports"])

@router.get("/enrolment.csv")
def export_enrolment_report(db: Session = Depends(get_db)):
    output = io.StringIO()
    writer = csv.writer(output)
    
    # Official Government Prototype Header
    writer.writerow(["# ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)"])
    writer.writerow(["# APAAR STUDENT DATA & VERIFICATION SYSTEM (ASDVS) - PROTOTYPE DEMONSTRATION"])
    writer.writerow(["# REPORT: NATIONAL STUDENT ENROLMENT REGISTRY"])
    writer.writerow([])
    writer.writerow(["Student ID", "Masked APAAR ID", "Student Name", "Institution AICTE ID", "Institution Name", "Programme", "Admission Year", "Category", "Seat Type", "Status"])

    students = (
        db.query(Student, StudentEnrolment, Programme, Institution)
        .join(StudentEnrolment, Student.id == StudentEnrolment.student_id)
        .join(Programme, StudentEnrolment.programme_id == Programme.id)
        .join(Institution, StudentEnrolment.institution_id == Institution.id)
        .all()
    )

    for s, e, p, inst in students:
        masked = f"********{s.apaar_id[-4:]}" if s.apaar_id and len(s.apaar_id) >= 4 else "Not Seeded"
        writer.writerow([
            s.id, masked, s.full_name, inst.aicte_id, inst.name,
            p.programme_name, e.academic_year, s.category, s.seat_type, s.student_status
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=aicte_enrolment_report_2026.csv"}
    )

@router.get("/validation.csv")
def export_validation_report(db: Session = Depends(get_db)):
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(["# ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)"])
    writer.writerow(["# REPORT: VALIDATION ISSUES & DISCREPANCY AUDIT"])
    writer.writerow([])
    writer.writerow(["Issue ID", "Timestamp", "Institution", "Student Name", "APAAR ID", "Rule Code", "Severity", "Message", "Status", "Resolution Notes"])

    issues = db.query(StudentValidationResult).order_by(StudentValidationResult.created_at.desc()).all()
    for i in issues:
        writer.writerow([
            i.id, i.created_at.strftime("%Y-%m-%d %H:%M"), i.institution_name,
            i.student_name, i.apaar_id, i.rule_code, i.severity, i.message, i.status, i.resolution_notes or ""
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=aicte_validation_issues_report.csv"}
    )

@router.get("/compliance.csv")
def export_compliance_report(db: Session = Depends(get_db)):
    output = io.StringIO()
    writer = csv.writer(output)
    
    writer.writerow(["# ALL INDIA COUNCIL FOR TECHNICAL EDUCATION (AICTE)"])
    writer.writerow(["# REPORT: APPROVED INTAKE VS ACTUAL ENROLMENT COMPLIANCE"])
    writer.writerow([])
    writer.writerow(["AICTE Inst ID", "Institution Name", "State", "Programme", "Approved Intake", "Regular Enrolment", "Supernumerary", "Variance", "Compliance Status"])

    programmes = (
        db.query(Programme, Institution)
        .join(Institution, Programme.institution_id == Institution.id)
        .all()
    )
    for p, inst in programmes:
        var = p.current_enrolment - p.approved_intake
        writer.writerow([
            inst.aicte_id, inst.name, inst.state, p.programme_name,
            p.approved_intake, p.current_enrolment, p.current_supernumerary,
            f"+{var}" if var > 0 else str(var), p.status
        ])

    return Response(
        content=output.getvalue(),
        media_type="text/csv",
        headers={"Content-Disposition": "attachment; filename=aicte_intake_compliance_report.csv"}
    )
