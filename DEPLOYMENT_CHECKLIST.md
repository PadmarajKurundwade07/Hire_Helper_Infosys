# 🚀 DEPLOYMENT CHECKLIST

## Phase 1: Local Testing (✅ Before Production)

### 1A. Test Backend Locally

```bash
# Navigate to backend
cd backend

# Install dependencies
npm install

# Ensure PostgreSQL is running locally
# On Windows: Services → PostgreSQL
# On Mac: brew services start postgresql
# On Linux: sudo service postgresql start

# Create database if needed
createdb hire_helper

# Start backend server
npm run dev
# Expected: "Server is running on port 5000"
```

**Test endpoints locally:**
```bash
# Test health endpoint
curl http://localhost:5000/api/health

# Expected response:
# {
#   "status": "running",
#   "database": {
#     "connected": true,
#     "configured": true
#   }
# }

# Test registration
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email_id": "john@example.com",
    "password": "Password123",
    "phone_number": "1234567890"
  }'
```

### 1B. Test Frontend Locally

```bash
# Navigate to frontend
cd frontend

# Install dependencies
npm install

# Start Angular server
ng serve --port 4200
# or: npm start

# Open browser
# http://localhost:4200
```

**Test locally:**
1. Click "Register"
2. Fill in form
3. Submit
4. Check browser Network tab for API calls
5. Should see request to: `http://localhost:4200/api/auth/register`

### 1C. Test Frontend-Backend Communication

With both running locally:
```bash
# Frontend: http://localhost:4200
# Backend: http://localhost:5000
```

**Firewall Check:**
- Check Windows Firewall allows Node.js on port 5000
- Disable firewall temporarily for testing if needed

---

## Phase 2: Production Setup (Render Backend)

### 2A. Create Render PostgreSQL Service

**Steps:**
1. Go to https://render.com/dashboard
2. Click "New +" button
3. Select "PostgreSQL"
4. Fill form:
   ```
   Name: hire-helper-db
   Database: hire_helper
   User: postgres
   Region: Singapore (same as backend)
   PostgreSQL Version: 15
   ```
5. Click "Create Database"
6. **SAVE the DATABASE_URL** (copy it)
   - Looks like: `postgresql://user:password@host:port/database`

**Checklist:**
- [ ] Database created
- [ ] DATABASE_URL copied
- [ ] Database accessible to backend

### 2B. Create Render Web Service (Backend)

**Steps:**
1. Go to https://render.com/dashboard
2. Click "New +" → "Web Service"
3. Connect GitHub account (if needed)
4. Select repository: `Hire_Helper_Infosys`
5. Select branch: `main`
6. Fill form:
   ```
   Name: hirehelper-backend
   Environment: Node
   Build Command: npm install
   Start Command: node index.js
   Region: Singapore
   Plan: Free (or Starter for better performance)
   ```
7. Click "Create Web Service"

**Checklist:**
- [ ] Web service created
- [ ] Deployment started
- [ ] Connected to correct GitHub branch

### 2C. Configure Environment Variables

**Steps:**
1. Go to your backend service in Render
2. Click "Environment" tab
3. Add these environment variables:

| Key | Value |
|-----|-------|
| `NODE_ENV` | `production` |
| `PORT` | `5000` |
| `DATABASE_URL` | `[paste from step 2A]` |
| `JWT_SECRET` | `[leave empty - auto-generated]` |
| `SMTP_HOST` | `smtp.gmail.com` |
| `SMTP_PORT` | `587` |
| `SMTP_USER` | `your_email@gmail.com` |
| `SMTP_PASS` | `your_app_password` |

**For Gmail App Password:**
1. Go to https://myaccount.google.com/apppasswords
2. Select "Mail" and "Windows Computer"
3. Generate password
4. Use that password above (not your regular Gmail password)

**Checklist:**
- [ ] DATABASE_URL configured
- [ ] JWT_SECRET set (auto-generated)
- [ ] SMTP credentials configured
- [ ] All variables saved

### 2D. Monitor Deployment

**Steps:**
1. Go to your backend service
2. Click "Logs" tab
3. Watch deployment progress

