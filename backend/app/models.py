from datetime import datetime
from sqlalchemy import (
    Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
)
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"

    id = Column(Integer, primary_key=True, index=True)
    username = Column(String(50), unique=True, index=True, nullable=False)
    password_hash = Column(String(128), nullable=False)
    role = Column(String(30), nullable=False)  # AICTE_ADMIN, INSTITUTION, VERIFIER
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=True)
    full_name = Column(String(100), nullable=False)
    designation = Column(String(100), nullable=True)
    email = Column(String(100), nullable=False)
    phone = Column(String(20), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    institution = relationship("Institution", back_populates="users")


class Institution(Base):
    __tablename__ = "institutions"

    id = Column(Integer, primary_key=True, index=True)
    aicte_id = Column(String(50), unique=True, index=True, nullable=False)  # e.g. AICTE/DEMO/10021
    name = Column(String(200), nullable=False)
    state = Column(String(100), nullable=False)
    district = Column(String(100), nullable=False)
    institution_type = Column(String(100), nullable=False)  # Government, Private, Deemed, Autonomous
    approval_status = Column(String(50), default="AICTE Approved")  # AICTE Approved, Under Review, Attention Required
    risk_score = Column(Integer, default=15)  # 0 to 100
    risk_signals = Column(Text, nullable=True)  # JSON or comma-separated list of flags
    address = Column(String(300), nullable=True)
    contact_email = Column(String(100), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    users = relationship("User", back_populates="institution")
    programmes = relationship("Programme", back_populates="institution")
    enrolments = relationship("StudentEnrolment", back_populates="institution")
    submissions = relationship("InstitutionSubmission", back_populates="institution")


class Programme(Base):
    __tablename__ = "programmes"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    programme_name = Column(String(150), nullable=False)  # e.g. B.Tech Computer Science and Engineering
    degree_level = Column(String(50), default="Undergraduate")  # Undergraduate, Postgraduate, Diploma
    approved_intake = Column(Integer, nullable=False)
    academic_year = Column(String(20), default="2026-27")
    supernumerary_cap = Column(Integer, default=10)
    current_enrolment = Column(Integer, default=0)
    current_supernumerary = Column(Integer, default=0)
    status = Column(String(50), default="Compliant")  # Compliant, Review Required, Capacity Exceeded

    institution = relationship("Institution", back_populates="programmes")
    enrolments = relationship("StudentEnrolment", back_populates="programme")


class Student(Base):
    __tablename__ = "students"

    id = Column(Integer, primary_key=True, index=True)
    apaar_id = Column(String(20), unique=True, index=True, nullable=True)  # 12 digits or null
    full_name = Column(String(150), nullable=False)
    dob = Column(String(20), nullable=False)  # YYYY-MM-DD
    gender = Column(String(20), nullable=False)  # Male, Female, Other
    category = Column(String(50), default="General")  # General, OBC-NCL, SC, ST, EWS
    seat_type = Column(String(50), default="Regular")  # Regular, TFWS, Management, Govt Quota
    is_supernumerary = Column(Boolean, default=False)
    supernumerary_type = Column(String(50), nullable=True)  # TFWS, J&K PMSSS, Sports, NRI, None
    nri_status = Column(Boolean, default=False)
    oci_status = Column(Boolean, default=False)
    foreign_national = Column(Boolean, default=False)
    student_status = Column(String(50), default="Active")  # Active, Verified, Pending Correction, Transferred
    verification_status = Column(String(50), default="VERIFIED")  # VERIFIED, UNVERIFIED, CONFLICT
    created_at = Column(DateTime, default=datetime.utcnow)

    enrolments = relationship("StudentEnrolment", back_populates="student")
    validation_results = relationship("StudentValidationResult", back_populates="student")


class StudentEnrolment(Base):
    __tablename__ = "student_enrolments"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=False)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    programme_id = Column(Integer, ForeignKey("programmes.id"), nullable=False)
    enrollment_no = Column(String(100), nullable=False)
    academic_year = Column(String(20), default="2026-27")
    admission_session = Column(String(50), default="Regular Autumn 2026")
    admission_date = Column(String(20), nullable=False)
    status = Column(String(50), default="Active")  # Active, Transferred, Cancelled, Completed

    student = relationship("Student", back_populates="enrolments")
    institution = relationship("Institution", back_populates="enrolments")
    programme = relationship("Programme", back_populates="enrolments")


class StudentValidationResult(Base):
    __tablename__ = "student_validation_results"

    id = Column(Integer, primary_key=True, index=True)
    student_id = Column(Integer, ForeignKey("students.id"), nullable=True)
    student_name = Column(String(150), nullable=True)
    apaar_id = Column(String(30), nullable=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=True)
    institution_name = Column(String(200), nullable=True)
    batch_submission_id = Column(Integer, ForeignKey("institution_submissions.id"), nullable=True)
    rule_code = Column(String(50), nullable=False)  # FORMAT_APAAR, DUPLICATE_APAAR, CROSS_INSTITUTION, CAPACITY_BREACH, DOB_ANOMALY
    severity = Column(String(20), nullable=False)  # ERROR, WARNING, ALERT, INFO
    message = Column(Text, nullable=False)
    status = Column(String(30), default="OPEN")  # OPEN, RESOLVED, UNDER_REVIEW, DISMISSED
    resolution_notes = Column(Text, nullable=True)
    resolved_by = Column(String(100), nullable=True)
    resolved_at = Column(DateTime, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)

    student = relationship("Student", back_populates="validation_results")


class DuplicateCase(Base):
    __tablename__ = "duplicate_cases"

    id = Column(Integer, primary_key=True, index=True)
    apaar_id = Column(String(30), nullable=False, index=True)
    student_name = Column(String(150), nullable=False)
    primary_institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    primary_institution_name = Column(String(200), nullable=False)
    primary_programme = Column(String(150), nullable=False)
    primary_enrolment_no = Column(String(100), nullable=True)

    secondary_institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    secondary_institution_name = Column(String(200), nullable=False)
    secondary_programme = Column(String(150), nullable=False)
    secondary_enrolment_no = Column(String(100), nullable=True)

    academic_year = Column(String(20), default="2026-27")
    conflict_type = Column(String(100), default="POTENTIAL CONCURRENT ENROLMENT")
    flag_reasons = Column(Text, nullable=False)  # e.g. Same APAAR ID, Multiple active institutions, Overlapping admission
    status = Column(String(50), default="OPEN")  # OPEN, UNDER_INVESTIGATION, VALID_TRANSFER, RESOLVED
    resolution_action = Column(String(100), nullable=True)
    resolution_notes = Column(Text, nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    resolved_at = Column(DateTime, nullable=True)


class InstitutionSubmission(Base):
    __tablename__ = "institution_submissions"

    id = Column(Integer, primary_key=True, index=True)
    institution_id = Column(Integer, ForeignKey("institutions.id"), nullable=False)
    programme_id = Column(Integer, ForeignKey("programmes.id"), nullable=False)
    academic_year = Column(String(20), default="2026-27")
    batch_name = Column(String(150), nullable=False)
    file_name = Column(String(200), nullable=False)
    total_records = Column(Integer, default=0)
    valid_count = Column(Integer, default=0)
    warning_count = Column(Integer, default=0)
    error_count = Column(Integer, default=0)
    status = Column(String(50), default="PROCESSED")  # PROCESSED, REVIEW_REQUIRED, REJECTED
    submitted_by = Column(String(100), default="INST_10021")
    created_at = Column(DateTime, default=datetime.utcnow)

    institution = relationship("Institution", back_populates="submissions")


class VerificationRequest(Base):
    __tablename__ = "verification_requests"

    id = Column(Integer, primary_key=True, index=True)
    reference_no = Column(String(50), unique=True, index=True, nullable=False)  # AICTE-VER-2026-000184
    apaar_id = Column(String(30), nullable=False)
    student_name = Column(String(150), nullable=False)
    requester_org = Column(String(200), nullable=False)
    verification_purpose = Column(String(150), nullable=False)
    consent_recorded = Column(Boolean, default=True)
    status = Column(String(50), default="VERIFIED")  # VERIFIED, UNVERIFIED, NOT_FOUND
    result_summary = Column(Text, nullable=True)
    institution_name = Column(String(200), nullable=True)
    programme_name = Column(String(150), nullable=True)
    admission_year = Column(String(20), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)


class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(Integer, primary_key=True, index=True)
    timestamp = Column(DateTime, default=datetime.utcnow)
    user_id = Column(String(50), nullable=False)
    role = Column(String(50), nullable=False)
    action = Column(String(100), nullable=False)  # e.g. Uploaded student dataset, Resolved validation issue
    entity_type = Column(String(50), nullable=False)  # Student, Submission, ValidationIssue, Verification
    entity_id = Column(String(50), nullable=True)
    previous_value = Column(Text, nullable=True)
    new_value = Column(Text, nullable=True)
    ip_address = Column(String(50), default="10.24.1.88")
    status = Column(String(30), default="COMPLETED")
    details = Column(Text, nullable=True)


class Notification(Base):
    __tablename__ = "notifications"

    id = Column(Integer, primary_key=True, index=True)
    user_role = Column(String(50), default="ALL")  # ALL, AICTE_ADMIN, INSTITUTION
    institution_id = Column(Integer, nullable=True)
    title = Column(String(200), nullable=False)
    message = Column(Text, nullable=False)
    severity = Column(String(20), default="info")  # info, warning, error, success
    is_read = Column(Boolean, default=False)
    link_url = Column(String(200), nullable=True)
    created_at = Column(DateTime, default=datetime.utcnow)
