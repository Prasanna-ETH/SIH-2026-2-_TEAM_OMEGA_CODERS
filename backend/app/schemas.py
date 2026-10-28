from typing import List, Optional, Any, Dict
from pydantic import BaseModel
from datetime import datetime

class LoginRequest(BaseModel):
    username: str
    password: str
    role: Optional[str] = None
    captcha: Optional[str] = None

class UserResponse(BaseModel):
    id: int
    username: str
    role: str
    institution_id: Optional[int] = None
    institution_name: Optional[str] = None
    full_name: str
    email: str
    designation: Optional[str] = None

class LoginResponse(BaseModel):
    access_token: str
    token_type: str = "bearer"
    user: UserResponse

class StudentValidationItem(BaseModel):
    rule: str
    severity: str
    message: str
    status: str = "OPEN"

class StudentRecordSchema(BaseModel):
    apaar_id: Optional[str] = None
    full_name: str
    dob: str
    gender: str
    category: str = "General"
    seat_type: str = "Regular"
    is_supernumerary: bool = False
    supernumerary_type: Optional[str] = None
    nri_status: bool = False
    oci_status: bool = False
    foreign_national: bool = False
    institution_id: Optional[int] = None
    programme_id: Optional[int] = None
    programme_name: Optional[str] = None
    enrollment_no: str
    academic_year: str = "2026-27"
    admission_date: str
    student_status: str = "Active"

class UploadPrevalidationSummary(BaseModel):
    total_records: int
    valid_count: int
    warning_count: int
    error_count: int
    duplicate_signals: int
    items: List[Dict[str, Any]]
    submission_id: Optional[int] = None

class ResolveIssueRequest(BaseModel):
    action: str  # RESOLVE, REQUEST_CORRECTION, DISMISS
    resolution_notes: str
    updated_apaar_id: Optional[str] = None

class VerificationRequestPayload(BaseModel):
    identifier: str  # APAAR ID or AICTE-VER- reference
    requester_org: str
    verification_purpose: str
    consent_recorded: bool = True

class DuplicateResolvePayload(BaseModel):
    action: str  # MARK_VALID_TRANSFER, REQUEST_CLARIFICATION, RESOLVE
    notes: str