**Expected logs:**
```
Building...
npm install...
Starting server...
Server is running on port 5000
Database connected successfully
```

**Wait for:**
1. Build to complete (2-5 minutes)
2. Service to show "Live" status
3. No errors in logs

**Checklist:**
- [ ] Backend deployed successfully
- [ ] Status shows "Live"
- [ ] No errors in logs

### 2E. Test Backend is Working

**Test health endpoint:**
```bash
# Replace with your Render URL
curl https://your-backend-url.onrender.com/api/health
```

**Expected response:**
```json
{
  "status": "running",
  "database": {
    "connected": true,
    "configured": true
  }
}
```

**If database shows connected: false**
- Check DATABASE_URL is set correctly
- Check database service is running
- Verify credentials are correct

**Checklist:**
- [ ] /api/health returns success
- [ ] database.connected = true
- [ ] database.configured = true

---

## Phase 3: Production Setup (Vercel Frontend)

### 3A. Vercel Auto-Deployment

Your frontend auto-deploys when you push to GitHub.

**Check deployment status:**
1. Go to https://vercel.com/dashboard
2. Select `Hire_Helper_Infosys` project
3. Check deployment status
4. Should show "Production ✓" (green checkmark)

**If not deployed yet:**
1. Push code to GitHub: `git push origin main`
2. Vercel automatically builds (2-3 minutes)
3. Check Vercel dashboard for status

**Checklist:**
- [ ] Frontend deployed on Vercel
- [ ] Production status shows green
- [ ] No build errors in logs

### 3B. Test Frontend Access

**Open your frontend:**
```
https://hire-helper-infosys.vercel.app
```

**Should see:**
- Login page loads
- No errors in browser console
- Links work

**Checklist:**
- [ ] Frontend loads without errors
- [ ] No CORS errors in console
- [ ] Can navigate to register page

---

## Phase 4: End-to-End Testing (Production)

### 4A. Register Test

**Steps:**
1. Go to https://hire-helper-infosys.vercel.app
2. Click "Register"
3. Fill form:
   ```
   First Name: Test
   Last Name: User
   Email: testuser_production@gmail.com
   Password: TestPass@123
   Phone: 9876543210
   ```
4. Click "Register"

**Expected:**
- ✅ Success message: "User registered successfully..."
- ✅ Redirects to OTP entry form
- ✅ Receives OTP email to testuser_production@gmail.com

**If error:**
- Check browser console (F12) for network errors
- Check Render logs for API errors
- Verify backend `/api/health` still working

**Checklist:**
- [ ] Registration succeeds
- [ ] OTP email received
- [ ] No errors in browser console

### 4B. OTP Verification Test

**Steps:**
1. Check your email for OTP code
2. Enter OTP in form
3. Click "Verify"

**Expected:**
- ✅ Success message: "Verification successful..."
- ✅ Redirected to login page

**Checklist:**
- [ ] OTP verification succeeds
- [ ] Redirected to login

### 4C. Login Test

**Steps:**
1. On login page, enter:
   ```
   Email: testuser_production@gmail.com
   Password: TestPass@123
   ```
2. Click "Login"

**Expected:**
- ✅ Successful login
- ✅ Redirected to dashboard
- ✅ User info displayed

**Checklist:**
- [ ] Login succeeds
- [ ] Dashboard loads
- [ ] User data displayed

### 4D. Network Testing

**Open Browser DevTools (F12) → Network tab**

When testing register/login, verify:
1. Requests go to: `https://hire-helper-infosys.onrender.com/api/...`
2. Status code 200-201 for success
3. No CORS errors
4. Response contains expected data

**Red flags:**
- ❌ Requests to `http://` (should be `https://`)
- ❌ 404 errors (wrong endpoint path)
- ❌ 500 errors (backend database issue)
- ❌ CORS errors (backend not configured for frontend domain)

**Checklist:**
- [ ] All network requests successful
- [ ] Using HTTPS endpoints
- [ ] Status codes 200-201
- [ ] No CORS errors

---

## Phase 5: Production Monitoring

### 5A. Monitor Backend

