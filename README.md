# AICTE APAAR Student Data Management & Verification System (ASDVS)
### Smart India Hackathon (SIH 2026) • Problem Statement: SIH26263

> **An APAAR ID-Based Student Data Governance, Intake Compliance Monitoring, and Authorized Academic Verification Platform for AICTE-Approved Institutions.**

---

## 🏛️ Executive Summary

Under the **National Education Policy (NEP 2020)**, the Government of India introduced **APAAR (Automated Permanent Academic Account Registry)** — the "One Nation, One Student ID". 

However, regulatory bodies face a fundamental governance challenge: **mere data collection does not guarantee data integrity or compliance**.

The **ASDVS** platform connects AICTE-approved institutions with a central regulatory governance engine. Built adhering strictly to Indian Government Portal Standards (GIGW), the platform automatically:
1. **Validates Student Data in Real-Time** (12-digit numeric APAAR format, age reasonableness, mandatory fields).
2. **Detects Cross-Institution Duplicate Enrolments** (students actively registered in multiple universities simultaneously).
3. **Monitors Approved Intake vs. Actual Admissions** (audits sanctioned regular capacity and supernumerary quotas like TFWS, PMSSS, and NRI).
4. **Provides Authorized Third-Party Verification** (generates tamper-evident digital verification certificates with QR codes for employers).
5. **Maintains an Immutable Regulatory Audit Trail** (cryptographically timestamped forensic log of all actions).

---

## 🌐 Live Cloud Deployment Guide

### A. Deploy Backend on Render (Free Tier)
1. Fork or push this repository to GitHub.
2. Sign in to [Render](https://render.com) and click **New +** ➔ **Web Service**.
3. Select your repository: `SIH-2026-2-_TEAM_OMEGA_CODERS`.
4. Configure service settings:
   - **Name:** `aicte-apaar-backend`
   - **Root Directory:** `backend`
   - **Runtime:** `Python 3`
   - **Build Command:** `pip install -r requirements.txt`
   - **Start Command:** `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
   - **Plan:** Free
5. Click **Deploy Web Service**.
6. Once deployed, copy your Render backend URL (e.g. `https://aicte-apaar-backend.onrender.com`).

### B. Deploy Frontend on Vercel (Free Tier)
1. Sign in to [Vercel](https://vercel.com) and click **Add New...** ➔ **Project**.
2. Select your repository: `SIH-2026-2-_TEAM_OMEGA_CODERS`.
3. Configure project settings:
   - **Framework Preset:** `Vite`
   - **Root Directory:** `frontend` (or leave as `./` with root `vercel.json`)
   - **Build Command:** `npm run build`
   - **Output Directory:** `dist`
4. Add **Environment Variable**:
   - `VITE_API_URL` = `https://<your-render-backend>.onrender.com` (your deployed Render URL)
5. Click **Deploy**. Vercel will build and assign your live production URL (e.g. `https://aicte-apaar.vercel.app`).

---

## 🔑 Demo Access Credentials

The prototype features a quick role-switcher in the header, as well as credentials for manual authentication:

| Role | User ID | Password | Context |
|---|---|---|---|
| **AICTE Central Administrator** | `AICTE_ADMIN` | `admin123` | Dr. Rajesh Sharma, Director (Approval & Governance), AICTE New Delhi |
| **Institution Administrator** | `INST_10021` | `demo123` | Dr. V. Narayanan, Dean Academics, ABC Institute of Technology |
| **Authorized Third-Party Verifier** | `VERIFIER_004` | `verify123` | Sanjay Mukhopadhyay, Background Verification Cell, TCS Ltd |

---

## 📁 Repository Structure

```
├── backend/
│   ├── app/
│   │   ├── main.py                  # FastAPI gateway & CORS configuration
│   │   ├── config.py                # Environment & SQLite/Postgres paths
│   │   ├── database.py              # SQLAlchemy engine & session factory
│   │   ├── models.py                # Database models (Students, Institutions, Intake, Audit)
│   │   ├── schemas.py               # Pydantic validation schemas
│   │   ├── validation_engine.py     # Multi-stage APAAR & intake rule processor
│   │   ├── seed_data.py             # Realistic Indian higher-education seed dataset
│   │   ├── routers/                 # Modular RESTful API controllers
│   │   │   ├── auth.py
│   │   │   ├── dashboard.py
│   │   │   ├── institutions.py
│   │   │   ├── students.py
│   │   │   ├── validation.py
│   │   │   ├── duplicates.py
│   │   │   ├── intake.py
│   │   │   ├── verifications.py
│   │   │   ├── analytics.py
│   │   │   ├── audit.py
│   │   │   ├── reports.py
│   │   │   └── notifications.py
│   │   └── services/                # Integration mock adapters (DigiLocker, NAD, AICTE)
│   ├── requirements.txt
│   ├── Procfile
│   └── run.py
├── frontend/
│   ├── src/
│   │   ├── components/              # Header, TopGovStrip, Navigation, Footer, Modals
│   │   ├── context/                 # AuthContext, LanguageContext (Bilingual i18n)
│   │   ├── locales/                 # en.json, hi.json (Full English / हिन्दी translation)
│   │   ├── pages/                   # All 10 regulatory & institution workflow pages
│   │   └── api/client.ts            # Typed API client with VITE_API_URL support
│   ├── public/                      # Static assets & sample demo datasets
│   ├── package.json
│   ├── vite.config.ts
│   └── vercel.json
├── sample_upload_data/
│   └── sample_student_batch_127.csv # Flagship SIH 127-student demo batch
├── render.yaml                      # Render Blueprint specification
├── vercel.json                      # Vercel Root deployment specification
├── pitch_deck_5_min.md              # 5-minute SIH presentation guide & script
└── .gitignore
```

---

## 💻 Local Quickstart

### Prerequisites
- Python 3.10+
- Node.js 18+

### 1. Start Backend API
```bash
cd backend
python -m pip install -r requirements.txt
python -m app.seed_data
python run.py
```
*Backend runs on `http://127.0.0.1:8000` with interactive Swagger docs at `http://127.0.0.1:8000/docs`.*

### 2. Start Frontend App
```bash
cd frontend
npm install
npm run dev
```
*Frontend runs on `http://127.0.0.1:5173`.*

---

## 🏆 SIH Demonstration Highlights
- **No Generative AI Marketing Slop:** Clean, deterministic, explainable rule engines.
- **Privacy By Design:** Student APAAR IDs are masked as `********1001` across public tables to comply with the DPDP Act.
- **Bilingual Accessibility:** Instant language switching between English and Hindi without page reloads.
- **Forensic Auditability:** Immutable log capturing every transition, user ID, role, and prior state.

---
*Built for the Smart India Hackathon (SIH 2026) • Team OMEGA CODERS*
