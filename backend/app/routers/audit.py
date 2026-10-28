from typing import Optional
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import AuditLog

router = APIRouter(prefix="/audit-logs", tags=["Audit Trail"])

@router.get("")
def get_audit_trail(
    role: Optional[str] = None,
    action: Optional[str] = None,
    user_id: Optional[str] = None,
    page: int = 1,
    limit: int = 50,
    db: Session = Depends(get_db)
):
    query = db.query(AuditLog)

    if role and role != "ALL":
        query = query.filter(AuditLog.role == role)
    if user_id:
        query = query.filter(AuditLog.user_id.ilike(f"%{user_id}%"))
    if action:
        query = query.filter(AuditLog.action.ilike(f"%{action}%"))

    total = query.count()
    offset = (page - 1) * limit
    logs = query.order_by(AuditLog.timestamp.desc()).offset(offset).limit(limit).all()

    return {
        "total": total,
        "page": page,
        "limit": limit,
        "logs": [
            {
                "id": log.id,
                "timestamp": log.timestamp.strftime("%Y-%m-%d %H:%M:%S"),
                "user": log.user_id,
                "role": log.role,
                "action": log.action,
                "entity": f"{log.entity_type} #{log.entity_id}" if log.entity_id else log.entity_type,
                "previous_value": log.previous_value or "None",
                "new_value": log.new_value or "N/A",
                "details": log.details,
                "status": log.status,
                "ip_address": log.ip_address
            }
            for log in logs
        ]
    }
