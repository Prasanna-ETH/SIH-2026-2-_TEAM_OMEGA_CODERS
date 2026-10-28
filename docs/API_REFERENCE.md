# ASDVS API Reference

## AICTE APAAR Student Data & Verification System — API Endpoints

**Base URL**: `/api`  
**Prototype Version**: 1.0.0

---

## Authentication

### POST `/api/auth/login`
Login with role-based credentials.

**Request Body**:
```json
{
  "username": "aicte_admin",
  "password": "aicte@2024",
  "role": "AICTE_ADMIN"
}
```

**Response**:
```json
{
  "success": true,
  "user": {
    "id": 1,
    "username": "aicte_admin",
    "full_name": "Dr. Rajesh Kumar",
    "role": "AICTE_ADMIN",
    "institution_id": null
  },
  "token": "demo-token"
}
```

---

## Dashboard

### GET `/api/dashboard/aicte-summary`
Returns national AICTE overview statistics.

### GET `/api/dashboard/institution-summary/{institution_id}`
Returns institution-specific dashboard data.

---

## Institutions

### GET `/api/institutions`
List all AICTE-approved institutions.

**Query Params**: `state`, `status`, `search`, `page`, `limit`

### GET `/api/institutions/{id}`
Get detailed institution profile with programmes.

---

## Students

### GET `/api/students`
List students with filtering.

**Query Params**: `institution_id`, `programme_id`, `category`, `search`, `page`, `limit`

### GET `/api/students/{id}`
Get detailed student record with validation history.

### POST `/api/students/upload-prevalidate`
Upload and pre-validate a CSV batch before committing.

**Content-Type**: `multipart/form-data`  
**Field**: `file` (CSV), `institution_id`, `programme_id`, `academic_year`

### POST `/api/students/upload-commit`
Commit a validated batch to the database.

---

## Validation

### GET `/api/validation/issues`
List all validation issues.

**Query Params**: `severity` (ERROR/WARNING/INFO), `status` (OPEN/RESOLVED), `institution_id`

### POST `/api/validation/{id}/resolve`
Resolve a specific validation issue.

---

## Duplicate Detection

### GET `/api/duplicates`
List detected duplicate APAAR ID cases.

**Query Params**: `status` (OPEN/REVIEWING/RESOLVED)

### POST `/api/duplicates/{id}/action`
Take action on a duplicate case (merge/keep/escalate).

---

## Intake Compliance

### GET `/api/intake-compliance`
List programme intake compliance records.

**Query Params**: `academic_year`, `state`, `institution_id`, `status`

---

## Verification Portal

### POST `/api/verifications/verify`
Verify a student by APAAR ID or roll number.

**Request Body**:
```json
{
  "identifier": "123456789012",
  "requester_org": "Infosys Technologies",
  "verification_purpose": "Employment Verification",
  "consent_recorded": true
}
```

### GET `/api/verifications/history`
List all verification requests.

---

## Analytics

### GET `/api/analytics/overview`
National analytics overview with charts data.

---

## Audit

### GET `/api/audit-logs`
Retrieve audit trail.

**Query Params**: `role`, `action`, `user_id`, `page`, `limit`

---

## Notifications

### GET `/api/notifications`
Get role-based system notifications.

**Query Params**: `user_role`

---

## Reports

### GET `/api/reports/national-summary`
Export national data summary report.

### GET `/api/reports/institution/{id}`
Export institution-specific compliance report.
