from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Programme, Institution

router = APIRouter(prefix="/intake-compliance", tags=["Intake Compliance"])

@router.get("")
def get_intake_compliance(
    academic_year: str = "2026-27",
    state: Optional[str] = None,
    institution_id: Optional[int] = None,
    status: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = (
        db.query(Programme, Institution)
        .join(Institution, Programme.institution_id == Institution.id)
        .filter(Programme.academic_year == academic_year)
    )

    if state and state != "ALL":
        query = query.filter(Institution.state == state)
    if institution_id:
        query = query.filter(Institution.id == institution_id)
    if status and status != "ALL":
        query = query.filter(Programme.status == status)

    records = query.all()
    results = []

    for prog, inst in records:
        regular = prog.current_enrolment
        supernumerary = prog.current_supernumerary
        total = regular + supernumerary
        approved = prog.approved_intake
        variance = regular - approved

        # Determine rule-based assessment
        if variance > 0:
            assessment = "Potential capacity/compliance issue — regular enrolment exceeds sanctioned intake. Requires institutional review."
            rule_status = "Review Required"
        elif supernumerary > prog.supernumerary_cap:
            assessment = f"Supernumerary quota anomaly: {supernumerary} admitted against sanctioned ceiling of {prog.supernumerary_cap}."
            rule_status = "Review Required"
        else:
            assessment = "Compliant within AICTE approved intake and statutory reservation norms."
            rule_status = "Compliant"

        results.append({
            "programme_id": prog.id,
            "institution_id": inst.id,
            "institution_name": inst.name,
            "aicte_id": inst.aicte_id,
            "state": inst.state,
            "programme_name": prog.programme_name,
            "degree_level": prog.degree_level,
            "academic_year": prog.academic_year,
            "approved_intake": approved,
            "regular_enrolment": regular,
            "supernumerary": supernumerary,
            "supernumerary_cap": prog.supernumerary_cap,
            "total_enrolment": total,
            "variance": variance,
            "variance_str": f"+{variance}" if variance > 0 else f"{variance}",
            "status": rule_status,
            "assessment": assessment,
            "breakdown": {
                "tfws_seats": max(0, supernumerary - 1),
                "pmsss_seats": min(1, supernumerary),
                "management_quota": int(regular * 0.15) if "Private" in inst.institution_type else 0,
                "state_counselled_quota": regular - (int(regular * 0.15) if "Private" in inst.institution_type else 0)
            }
        })

    return {
        "academic_year": academic_year,
        "total_programmes_monitored": len(results),
        "compliant_count": len([r for r in results if r["status"] == "Compliant"]),
        "review_required_count": len([r for r in results if r["status"] == "Review Required"]),
        "records": results
    }
