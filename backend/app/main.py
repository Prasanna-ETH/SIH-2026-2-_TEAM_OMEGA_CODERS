from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.config import settings
from app.database import engine, Base, SessionLocal
from app.models import User
from app.seed_data import seed_database

# Include Routers
from app.routers import (
    auth, dashboard, institutions, students,
    validation, duplicates, intake, verifications,
    analytics, audit, reports, notifications
)

app = FastAPI(
    title=settings.PROJECT_NAME,
    version=settings.PROJECT_VERSION,
    description="Backend API for AICTE APAAR Student Data Management & Verification Platform (SIH26263 Prototype)"
)

# Enable CORS for local Vite frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.on_event("startup")
def startup_event():
    Base.metadata.create_all(bind=engine)
    # Check if seeded
    db = SessionLocal()
    try:
        user_count = db.query(User).count()
        if user_count == 0:
            print("[INFO] No seed data detected. Initializing database with demo records...")
            seed_database()
        else:
            print("[INFO] Database verified with existing records.")
    finally:
        db.close()

# Register Routers
app.include_router(auth.router, prefix=settings.API_PREFIX)
app.include_router(dashboard.router, prefix=settings.API_PREFIX)
app.include_router(institutions.router, prefix=settings.API_PREFIX)
app.include_router(students.router, prefix=settings.API_PREFIX)
app.include_router(validation.router, prefix=settings.API_PREFIX)
app.include_router(duplicates.router, prefix=settings.API_PREFIX)
app.include_router(intake.router, prefix=settings.API_PREFIX)
app.include_router(verifications.router, prefix=settings.API_PREFIX)
app.include_router(analytics.router, prefix=settings.API_PREFIX)
app.include_router(audit.router, prefix=settings.API_PREFIX)
app.include_router(reports.router, prefix=settings.API_PREFIX)
app.include_router(notifications.router, prefix=settings.API_PREFIX)

@app.get("/")
def root():
    return {
        "system": settings.PROJECT_NAME,
        "environment": "PROTOTYPE_DEMO",
        "status": "OPERATIONAL",
        "docs_url": "/docs",
        "api_prefix": settings.API_PREFIX
    }
