# 🔧 How to Fix the 500 Internal Server Error

## 🎯 The Root Cause

Your application is getting a **500 Internal Server Error** because **MongoDB is not connected**.

The error message you see: `"Unable to connect to database. Please check your MongoDB connection."`

This happens because:
- Your `.env.local` is configured for local MongoDB (`mongodb://localhost:27017/adohealthicmr`)
- But MongoDB is **not running** on your computer
- The connection fails with: `ECONNREFUSED 127.0.0.1:27017`

## ✅ The Solution

You have **2 options**:

### Option 1: MongoDB Atlas (Cloud) ⭐ **RECOMMENDED - Easiest**

**Why choose this?**
- ✅ No installation needed
- ✅ Free forever (512MB storage)
- ✅ Works in 5 minutes
- ✅ Accessible from anywhere

**Steps:**
1. **Read:** `FIX_MONGODB_NOW.md` - Complete step-by-step guide
2. **Or read:** `START_HERE.md` - Quick start guide
3. **After setup, test:** `npm run test-db`
4. **Create admin:** `npm run create-default-admin`
5. **Restart server:** `npm run dev`
6. **Login:** Username: `adohealthicmr`, Password: `Welcome@25`

### Option 2: Local MongoDB

**Why choose this?**
- ✅ Full control
- ✅ No internet required
- ✅ More storage (if you upgrade)

**Steps:**
1. **Download:** https://www.mongodb.com/try/download/community
2. **Install** MongoDB Community Server
3. **Start service:**
   ```powershell
   Start-Service MongoDB
   ```
4. **Test:** `npm run test-db`
5. **Create admin:** `npm run create-default-admin`
6. **Restart server:** `npm run dev`

## 🧪 Testing Your Setup

### Test 1: Database Connection
```bash
npm run test-db
```
**Expected:** `✅ SUCCESS! MongoDB is connected!`

### Test 2: Health Check API
Visit: `http://localhost:3000/api/health`

**Expected:**
```json
{
  "status": "healthy",
  "database": "connected",
  "adminUserExists": true,
  "totalUsers": 1
}
```

### Test 3: Login
1. Go to http://localhost:3000
2. Click "Admin Login"
3. Username: `adohealthicmr`
4. Password: `Welcome@25`
5. Should login successfully ✅

## 📋 Quick Checklist

- [ ] MongoDB Atlas account created OR Local MongoDB installed
- [ ] Connection string configured in `.env.local`
- [ ] Database connection test passes (`npm run test-db`)
- [ ] Admin user created (`npm run create-default-admin`)
- [ ] Server restarted (`npm run dev`)
- [ ] Health check returns "healthy" (`/api/health`)
- [ ] Login works with `adohealthicmr` / `Welcome@25`

## 🆘 Still Getting Errors?

### Error: "ECONNREFUSED"
**Problem:** MongoDB is not running
**Solution:** 
- Use MongoDB Atlas (Option 1), OR
- Install and start local MongoDB (Option 2)

### Error: "Authentication failed"
**Problem:** Wrong username/password in connection string
**Solution:** 
- Check `.env.local` MONGODB_URI
- Make sure password is correct (no special characters need encoding)

### Error: "IP not whitelisted"
**Problem:** Your IP is not allowed in MongoDB Atlas
**Solution:** 
- Go to Atlas → Network Access
- Click "Add IP Address"
- Choose "Allow Access from Anywhere"

### Error: "Module not found"
**Problem:** Dependencies not installed
**Solution:** 
```bash
npm install
```

## 📚 Documentation Files

- **`START_HERE.md`** - Quick start guide (read this first!)
- **`FIX_MONGODB_NOW.md`** - Detailed MongoDB Atlas setup
- **`QUICK_SETUP_MONGODB.md`** - Quick reference for both options
- **`TROUBLESHOOTING.md`** - Common issues and solutions
- **`IMMEDIATE_FIX.md`** - Immediate fix steps

## 🎉 After Fixing

Once MongoDB is connected:
1. ✅ The 500 error will disappear
2. ✅ Login will work
3. ✅ All API endpoints will function
4. ✅ You can use the full application

---

**Need help?** Check the terminal where `npm run dev` is running - it shows the exact error message.
