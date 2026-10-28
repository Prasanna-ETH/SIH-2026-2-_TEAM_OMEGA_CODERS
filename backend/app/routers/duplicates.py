from datetime import datetime
from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import DuplicateCase, AuditLog, Student, Notification
from app.schemas import DuplicateResolvePayload

router = APIRouter(prefix="/duplicates", tags=["Duplicate Detection"])

def mask_apaar(apaar: str) -> str:
    clean = str(apaar).replace("-", "").strip()
    if len(clean) >= 4:
        return f"********{clean[-4:]}"
    return "********"

@router.get("")
def list_duplicate_cases(status: str = None, db: Session = Depends(get_db)):
    query = db.query(DuplicateCase)
    if status and status != "ALL":
        query = query.filter(DuplicateCase.status == status)

    cases = query.order_by(DuplicateCase.id.desc()).all()
    results = []
    for c in cases:
        results.append({
            "id": c.id,
            "apaar_id": c.apaar_id,
            "apaar_id_masked": mask_apaar(c.apaar_id),
            "student_name": c.student_name,
            "conflict_type": c.conflict_type,
            "academic_year": c.academic_year,
            "primary_institution": {
                "id": c.primary_institution_id,
                "name": c.primary_institution_name,
                "programme": c.primary_programme,
                "enrolment_no": c.primary_enrolment_no,
                "status": "Active Enrolment"
            },
            "secondary_institution": {
                "id": c.secondary_institution_id,
                "name": c.secondary_institution_name,
                "programme": c.secondary_programme,
                "enrolment_no": c.secondary_enrolment_no,
                "status": "Active Enrolment"
            },
            "flag_reasons": [
                "Identical 12-digit APAAR National ID",
                "Multiple active higher-education institution enrolments",
                "Overlapping academic session (2026-27)",
                "No official inter-state transfer clearance recorded"
            ],
            "status": c.status,
            "resolution_action": c.resolution_action,
            "resolution_notes": c.resolution_notes,
            "created_at": c.created_at.strftime("%Y-%m-%d %H:%M"),
            "resolved_at": c.resolved_at.strftime("%Y-%m-%d %H:%M") if c.resolved_at else None
        })

    return {
        "total": len(results),
        "open_conflicts": len([r for r in results if r["status"] == "OPEN"]),
        "under_investigation": len([r for r in results if r["status"] == "UNDER_INVESTIGATION"]),
        "resolved": len([r for r in results if r["status"] in ["RESOLVED", "VALID_TRANSFER"]]),
        "cases": results
    }

@router.post("/{id}/action")
def take_duplicate_action(
    id: int,
    payload: DuplicateResolvePayload,
    current_user: str = "AICTE_ADMIN",
    db: Session = Depends(get_db)
):
    case = db.query(DuplicateCase).filter(DuplicateCase.id == id).first()
    if not case:
        raise HTTPException(status_code=404, detail="Duplicate case not found")

    action = payload.action.upper()
    notes = payload.notes
    prev_status = case.status

    if action == "MARK_VALID_TRANSFER":
        case.status = "VALID_TRANSFER"
        case.resolution_action = "Validated Authorized Migration"
        case.resolution_notes = f"Verified official migration certificate and migration NOC. Notes: {notes}"
        case.resolved_at = datetime.utcnow()
    elif action == "REQUEST_CLARIFICATION":
        case.status = "UNDER_INVESTIGATION"
        case.resolution_action = "Institutional Inquiry Notice Issued"
        case.resolution_notes = f"Notice sent to both institutions to submit attendance and admission verification. Notes: {notes}"
    elif action == "RESOLVE":
        case.status = "RESOLVED"
        case.resolution_action = "Administrative Cancellation of Duplicate"
        case.resolution_notes = f"Resolved by AICTE Directorate. Notes: {notes}"
        case.resolved_at = datetime.utcnow()
    else:
        case.status = "UNDER_INVESTIGATION"
        case.resolution_notes = notes

    # Audit log
    audit = AuditLog(
        user_id=current_user,
        role="AICTE_ADMIN",
        action=f"Cross-Institution Action: {action}",
        entity_type="DuplicateCase",
        entity_id=str(case.id),
        previous_value=f"Status: {prev_status}",
        new_value=f"Status: {case.status}",
        details=f"Student: {case.student_name} (APAAR: {mask_apaar(case.apaar_id)}) | Notes: {notes}"
    )
    db.add(audit)

    # Notification
    notif = Notification(
        user_role="INSTITUTION",
        institution_id=case.primary_institution_id,
        title="Duplicate Conflict Case Updated",
        message=f"Case #{case.id} for student {case.student_name} updated to {case.status} by AICTE Directorate.",
        severity="info",
        link_url="/duplicates"
    )
    db.add(notif)

    db.commit()

    return {
        "success": True,
        "message": f"Action '{action}' recorded successfully for Case #{id}.",
        "new_status": case.status
    }
