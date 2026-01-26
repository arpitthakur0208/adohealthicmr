# 🚀 START HERE - Fix Your 500 Error

## The Problem
You're getting a **500 Internal Server Error** because MongoDB is not connected.

## ✅ Quick Fix (Choose One)

### Option A: MongoDB Atlas (Cloud - Easiest) ⭐ RECOMMENDED

**Time: 5 minutes**

1. **Sign up:** https://www.mongodb.com/cloud/atlas/register (FREE)
2. **Create cluster:** "Build Database" → "FREE" → Create
3. **Create user:** Database Access → Add User → Save password
4. **Allow IP:** Network Access → Add IP → "Allow from anywhere"
5. **Get connection string:** Database → Connect → "Connect your application" → Copy
6. **Update `.env.local`:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/adohealthicmr?retryWrites=true&w=majority
   ```
   (Replace username, password, and cluster address)

7. **Test connection:**
   ```bash
   npm run test-db
   ```

8. **Create admin user:**
   ```bash
   npm run create-default-admin
   ```

9. **Restart server:**
   ```bash
   npm run dev
   ```

10. **Login:**
    - Username: `adohealthicmr`
    - Password: `Welcome@25`

**See `FIX_MONGODB_NOW.md` for detailed step-by-step instructions.**

---

### Option B: Local MongoDB

**Time: 10-15 minutes**

1. **Download MongoDB:** https://www.mongodb.com/try/download/community
2. **Install** (check "Install as Service")
3. **Start service:**
   ```powershell
   Start-Service MongoDB
   ```
4. **Test connection:**
   ```bash
   npm run test-db
   ```
5. **Create admin:**
   ```bash
   npm run create-default-admin
   ```
6. **Restart server:**
   ```bash
   npm run dev
   ```

---

## 🧪 Test Your Setup

### Test 1: Database Connection
```bash
npm run test-db
```
Should show: `✅ SUCCESS! MongoDB is connected!`

### Test 2: Health Check
Visit: `http://localhost:3000/api/health`

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "adminUserExists": true
}
```

### Test 3: Login
1. Go to http://localhost:3000
2. Click "Admin Login"
3. Username: `adohealthicmr`
4. Password: `Welcome@25`

---

## 📚 Need More Help?

- **Detailed Atlas setup:** See `FIX_MONGODB_NOW.md`
- **Quick reference:** See `QUICK_SETUP_MONGODB.md`
- **Troubleshooting:** See `TROUBLESHOOTING.md`

---

## ⚠️ Common Issues

### "ECONNREFUSED"
→ MongoDB is not running. Use Atlas or start local MongoDB.

### "Authentication failed"
→ Wrong password in connection string. Check `.env.local`

### "IP not whitelisted"
→ Go to Atlas → Network Access → Add IP → "Allow from anywhere"

---

**After fixing MongoDB, your 500 error will be resolved!** ✅