**Check backend health regularly:**
```bash
# Every hour or after each deployment
curl https://your-backend-url.onrender.com/api/health
```

**What to look for:**
- `status: "running"` ✅
- `database.connected: true` ✅
- No error messages ✅

### 5B. Check Backend Logs

**Render Dashboard → Logs tab:**
1. Should show requests coming in
2. No error messages
3. Database connections successful

**Expected log patterns:**
```
POST /api/auth/register 201
POST /api/auth/verify-otp 200
POST /api/auth/login 200
GET /api/health 200
```

### 5C. Monitor Frontend

**Vercel Dashboard:**
1. Check deployment status
2. Review analytics
3. Monitor error tracking

### 5D. Test After Each Update

After any code changes:
1. Push to GitHub
2. Wait for auto-deployment
3. Test on production URLs
4. Verify no regressions

---

## 🐛 Troubleshooting Guide

### Problem: CORS Error in Browser

**Error message:**
```
Access to XMLHttpRequest blocked by CORS policy
```

**Solutions:**
1. Verify backend has correct frontend domain in CORS
2. Check `backend/index.js` lines 18-26 has Vercel URLs
3. Ensure backend API URL is `https://` not `http://`
4. Test: `curl -i https://your-backend-url.onrender.com/api/health`
5. Look for `access-control-allow-origin` header

### Problem: 500 Internal Server Error

**Error message:**
```json
{"msg": "Server Error"}
```

**Solutions:**
1. Check Render logs for actual error
2. Test: `https://your-backend-url.onrender.com/api/health`
3. If database showing not connected:
   - Verify DATABASE_URL is set
   - Verify database service is running
   - Check credentials are correct
4. Try latest deployment: Render → Manual deploy

### Problem: 404 Not Found

**Error message:**
```
Cannot POST /api/auth/register
```

**Solutions:**
1. Check frontend uses correct API URL
2. Verify backend routes are registered
3. Check for typos in endpoint names
4. Test locally first with `curl`

### Problem: Timeout / Requests Hang

**Symptoms:**
- Network requests never complete
- Frontend appears frozen
- Render backend cold started

**Solutions:**
1. Render free tier has cold starts (5-30s)
2. Upgrade to Starter plan for instant response
3. Use UptimeRobot to keep backend warm
4. Refresh page and try again

### Problem: Database Not Connecting

**Error from `/api/health`:**
```json
{"database": {"connected": false}}
```

**Solutions:**
1. Check DATABASE_URL is set in Render
2. Verify PostgreSQL service is running
3. Test connection string locally
4. Check firewall allows outbound connections

---

## ✅ Final Verification Checklist

Before considering deployment complete:

- [ ] Backend deployed on Render (status: Live)
- [ ] Frontend deployed on Vercel (status: Production ✓)
- [ ] `/api/health` returns database connected: true
- [ ] Can complete full registration → OTP → Login flow
- [ ] No CORS errors in browser console
- [ ] Network requests use HTTPS
- [ ] User data persists in database
- [ ] Email notifications work
- [ ] Both services auto-update on GitHub push

---

## 📞 When Something Goes Wrong

**Quick diagnostic:**

```bash
# 1. Test backend is up
curl https://your-backend-url.onrender.com/

# 2. Test database connection
curl https://your-backend-url.onrender.com/api/health

# 3. Check backend logs
# Render Dashboard → Logs tab

# 4. Check frontend errors
# Browser DevTools → Console tab

# 5. Test locally
cd backend && npm run dev
cd frontend && ng serve

# 6. View network requests
# Browser DevTools → Network tab
```

**Get help:**
1. Check logs first (Render dashboard)
2. Verify all env vars are set
3. Test endpoints with curl
4. Review error messages carefully
5. Check database is running

---

## 🎯 Expected Timeline

- Local testing: 15-30 minutes
- Render setup: 5-10 minutes
- Render deployment: 5-10 minutes (+ cold starts)
- Vercel deployment: 10-15 minutes (usually faster)
- Full testing: 15-20 minutes
- **Total: ~1 hour for complete setup**

Keep monitoring for 24 hours after initial deployment to catch any issues.
