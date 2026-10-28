from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import User, Institution
from app.schemas import LoginRequest, LoginResponse, UserResponse

router = APIRouter(prefix="/auth", tags=["Authentication"])

@router.post("/login", response_model=LoginResponse)
def login(payload: LoginRequest, db: Session = Depends(get_db)):
    username = payload.username.strip().upper()
    user = db.query(User).filter(User.username == username).first()
    
    if not user:
        # Check if case-insensitive match
        user = db.query(User).filter(User.username.ilike(payload.username.strip())).first()
    
    if not user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid credentials. For prototype demo, use AICTE_ADMIN or INST_10021."
        )

    inst_name = None
    if user.institution_id:
        inst = db.query(Institution).filter(Institution.id == user.institution_id).first()
        if inst:
            inst_name = inst.name

    user_resp = UserResponse(
        id=user.id,
        username=user.username,
        role=user.role,
        institution_id=user.institution_id,
        institution_name=inst_name,
        full_name=user.full_name,
        email=user.email,
        designation=user.designation
    )

    # Prototype token
    token = f"mock-jwt-token-{user.role.lower()}-{user.id}"

    return LoginResponse(
        access_token=token,
        token_type="bearer",
        user=user_resp
    )

@router.get("/me")
def get_current_user_info(username: str = "AICTE_ADMIN", db: Session = Depends(get_db)):
    user = db.query(User).filter(User.username == username).first()
    if not user:
        user = db.query(User).first()
    
    inst_name = None
    if user and user.institution_id:
        inst = db.query(Institution).filter(Institution.id == user.institution_id).first()
        if inst:
            inst_name = inst.name

    return {
        "id": user.id if user else 1,
        "username": user.username if user else "AICTE_ADMIN",
        "role": user.role if user else "AICTE_ADMIN",
        "institution_id": user.institution_id if user else None,
        "institution_name": inst_name,
        "full_name": user.full_name if user else "Dr. Rajesh Sharma",
        "email": user.email if user else "admin@aicte-india.gov.in"
    }
