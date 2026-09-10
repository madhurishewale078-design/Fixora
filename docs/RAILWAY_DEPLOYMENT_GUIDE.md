# FIXORA — Railway.app Deployment Guide 🚀
**Platform:** FastAPI Backend + PostgreSQL Database + React 19 Frontend  
**Author / Administrator:** Madhuri Shewale (`madhurishewale078@gmail.com`)

---

## 🎯 Why Railway.app is the Best Choice for Fixora
1. **Managed PostgreSQL**: 1-Click database provisioning with automatic backups.
2. **Native Python & FastAPI Support**: Automatic Nixpacks detection without complex Docker setup.
3. **Automatic Environment Variables**: Seamless database linking (`DATABASE_URL`).
4. **Free Trial Credits / Low Cost**: Generous initial credits to deploy and test immediately.
5. **Zero Downtime Deploys**: Automatically redeploys on every `git push`.

---

## 📋 Pre-Deployment Checklist
Before starting, ensure you have:
- A free account on [railway.app](https://railway.app) (Sign in with GitHub).
- Your project uploaded to a GitHub repository (e.g. `github.com/your-username/smart-home-fix`).

---

## 🛠️ Step-by-Step Deployment (3 Easy Steps)

### STEP 1: Deploy PostgreSQL Database on Railway
1. Go to [railway.app](https://railway.app) and click **"New Project"**.
2. Select **"Provision PostgreSQL"**.
3. Railway will create a dedicated PostgreSQL database in under 10 seconds.
4. Click on the PostgreSQL card ➔ go to the **"Variables"** tab ➔ you will see `DATABASE_URL`.

---

### STEP 2: Deploy FastAPI Backend
1. In the same Railway project, click **"+ New"** (top right) ➔ **"GitHub Repo"**.
2. Select your `smart-home-fix` repository.
3. Click on the newly created Service card ➔ go to **"Settings"**:
   - **Root Directory**: Set to `backend`
4. Go to the **"Variables"** tab and add these variables:
   | Variable Name | Recommended Value | Description |
   |---|---|---|
   | `DATABASE_URL` | `${{Postgres.DATABASE_URL}}` | Auto-links to your Railway PostgreSQL |
   | `SECRET_KEY` | `fixora-super-jwt-secret-key-production-2026` | Security secret for JWT tokens |
   | `BACKEND_CORS_ORIGINS` | `*` | Allows frontend requests |
   | `ADMIN_NAME` | `Madhuri Shewale` | Admin name |
   | `ADMIN_EMAIL` | `madhurishewale078@gmail.com` | Admin login |
   | `ADMIN_PASSWORD` | `Admin@Fixora2025` | Admin password |
5. Go to **"Settings"** ➔ **"Networking"** ➔ Click **"Generate Domain"**.
   - Railway will give you a public URL, e.g.:
     `https://fixora-backend-production.up.railway.app`
6. Test your backend by visiting:
   `https://fixora-backend-production.up.railway.app/docs` (Swagger UI will open!).

---

### STEP 3: Deploy React Frontend

You have two simple options for Frontend:

#### Option A: Deploy Frontend on Vercel (Recommended - 100% Free & Super Fast)
1. Go to [vercel.com](https://vercel.com) and click **"Add New" ➔ "Project"**.
2. Select your `smart-home-fix` GitHub repository.
3. In **Environment Variables**, add:
   - `VITE_API_BASE_URL`: `https://fixora-backend-production.up.railway.app/api/v1`
4. Click **"Deploy"**. Your live frontend is ready in 60 seconds!

#### Option B: Deploy Frontend on Railway
1. In Railway, click **"+ New" ➔ "GitHub Repo"**.
2. Select repository ➔ Root Directory: `/` (leave blank).
3. Under **Variables**, add:
   - `VITE_API_BASE_URL`: `https://fixora-backend-production.up.railway.app/api/v1`
4. Under **Settings ➔ Networking**, click **"Generate Domain"**.

---

## 🔒 Pre-Configured Railway Files Already Added:
The codebase already includes:
- `backend/Procfile`: Automatically runs uvicorn with dynamic `$PORT`.
- `backend/railway.json`: Runs `python seed.py` automatically on first deploy to seed services & technicians, then launches FastAPI.
- `backend/app/database.py`: Automatically converts `postgres://` to `postgresql://` required by SQLAlchemy 2.0.
- `src/api/client.ts`: Supports dynamic `VITE_API_BASE_URL` or `VITE_API_URL`.
