import os
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

class Settings:
    PROJECT_NAME: str = "AICTE APAAR Student Data & Verification System (ASDVS)"
    PROJECT_VERSION: str = "1.0.0-PROTOTYPE"
    API_PREFIX: str = "/api"
    DB_PATH = BASE_DIR / "asdvs.db"
    DATABASE_URL: str = os.getenv("DATABASE_URL", f"sqlite:///{DB_PATH}")
    SECRET_KEY: str = os.getenv("SECRET_KEY", "aicte-sih-prototype-secret-key-2026")
    ENVIRONMENT: str = "PROTOTYPE_DEMO"

settings = Settings()
