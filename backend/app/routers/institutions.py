from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Institution, Programme, InstitutionSubmission, StudentValidationResult

router = APIRouter(prefix="/institutions", tags=["Institutions"])

@router.get("")
def list_institutions(state: str = None, status: str = None, db: Session = Depends(get_db)):
    query = db.query(Institution)
    if state:
        query = query.filter(Institution.state == state)
    if status:
        query = query.filter(Institution.approval_status == status)
    
    institutions = query.all()
    results = []
    for inst in institutions:
        prog_count = db.query(Programme).filter(Programme.institution_id == inst.id).count()
        issues_count = db.query(StudentValidationResult).filter(
            StudentValidationResult.institution_id == inst.id,
            StudentValidationResult.status == "OPEN"
        ).count()
        results.append({
            "id": inst.id,
            "aicte_id": inst.aicte_id,
            "name": inst.name,
            "state": inst.state,
            "district": inst.district,
            "institution_type": inst.institution_type,
            "approval_status": inst.approval_status,
            "risk_score": inst.risk_score,
            "programmes_count": prog_count,
            "open_issues": issues_count
        })
    return results

@router.get("/{id}")
def get_institution_profile(id: int, db: Session = Depends(get_db)):
    inst = db.query(Institution).filter(Institution.id == id).first()
    if not inst:
        raise HTTPException(status_code=404, detail="Institution not found")

    programmes = db.query(Programme).filter(Programme.institution_id == inst.id).all()
    submissions = (
        db.query(InstitutionSubmission)
        .filter(InstitutionSubmission.institution_id == inst.id)
        .order_by(InstitutionSubmission.created_at.desc())
        .all()
    )

    return {
        "basic_info": {
            "id": inst.id,
            "aicte_id": inst.aicte_id,
            "name": inst.name,
            "state": inst.state,
            "district": inst.district,
            "institution_type": inst.institution_type,
            "approval_status": inst.approval_status,
            "risk_score": inst.risk_score,
            "risk_signals": inst.risk_signals,
            "address": inst.address,
            "contact_email": inst.contact_email
        },
        "programmes": [
            {
                "id": p.id,
                "programme_name": p.programme_name,
                "degree_level": p.degree_level,
                "approved_intake": p.approved_intake,
                "current_enrolment": p.current_enrolment,
                "supernumerary": p.current_supernumerary,
                "supernumerary_cap": p.supernumerary_cap,
                "status": p.status
            }
            for p in programmes
        ],
        "submissions": [
            {
                "id": s.id,
                "date": s.created_at.strftime("%Y-%m-%d"),
                "academic_year": s.academic_year,
                "batch_name": s.batch_name,
                "total_records": s.total_records,
                "valid": s.valid_count,
                "warnings": s.warning_count,
                "errors": s.error_count,
                "status": s.status
            }
            for s in submissions
        ]
    }
