# ASDVS Deployment Guide

## AICTE APAAR Student Data & Verification System (ASDVS)
**SIH Prototype — SIH26263**

---

## 1. Architecture Overview

```
┌──────────────────────────────────────────────────────┐
│               ASDVS Production Architecture          │
├──────────────┬──────────────────┬────────────────────┤
│   Frontend   │     Backend      │     Database       │
│   (Vercel)   │    (Render)      │   (SQLite/Pg)      │
│   React +    │   FastAPI +      │   SQLAlchemy ORM   │
│   Vite       │   Uvicorn        │                    │
└──────────────┴──────────────────┴────────────────────┘
```

---

## 2. Backend Deployment (Render)

### Prerequisites
- Render account at https://render.com
- GitHub repository connected to Render

### Steps

1. **Login to Render** → New → Web Service
2. **Connect GitHub Repo**: `Prasanna-ETH/SIH-2026-2-_TEAM_OMEGA_CODERS`
3. **Configure Service**:
   - **Name**: `aicte-apaar-backend`
   - **Root Directory**: `backend`
   - **Runtime**: Python 3
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `uvicorn app.main:app --host 0.0.0.0 --port $PORT`
4. **Environment Variables**:
   - `PYTHON_VERSION` = `3.11.9`
   - `ENVIRONMENT` = `production`
   - `SECRET_KEY` = (auto-generate)
5. **Plan**: Free (for prototype demo)
6. Click **Create Web Service**

The backend will auto-deploy. The `render.yaml` file in the root handles this via Infrastructure-as-Code.

**Backend URL**: `https://aicte-apaar-backend.onrender.com`

---

## 3. Frontend Deployment (Vercel)

### Prerequisites
- Vercel account at https://vercel.com
- GitHub repository connected to Vercel

### Steps

1. **Login to Vercel** → Add New → Project
2. **Import Git Repository**: `Prasanna-ETH/SIH-2026-2-_TEAM_OMEGA_CODERS`
3. **Configure Project**:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`
4. **Environment Variables**:
   - `VITE_API_URL` = `https://aicte-apaar-backend.onrender.com/api`
5. Click **Deploy**

The `vercel.json` in the root (and `frontend/vercel.json`) handles SPA routing rewrites.

**Frontend URL**: `https://aicte-apaar-frontend.vercel.app`

---

## 4. Local Development

### Backend
```bash
cd backend
pip install -r requirements.txt
uvicorn app.main:app --reload --host 127.0.0.1 --port 8000
```

### Frontend
```bash
cd frontend
npm install
npm run dev
```

Access at: http://localhost:5173

---

## 5. Demo Credentials

| Role | Username | Password |
|------|----------|----------|
| AICTE Admin | `aicte_admin` | `aicte@2024` |
| Institution | `inst_admin` | `inst@2024` |
| Verifier | `verifier` | `verify@2024` |

---

## 6. API Documentation

After backend is running, visit:
- Swagger UI: `/docs`
- ReDoc: `/redoc`

---

## 7. Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | React 18, TypeScript, Vite, Tailwind CSS |
| Backend | FastAPI, Python 3.11, SQLAlchemy 2.0 |
| Database | SQLite (prototype), PostgreSQL (production) |
| Deployment | Vercel (frontend), Render (backend) |
| Auth | Session-based with role management |
