from datetime import datetime
from typing import Optional
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import StudentValidationResult, Student, AuditLog
from app.schemas import ResolveIssueRequest

router = APIRouter(prefix="/validation", tags=["Validation Centre"])

@router.get("/issues")
def list_validation_issues(
    severity: Optional[str] = None,
    status: Optional[str] = None,
    institution_id: Optional[int] = None,
    db: Session = Depends(get_db)
):
    query = db.query(StudentValidationResult)

    if severity and severity != "ALL":
        query = query.filter(StudentValidationResult.severity == severity.upper())
    if status and status != "ALL":
        query = query.filter(StudentValidationResult.status == status.upper())
    if institution_id:
        query = query.filter(StudentValidationResult.institution_id == institution_id)

    issues = query.order_by(StudentValidationResult.created_at.desc()).all()

    results = []
    for iss in issues:
        results.append({
            "id": iss.id,
            "student_id": iss.student_id,
            "student": iss.student_name or "N/A",
            "apaar": iss.apaar_id or "Not Provided",
            "institution": iss.institution_name or "AICTE Central Registry",
            "institution_id": iss.institution_id,
            "issue": iss.message,
            "rule_code": iss.rule_code,
            "severity": iss.severity,
            "status": iss.status,
            "resolution_notes": iss.resolution_notes,
            "resolved_by": iss.resolved_by,
            "resolved_at": iss.resolved_at.strftime("%Y-%m-%d %H:%M") if iss.resolved_at else None,
            "created_at": iss.created_at.strftime("%Y-%m-%d %H:%M")
        })

    # Summary counts for tabs
    total_count = db.query(StudentValidationResult).count()
    error_count = db.query(StudentValidationResult).filter(StudentValidationResult.severity == "ERROR").count()
    warning_count = db.query(StudentValidationResult).filter(StudentValidationResult.severity.in_(["WARNING", "ALERT"])).count()
    resolved_count = db.query(StudentValidationResult).filter(StudentValidationResult.status == "RESOLVED").count()

    return {
        "counts": {
            "total": total_count,
            "errors": error_count,
            "warnings": warning_count,
            "resolved": resolved_count
        },
        "issues": results
    }

@router.post("/{id}/resolve")
def resolve_validation_issue(
    id: int,
    payload: ResolveIssueRequest,
    current_user: str = "AICTE_ADMIN",
    db: Session = Depends(get_db)
):
    issue = db.query(StudentValidationResult).filter(StudentValidationResult.id == id).first()
    if not issue:
        raise HTTPException(status_code=404, detail="Validation issue record not found")

    prev_status = issue.status
    if payload.action == "RESOLVE":
        issue.status = "RESOLVED"
        issue.resolved_by = current_user
        issue.resolved_at = datetime.utcnow()
        issue.resolution_notes = payload.resolution_notes
        
        # If student exists and APAAR was corrected
        if issue.student_id and payload.updated_apaar_id:
            std = db.query(Student).filter(Student.id == issue.student_id).first()
            if std:
                std.apaar_id = payload.updated_apaar_id
                std.verification_status = "VERIFIED"
    elif payload.action == "REQUEST_CORRECTION":
        issue.status = "UNDER_REVIEW"
        issue.resolution_notes = f"Correction requested: {payload.resolution_notes}"
    elif payload.action == "DISMISS":
        issue.status = "DISMISSED"
        issue.resolution_notes = f"Dismissed by {current_user}: {payload.resolution_notes}"

    # Log to Audit trail
    audit = AuditLog(
        user_id=current_user,
        role="AICTE_ADMIN" if "ADMIN" in current_user else "INSTITUTION",
        action="Resolved validation issue",
        entity_type="ValidationIssue",
        entity_id=str(issue.id),
        previous_value=f"Status: {prev_status}",
        new_value=f"Status: {issue.status}",
        details=f"Rule: {issue.rule_code} | Notes: {payload.resolution_notes}"
    )
    db.add(audit)
    db.commit()

    return {
        "success": True,
        "message": f"Validation issue #{id} successfully updated to {issue.status}",
        "status": issue.status
    }
