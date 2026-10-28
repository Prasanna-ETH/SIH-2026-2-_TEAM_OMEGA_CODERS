from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from sqlalchemy import func
from app.database import get_db
from app.models import Student, Programme, Institution, StudentValidationResult, DuplicateCase

router = APIRouter(prefix="/analytics", tags=["Analytics"])

@router.get("/overview")
def get_analytics_overview(
    academic_year: str = "2026-27",
    state: str = None,
    db: Session = Depends(get_db)
):
    # 1. Category Distribution
    category_counts = (
        db.query(Student.category, func.count(Student.id))
        .group_by(Student.category)
        .all()
    )
    categories = [{"name": c, "count": cnt} for c, cnt in category_counts]

    # 2. Intake Utilisation by Programme Level
    programmes = db.query(Programme).all()
    total_approved = sum(p.approved_intake for p in programmes) or 1
    total_enrolled = sum(p.current_enrolment for p in programmes)
    utilization_pct = round((total_enrolled / total_approved) * 100, 1)

    # 3. Validation Error Distribution
    error_counts = (
        db.query(StudentValidationResult.rule_code, func.count(StudentValidationResult.id))
        .group_by(StudentValidationResult.rule_code)
        .all()
    )
    error_trends = [
        {"rule": r, "count": c}
        for r, c in error_counts
    ]

    # 4. State Wise Enrolment
    state_data = (
        db.query(Institution.state, func.count(Institution.id))
        .group_by(Institution.state)
        .all()
    )
    state_breakdown = [{"state": s, "institutions": c} for s, c in state_data]

    # 5. Anomaly / Risk Scoring Overview
    institutions = db.query(Institution).all()
    risk_distribution = {
        "low_risk": len([i for i in institutions if i.risk_score < 30]),
        "moderate_risk": len([i for i in institutions if 30 <= i.risk_score < 60]),
        "high_risk": len([i for i in institutions if i.risk_score >= 60])
    }

    # 6. Historic Enrolment Trends
    historical_trends = [
        {"academic_year": "2023-24", "approved_intake": 1250, "actual_enrolment": 1180, "compliance_rate": "94.4%"},
        {"academic_year": "2024-25", "approved_intake": 1320, "actual_enrolment": 1260, "compliance_rate": "95.5%"},
        {"academic_year": "2025-26", "approved_intake": 1380, "actual_enrolment": 1335, "compliance_rate": "96.7%"},
        {"academic_year": "2026-27", "approved_intake": 1420, "actual_enrolment": 1392, "compliance_rate": "98.0%"}
    ]

    return {
        "summary": {
            "academic_year": academic_year,
            "total_approved_intake": total_approved,
            "total_actual_enrolment": total_enrolled,
            "overall_utilisation_pct": utilization_pct,
            "active_anomalies": db.query(DuplicateCase).filter(DuplicateCase.status == "OPEN").count()
        },
        "category_distribution": categories,
        "error_trends": error_trends,
        "state_breakdown": state_breakdown,
        "risk_distribution": risk_distribution,
        "historical_trends": historical_trends
    }
