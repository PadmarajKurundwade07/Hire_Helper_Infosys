# QUICK REFERENCE: Testing Your Deployment

## 🔗 URLs (Update with Your Actual URLs)

```
Backend:  https://hire-helper-infosys.onrender.com
Frontend: https://hire-helper-infosys.vercel.app
Health:   https://hire-helper-infosys.onrender.com/api/health
```

## ✅ 5-Minute Health Check

```bash
# 1. Check backend is running
curl https://your-backend-url.onrender.com/

# 2. Check database is connected
curl https://your-backend-url.onrender.com/api/health

# 3. Check frontend loads
curl https://your-frontend-url.vercel.app

# 4. Test registration API
curl -X POST https://your-backend-url.onrender.com/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "first_name":"John",
    "last_name":"Doe",
    "email_id":"test@gmail.com",
    "password":"Pass123",
    "phone_number":"1234567890"
  }'
```

## 🎯 Manual Testing Steps

### Local Testing (Before Production)

```bash
# Terminal 1: Start Backend
cd backend
npm install
npm run dev
# Should show: "Server is running on port 5000"

# Terminal 2: Start Frontend
cd frontend
npm install
ng serve

# Browser: Open http://localhost:4200
# Try: Register → Verify OTP → Login
```

### Production Testing

1. Open https://hire-helper-infosys.vercel.app
2. Go to Register
3. Enter test data:
   - Name: Test User
   - Email: testuser@example.com
   - Password: TestPass123
   - Phone: 1234567890
4. Click Register
5. Check email for OTP
6. Enter OTP
7. Login with credentials

## 🚨 Common Issues & Fixes

| Issue | Fix |
|-------|-----|
| CORS Error | Backend must have frontend domain in CORS config |
| 500 Error | Check Render logs, verify DATABASE_URL |
| 404 Error | Check API endpoint paths, test with curl |
| Timeout | Render free tier cold starts, upgrade to Starter |
| DB not connected | Verify DATABASE_URL in Render environment |
| Email not received | Check SMTP credentials, enable less secure apps |

## 📊 Status Dashboard

**Render Backend:**
- Dashboard: https://dashboard.render.com
- Service name: hirehelper-backend
- Check: Logs → Status → Environment

**Vercel Frontend:**
- Dashboard: https://vercel.com/dashboard
- Project: Hire_Helper_Infosys
- Check: Deployments → Analytics

## 🔧 How to Update After Changes

```bash
# Make code changes locally
# Test locally...

# Commit and push to GitHub
git add .
git commit -m "Your message"
git push origin main

# Vercel auto-deploys (2-3 min)
# Render auto-deploys (5-10 min)

# Monitor dashboards and verify
```

## 📝 Key Files

- `backend/index.js` - Server, CORS, health endpoint
- `backend/db.js` - Database connection
- `frontend/src/environments/environment.ts` - API URL
- `frontend/src/app/core/services/auth.service.ts` - API calls
- `RENDER_SETUP_GUIDE.md` - Detailed backend setup
- `VERCEL_SETUP_GUIDE.md` - Detailed frontend setup
- `DEPLOYMENT_CHECKLIST.md` - Full deployment steps

## 🎓 Documentation Files

In your project root:
- `PRODUCTION_SETUP.md` - Overview & architecture
- `RENDER_SETUP_GUIDE.md` - Backend configuration steps
- `VERCEL_SETUP_GUIDE.md` - Frontend configuration steps
- `DEPLOYMENT_CHECKLIST.md` - Step-by-step checklist
- `QUICK_REFERENCE.md` - This file

## 💡 Pro Tips

1. **Keep Render warm**: Use UptimeRobot to ping every 10 minutes
2. **Monitor logs**: Always check logs when something fails
3. **Test locally first**: Always test locally before pushing to prod
4. **Use curl for APIs**: Test endpoints with curl before frontend
5. **Check CORS**: Most frontend issues are CORS-related
6. **Enable 2FA**: For Gmail, use App Password not regular password
7. **Save URLs**: Bookmark these for quick access
8. **Monitor email**: Check spam folder if OTP not received

## 🆘 Emergency Fixes

```bash
# If backend stops responding:
# 1. Go to Render dashboard
# 2. Click your service
# 3. Click "Manual Deploy" → "Deploy latest commit"

# If frontend has errors:
# 1. Go to Vercel dashboard
# 2. Check latest deployment
# 3. Redeploy previous version if needed

# To check everything:
curl https://your-backend-url.onrender.com/api/health
curl https://your-frontend-url.vercel.app
```

## 📞 Debug Mode

Enable debug info:

```javascript
// In browser console
localStorage.setItem('debug-mode', 'true');
localStorage.setItem('api-url', 'https://your-backend-url.onrender.com/api');
console.log('Debug mode enabled');
```

Then check Network tab in DevTools for all API calls.

---

**Last Updated:** 2026-04-08
**Status:** Production Ready
**Version:** 1.0
