# ⚡ Quick Fix: Render Database Setup

## The Problem
Your Render PostgreSQL database doesn't have the `users` table, causing registration to fail.

## The Fix (Choose One Method)

### 🟢 FASTEST: Use Render SQL Sandbox (2 minutes)

1. Go to **https://dashboard.render.com**
2. Click your **PostgreSQL** service
3. Go to **"Connected Applications"** tab
4. Click **"SQL Sandbox"** button
5. Paste the SQL from: `backend/schema.sql` (in the repo)
6. Click **Run**
7. ✅ Done! Tables created.

---

### 🔵 VIA psql Command (5 minutes)

**Prerequisites**: Have PostgreSQL client installed
- Windows: https://www.postgresql.org/download/windows/
- macOS: `brew install postgresql`
- Linux: `sudo apt-get install postgresql-client`

**Then run**:
```bash
psql postgresql://USERNAME:PASSWORD@dpg-d7agj5dm5p6s73a8i77g-a.oregon-postgres.render.com:5432/hirehelper_db_k78r < backend/schema.sql
```

Replace `USERNAME` and `PASSWORD` from your Render dashboard.

---

### 🟡 VIA Node.js Script (3 minutes)

```bash
cd backend
npm install
node run-migrations.js
```

**Then verify**:
```bash
node verify-database.js
```

---

## Verify It Worked

Check any of these:

**Option A: API Health Check**
```bash
curl https://hire-helper-infosys.onrender.com/api/health
```

**Option B: Verify Script**
```bash
node backend/verify-database.js
```

**Option C: Test Registration**
1. Go to https://hire-helper-infosys.vercel.app/register
2. Fill the form and submit
3. Should receive OTP email ✅

---

## If Still Having Issues

### 🔴 Render Service Needs Redeploy
```bash
# Push any small change to trigger redeploy
git push origin main
```
Or manually redeploy from Render dashboard.

### 🔴 Backend Can't See New Tables
The backend runs migrations on startup. After creating tables, you may need to restart it:

1. Go to **Render dashboard**
2. Find your **backend service**
3. Click **"Manual Deploy"** button
4. Wait for deployment to complete

### 🔴 Still Getting "relation users does not exist"
Run the diagnostics:
```bash
# Check if database is connected
curl https://hire-helper-infosys.onrender.com/api/health | jq .database

# Check table exists
node backend/verify-database.js
```

---

## Files Added to Help You

- **`backend/run-migrations.js`** - Standalone migration script
- **`backend/verify-database.js`** - Verification script  
- **`DATABASE_MIGRATION_GUIDE.md`** - Complete detailed guide

---

## What Gets Created

The schema creates these tables:

1. **users** - User accounts (email, password, OTP, verification)
2. **task** - Job postings/tasks
3. **accepted_tasks** - Tasks users accept
4. **requests** - Join requests
5. **notification** - User notifications

---

## Next Steps

1. ✅ Create the tables using one method above
2. ✅ Verify with `/api/health` endpoint
3. ✅ Test registration on frontend
4. 🎉 Done!

---

Need help? Check the detailed guide: **`DATABASE_MIGRATION_GUIDE.md`**
