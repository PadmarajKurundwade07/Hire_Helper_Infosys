# 🔧 Email OTP Debugging Guide

## 🚨 Problem: OTP Messages Show "Sent" but Emails Not Received

### ✅ Solution Steps

#### Step 1: Verify Render Environment Variables

1. Go to Render Dashboard: https://dashboard.render.com/
2. Click on your backend service: `hire-helper-infosys`
3. Click **Environment** tab
4. Verify these variables are set:
   ```
   RESEND_API_KEY=re_6dHA5BLj_3P9cSnFme1zXUyUSAmMiaDKp
   EMAIL_FROM=pp.kurundwade@gmail.com
   ```

**If they're missing or wrong:**
- Add/Fix them exactly as shown above
- Render will auto-redeploy (5-10 minutes)
- Check the "Events" tab to see deployment progress

#### Step 2: Run Diagnostics

Test 1: Check Environment Configuration
```
GET https://hire-helper-infosys.onrender.com/api/diagnostics
```

Expected response shows:
```json
{
  "email": {
    "resend_api_key_set": true,
    "resend_api_key_length": 32,
    "email_from_set": true,
    "email_from_value": "pp.kurundwade@gmail.com"
  }
}
```

**If any are false or missing:**
- Environment variables not set on Render
- Go back to Step 1 and set them correctly

---

Test 2: Send Test Email
```
POST https://hire-helper-infosys.onrender.com/api/auth/test-email
Content-Type: application/json

{
  "email": "umoney2004@gmail.com"
}
```

Response:
```json
{
  "success": true,
  "message": "Test email sent successfully! Check your inbox (umoney2004@gmail.com)",
  "details": {
    "recipient": "umoney2004@gmail.com",
    "sender": "pp.kurundwade@gmail.com",
    "service": "Resend",
    "timestamp": "2026-04-09T14:30:00.000Z"
  }
}
```

**Next:** Check your Gmail inbox for the test email (wait 2-5 seconds)

---

#### Step 3: Check Render Logs

1. Go to: https://dashboard.render.com/services/[service-id]
2. Click **Logs** tab
3. Search for: `EMAIL SENT SUCCESSFULLY VIA RESEND`

**You should see:**
```
============================================================
📧 SENDING EMAIL VIA RESEND
============================================================
⏰ Timestamp: 2026-04-09T14:30:00.000Z
📧 To: umoney2004@gmail.com
📝 Subject: Test Subject
✅ Configuration Check:
   - RESEND_API_KEY: SET (length: 32)
   - EMAIL_FROM: pp.kurundwade@gmail.com
🚀 Calling Resend API...
✅ EMAIL SENT SUCCESSFULLY VIA RESEND!
📮 Message ID: abc123xyz789
============================================================
```

**If you see errors:**
- Look for `❌ ERROR SENDING EMAIL VIA RESEND`
- Check the error message
- Follow the troubleshooting section below

---

#### Step 4: Check Resend Account

1. Go to https://resend.com/emails
2. Login with your account
3. Look for recent emails sent
4. Check if there are any delivery errors or bounces

**If you see failures:**
- Check API key is still valid (hasn't been regenerated)
- Verify receiver email is valid
- Check if sender domain is verified

---

#### Step 5: Test Complete Flow

1. **Register New User:**
   ```
   https://hire-helper-infosys.vercel.app/register
   ```
   - Fill in all fields
   - Check email for OTP (should arrive in 2-5 seconds)
   - If no email: Check Step 3 (Render logs)

2. **Enter OTP:**
   - Copy OTP from email
   - Paste in registration form
   - Submit

3. **Login:**
   - Use credentials to login
   - Should work if OTP verified

4. **Forgot Password:**
   ```
   https://hire-helper-infosys.vercel.app/forgot-password
   ```
   - Enter your email
   - Check email for password reset OTP (in 2-5 seconds)
   - If no email: Check Step 3 (Render logs)

---

## 🐛 Troubleshooting

### Issue 1: "RESEND_API_KEY is not configured"

**What it means:** The environment variable is not set on Render

**Fix:**
1. Go to Render Dashboard
2. Services → hire-helper-infosys → Environment
3. Add: `RESEND_API_KEY=re_6dHA5BLj_3P9cSnFme1zXUyUSAmMiaDKp`
4. Save (auto-redeploy)
5. Wait 5-10 minutes for deployment to complete

---

### Issue 2: "EMAIL_FROM is not configured"

**What it means:** The sender email is not set on Render

**Fix:**
1. Go to Render Dashboard
2. Services → hire-helper-infosys → Environment
3. Add: `EMAIL_FROM=pp.kurundwade@gmail.com`
4. Save (auto-redeploy)
5. Wait 5-10 minutes for deployment to complete

---

### Issue 3: Email sent but not received

**Possible causes:**

1. **Check spam/junk folder**
   - Check Gmail spam/promotions tabs
   - Mark as "Not spam" so future emails go to inbox

2. **Check Resend domain verification**
   - If using custom domain, it must be verified
   - For now, use: `pp.kurundwade@gmail.com` as EMAIL_FROM
   - This is already verified for Resend

3. **API key is invalid**
   - Go to https://resend.com/api-keys
   - Verify the API key is active
   - If expired, regenerate and update Render

4. **Rate limiting**
   - Resend free tier: 100 emails/day
   - Check if you've exceeded this
   - Solution: Upgrade Resend plan or wait until tomorrow

---

### Issue 4: 403/401 Unauthorized Error

**What it means:** API key is invalid or not authorized

**Fix:**
1. Go to https://resend.com/api-keys
2. Verify the key: `re_6dHA5BLj_3P9cSnFme1zXUyUSAmMiaDKp`
3. If not showing, regenerate a new key
4. Update Render environment: `RESEND_API_KEY=<new-key>`

---

### Issue 5: "invalid_request_url" Error

**What it means:** Email address format is invalid

**Fix:**
- Check the email being sent is valid format
- Example: `umoney2004@gmail.com` ✅
- Invalid: `umoney2004 at gmail.com` ❌
- Invalid: `@gmail.com` ❌

---

## 🧪 Quick Test Commands

### Test 1: Check if backend is running
```bash
curl https://hire-helper-infosys.onrender.com/api/health
```

### Test 2: Check environment configuration
```bash
curl https://hire-helper-infosys.onrender.com/api/diagnostics
```

### Test 3: Send test email
```bash
curl -X POST https://hire-helper-infosys.onrender.com/api/auth/test-email \
  -H "Content-Type: application/json" \
  -d '{"email":"your-email@gmail.com"}'
```

---

## 📊 Complete Checklist

- [ ] Step 1: Verify Render environment variables (RESEND_API_KEY, EMAIL_FROM)
- [ ] Render redeploys after setting variables (check Events tab)
- [ ] Step 2: Test /api/diagnostics shows email config
- [ ] Step 2: Test /api/auth/test-email sends successfully
- [ ] Step 3: Test email received in inbox
- [ ] Step 4: Check Resend.com emails show delivery
- [ ] Step 5: Register flow sends OTP email
- [ ] Step 5: Forgot password flow sends OTP email
- [ ] Complete end-to-end auth flow works

---

## 📞 Still Not Working?

1. **Check Render logs** for exact error message
2. **Copy the error** from logs
3. **Go to Resend docs**: https://resend.com/docs
4. **Search** for the error message
5. **Follow** Resend's troubleshooting guide

---

**Last Updated:** 2026-04-09
**Status:** Debugging in progress
