# Database Setup & Migration Guide

## Problem

The PostgreSQL database on Render is missing the required `users` table, causing registration failures with error: `relation "users" does not exist`

## Solution

This guide provides step-by-step instructions to create the database tables on your Render PostgreSQL instance.

---

## Prerequisites

1. **Render PostgreSQL Connection Details**
   - Host: `dpg-d7agj5dm5p6s73a8i77g-a.oregon-postgres.render.com`
   - Database: `hirehelper_db_k78r`
   - Username: (from Render dashboard)
   - Password: (from Render dashboard)

2. **Database URL** (Alternative to individual credentials)
   - Format: `postgresql://username:password@host:5432/database_name`
   - Available in Render dashboard under "Database" > "Connection String"

---

## Method 1: Run Migration via Render Dashboard (Recommended)

### Option A: Using Render Database Client

1. Go to https://dashboard.render.com
2. Navigate to your PostgreSQL service
3. Click **"Connect"** → **"External"** or **"Render Shell"**
4. From the **"SQL Sandbox"** section, paste the contents of `backend/schema.sql`
5. Execute the SQL to create all tables

### Option B: Using psql Command

```bash
# Set your connection details
export DATABASE_URL="postgresql://username:password@host:5432/database_name"

# Connect and run schema
psql $DATABASE_URL < backend/schema.sql
```

---

## Method 2: Run Migration via Node.js Scripts

### Step 1: Install Dependencies (if not already done)

```bash
cd backend
npm install
```

### Step 2: Set Environment Variables

Create or update `.env` file in the `backend` directory:

```env
NODE_ENV=production
DATABASE_URL=postgresql://username:password@dpg-d7agj5dm5p6s73a8i77g-a.oregon-postgres.render.com:5432/hirehelper_db_k78r

# OR use individual variables:
DB_HOST=dpg-d7agj5dm5p6s73a8i77g-a.oregon-postgres.render.com
DB_USER=your_username
DB_PASSWORD=your_password
DB_NAME=hirehelper_db_k78r
DB_PORT=5432
```

### Step 3: Run Migration Script

```bash
# Run migrations
node backend/run-migrations.js

# Verify tables were created
node backend/verify-database.js
```

---

## Method 3: Automatic Migration via API Endpoint

Once the backend is deployed with the latest code (commit `abb11db`), you can trigger migrations via HTTP:

```bash
# Trigger migration
curl -X GET "https://hire-helper-infosys.onrender.com/api/migrate"

# Check health/database status
curl -X GET "https://hire-helper-infosys.onrender.com/api/health"
```

---

## Method 4: Manual SQL Execution

If you have PostgreSQL client installed locally:

```bash
# Option 1: Using psql directly
psql -h dpg-d7agj5dm5p6s73a8i77g-a.oregon-postgres.render.com \
     -U username \
     -d hirehelper_db_k78r \
     -f backend/schema.sql

# Option 2: Using pgAdmin (web interface)
# 1. Go to https://www.pgadmin.org/
# 2. Add new server with your Render credentials
# 3. Connect and execute schema.sql
```

---

## Verification

### Check if Tables Were Created

```bash
node backend/verify-database.js
```

Expected output:
```
✅ Table "users": EXISTS
✅ Table "task": EXISTS
✅ Table "accepted_tasks": EXISTS
✅ Table "requests": EXISTS
✅ Table "notification": EXISTS
```

### Query the Database

```bash
psql $DATABASE_URL -c "SELECT table_name FROM information_schema.tables WHERE table_schema='public';"
```

---

## Testing Registration

Once tables are created:

### 1. Test via API

```bash
curl -X POST "https://hire-helper-infosys.onrender.com/api/auth/register" \
  -H "Content-Type: application/json" \
  -d '{
    "first_name": "John",
    "last_name": "Doe",
    "email_id": "john@example.com",
    "password": "TestPassword123",
    "phone_number": "+1234567890"
  }'
```

Expected response:
```json
{
  "msg": "User registered successfully. Please verify OTP sent to email.",
  "user": {
    "id": "uuid-here",
    "first_name": "John",
    "email_id": "john@example.com"
  }
}
```

### 2. Test via Frontend

1. Open https://hire-helper-infosys.vercel.app
2. Navigate to **Register**
3. Fill in the form and submit
4. Check email for OTP
5. Verify OTP to complete registration

---

## Troubleshooting

### Error: "relation 'users' does not exist"
- **Cause**: Migration hasn't run yet
- **Fix**: Follow steps above to run migrations

### Error: "password authentication failed"
- **Cause**: Invalid database credentials
- **Fix**: Double-check DATABASE_URL or individual env variables in Render dashboard

### Error: "Connection refused"
- **Cause**: Database server is not responding
- **Fix**: 
  - Check Render PostgreSQL service is running
  - Verify firewall allows connections
  - Try connecting from pgAdmin to confirm connection

### Error: "SSL certificate verification failed"
- **Cause**: SSL configuration issue
- **Fix**: Already handled in code with `ssl: { rejectUnauthorized: false }`

### Tables exist but registration still fails
- **Cause**: Backend needs restart to pick up schema changes
- **Fix**: Redeploy backend from Render dashboard or restart service

---

## Database Schema

### users table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name VARCHAR(100) NOT NULL,
  last_name VARCHAR(100) NOT NULL,
  phone_number VARCHAR(20),
  email_id VARCHAR(150) UNIQUE NOT NULL,
  password VARCHAR(255) NOT NULL,
  profile_picture VARCHAR(255),
  otp VARCHAR(6),
  otp_expiry TIMESTAMP,
  is_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### Related tables
- `task` - Job postings/tasks
- `accepted_tasks` - Tasks accepted by users
- `requests` - Join requests for tasks
- `notification` - User notifications

---

## Next Steps

1. ✅ Run migration using one of the methods above
2. ✅ Verify tables were created using `verify-database.js`
3. ✅ Test registration via API or frontend
4. 🔄 Redeploy backend if needed (Render auto-redeploys on git push)
5. ✅ Monitor logs for any errors in `/api/health` endpoint

---

## Support

For more information:
- Render Dashboard: https://dashboard.render.com
- Project Repo: https://github.com/PadmarajKurundwade07/Hire_Helper_Infosys
- Backend Health Check: https://hire-helper-infosys.onrender.com/api/health
