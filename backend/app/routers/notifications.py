from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import Notification

router = APIRouter(prefix="/notifications", tags=["Notifications"])

@router.get("")
def get_notifications(user_role: str = "ALL", limit: int = 20, db: Session = Depends(get_db)):
    query = db.query(Notification)
    if user_role != "ALL":
        query = query.filter((Notification.user_role == user_role) | (Notification.user_role == "ALL"))
    
    notifications = query.order_by(Notification.created_at.desc()).limit(limit).all()
    unread_count = query.filter(Notification.is_read == False).count()

    return {
        "unread_count": unread_count,
        "notifications": [
            {
                "id": n.id,
                "title": n.title,
                "message": n.message,
                "severity": n.severity,
                "is_read": n.is_read,
                "link_url": n.link_url,
                "created_at": n.created_at.strftime("%Y-%m-%d %H:%M")
            }
            for n in notifications
        ]
    }

@router.post("/{id}/read")
def mark_notification_read(id: int, db: Session = Depends(get_db)):
    notif = db.query(Notification).filter(Notification.id == id).first()
    if notif:
        notif.is_read = True
        db.commit()
    return {"success": True}
