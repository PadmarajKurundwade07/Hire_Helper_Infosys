# Vercel Frontend Setup Guide

This guide helps you configure the HireHelper Angular frontend on Vercel for production deployment.

## Prerequisites

- Vercel account (https://vercel.com)
- GitHub repository access
- Node.js 18+ installed locally
- Angular CLI installed locally

## Step-by-Step Setup

### 1. Connect GitHub Repository to Vercel

1. Go to https://vercel.com/dashboard
2. Click "Add New..." → "Project"
3. Import your GitHub repository
4. Select the project and click "Import"

### 2. Configure Build Settings

Vercel should auto-detect Angular configuration, but verify:

1. Click on your project
2. Go to **Settings** → **Build & Development Settings**

**Verify these settings:**
- **Framework Preset:** `Angular`
- **Build Command:** `npm run build`
- **Output Directory:** `dist/frontend-app/browser`
- **Install Command:** `npm install`

*These should match your `vercel.json` configuration*

### 3. Set Environment Variables

1. Go to **Settings** → **Environment Variables**
2. Add these variables for **Production** environment:

```
ANGULAR_APP_API_URL = https://your-backend-url.onrender.com/api
```

**Note:** Angular uses static builds, so you might need to rebuild the frontend when the backend URL changes.

### 4. Configure Angular Environment Files

The frontend already has environment files configured:

**Production (src/environments/environment.ts):**
```typescript
export const environment = {
  production: true,
  apiUrl: "https://your-backend-url.onrender.com/api"
};
```

**Development (src/environments/environment.development.ts):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'https://your-backend-url.onrender.com/api'
};
```

### 5. Deploy Frontend

- Push code to GitHub `main` branch
- Vercel automatically builds and deploys
- Monitor progress in Vercel dashboard

### 6. Test Frontend Access

Once deployed, visit your Vercel URL:
```
https://hire-helper-infosys.vercel.app
```

Or the alternative Vercel-assigned domain

## Frontend-Backend Communication

The frontend communicates with the backend via HTTP requests through these service:

**Auth Service:** `frontend/src/app/core/services/auth.service.ts`

Key endpoints:
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/verify-otp` - Verify OTP

## Common Issues & Solutions

### Issue: CORS Error in Production

**Browser Console shows:**
```
Access to XMLHttpRequest at 'https://...' from origin 'https://...'
has been blocked by CORS policy
```

**Solutions:**
1. Verify backend CORS is configured for Vercel domain
2. Check backend has correct origin headers in response
3. In `frontend/src/app`, verify API calls use `environment.apiUrl`

### Issue: API Calls Return 404

**Symptoms:**
- Registration/Login fails with 404 error
- Network tab shows requests going to wrong URL

**Solutions:**
1. Check `environment.ts` has correct backend URL
2. Verify backend API routes use `/api` prefix
3. Rebuild frontend: `npm run build`
4. Redeploy to Vercel: Push to GitHub

### Issue: Mixed Content Error

**Browser Console shows:**
```
Mixed Content: The page at 'https://...' was loaded over HTTPS,
but requested an insecure resource 'http://...'
```

**Solution:**
- Backend must use HTTPS: `https://your-backend-url.onrender.com`
- Never use HTTP for production API calls

### Issue: Network Timeout

**Symptoms:**
- API requests timeout or hang
- Render backend might be in cold start

**Solutions:**
1. Render free tier has cold starts (5-30s)
2. Upgrade Render to Starter for instant requests
3. Use UptimeRobot to ping backend every 10 min
4. Check Render service logs for errors

## Frontend File Structure

```
frontend/
├── src/
│   ├── app/
│   │   ├── core/
│   │   │   └── services/
│   │   │       ├── auth.service.ts - API calls
│   │   │       ├── task.service.ts
│   │   │       └── notification.service.ts
│   │   ├── features/
│   │   │   └── auth/
│   │   │       ├── register/
│   │   │       └── login/
│   │   └── environments/
│   │       ├── environment.ts - Production config
│   │       └── environment.development.ts - Dev config
│   └── index.html
├── angular.json
├── package.json
└── vercel.json
```

## Environment Configuration

### For Local Development

```bash
cd frontend
ng serve --port 4200
# Open http://localhost:4200
```

Uses `environment.development.ts`

### For Production Build

```bash
npm run build
# Creates dist/frontend-app/browser
```

Uses `environment.ts`

## Useful Vercel Commands

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy from local machine
vercel --prod

# View deployment status
vercel status

# View logs
vercel logs
```

## Deployment Checklist

- [ ] Backend deployed on Render and running
- [ ] Backend `/api/health` endpoint responds successfully
- [ ] Database is connected (check `/api/health`)
- [ ] Frontend `environment.ts` points to correct backend URL
- [ ] CORS is configured on backend for Vercel domain
- [ ] Run `npm run build` locally without errors
- [ ] Push code to GitHub `main` branch
- [ ] Vercel automatically deploys and builds
- [ ] Test registration/login on deployed frontend
- [ ] Monitor Vercel and Render logs for errors

## Additional Resources

- Vercel Docs: https://vercel.com/docs
- Angular Deployment: https://angular.io/guide/deployment
- Environment Configuration: https://angular.io/guide/build#configure-environment-specific-defaults
