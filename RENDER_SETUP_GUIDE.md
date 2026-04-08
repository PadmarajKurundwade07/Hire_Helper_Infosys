# Render Backend Setup Guide

This guide helps you configure the HireHelper backend on Render.com for production deployment.

## Prerequisites

- Render.com account (https://render.com)
- GitHub repository access
- PostgreSQL database (can use Render PostgreSQL or external)

## Step-by-Step Setup

### 1. Create Render PostgreSQL Database (Optional but Recommended)

**If you're using Render PostgreSQL:**

1. Go to Render Dashboard
2. Click "New +" → "PostgreSQL"
3. Fill in the form:
   - **Name:** `hire-helper-db`
   - **Database:** `hire_helper`
   - **User:** `postgres`
   - **Region:** Select same region as backend
   - **PostgreSQL Version:** 15 or higher
4. Click "Create Database"
5. **Copy the `DATABASE_URL`** - you'll need this later

### 2. Create Web Service for Backend

1. Go to Render Dashboard
2. Click "New +" → "Web Service"
3. Connect your GitHub repository (select `main` branch)
4. Fill in the form:
   - **Name:** `hirehelper-backend`
   - **Environment:** `Node`
   - **Build Command:** `npm install`
   - **Start Command:** `node index.js`
   - **Region:** Singapore (or your preferred region)
   - **Plan:** Free or Starter

### 3. Set Environment Variables

In the Render dashboard, go to your backend service → **Environment** tab:

**Add these environment variables:**

```
NODE_ENV = production
JWT_SECRET = (leave empty - Render will generate)
PORT = 5000
```

**If using Render PostgreSQL:**
```
DATABASE_URL = [paste the DATABASE_URL from step 1]
```

**If using external PostgreSQL:**
```
DB_HOST = your_database_host
DB_PORT = 5432
DB_NAME = hire_helper
DB_USER = postgres
DB_PASSWORD = your_password
```

**For Email (Gmail SMTP):**
```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 587
SMTP_USER = your_email@gmail.com
SMTP_PASS = your_app_password (use Gmail App Password, not regular password)
```

### 4. Deploy Backend

- Render will automatically deploy when you push to GitHub (main branch)
- Monitor deployment in the Render dashboard
- Check logs if deployment fails: Dashboard → Service → **Logs** tab

### 5. Test Backend Health

Once deployed, visit:
```
https://your-backend-url.onrender.com/
https://your-backend-url.onrender.com/api/health
```

Expected response for `/api/health`:
```json
{
  "status": "running",
  "timestamp": "2026-04-08T...",
  "database": {
    "configured": true,
    "connected": true
  }
}
```

## Common Issues & Solutions

### Issue: Database Connection Failed (500 Error)

**Symptoms:** API returns 500 errors when registering/logging in

**Solutions:**
1. Check if `DATABASE_URL` or db credentials are set in Render environment variables
2. Verify database service is running
3. Check Render logs for exact error: Dashboard → **Logs** tab
4. Ensure SSL is enabled for remote databases

### Issue: CORS Errors in Frontend

**Browser Console shows:** `Access to XMLHttpRequest blocked by CORS policy`

**Solution:**
- The backend has CORS configured for Vercel domains
- Ensure frontend API URL is set to correct backend URL:
  ```
  https://your-backend-url.onrender.com/api
  ```

### Issue: Long Cold Start Times

Render's free tier has cold starts (5-30 seconds on first request).

**Solutions:**
- Upgrade to Starter plan for faster response
- Use UptimeRobot to ping backend every 10 minutes to prevent cold starts

## Render Dashboard Structure

```
Your Project
├── Backend (Web Service)
│   ├── Environment Variables
│   ├── Logs
│   └── Settings
└── Database (PostgreSQL - if created)
    ├── Credentials
    ├── Connection Info
    └── Backups
```

## Frontend Configuration (Vercel)

The frontend environment must point to the correct backend URL:

**Environment file:** `frontend/src/environments/environment.ts`
```typescript
export const environment = {
  production: true,
  apiUrl: "https://your-backend-url.onrender.com/api"
};
```

## Monitoring & Logs

To view backend logs in Render:
1. Go to your backend service
2. Click **Logs** tab
3. You can see real-time logs as requests come in

## Useful Render CLI Commands

```bash
# Install Render CLI
npm install -g render

# Login to Render
render login

# View service status
render service list

# View logs
render logs <service-id> --tail
```

## Additional Resources

- Render Documentation: https://render.com/docs
- PostgreSQL Connection: https://render.com/docs/databases
- Node.js Deployment: https://render.com/docs/deploy-node-express-app
