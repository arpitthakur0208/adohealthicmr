# 🔧 FINAL FIX: MongoDB Connection

## The Problem
MongoDB is **NOT installed** on your computer. The connection test shows `ECONNREFUSED` because there's no MongoDB server running.

## ✅ SOLUTION: Use MongoDB Atlas (Cloud) - FASTEST FIX

This is the **easiest and fastest** solution - no installation needed!

### Step-by-Step (5 minutes):

1. **Sign Up (FREE):**
   - Go to: **https://www.mongodb.com/cloud/atlas/register**
   - Sign up with Google/GitHub/Email
   - **No credit card required!**

2. **Create Free Cluster:**
   - After login, click **"Build a Database"**
   - Select **"FREE" (M0 Sandbox)**
   - Choose any region
   - Click **"Create"** (takes 3-5 minutes)

3. **Create Database User:**
   - Go to **"Database Access"** (left sidebar)
   - Click **"Add New Database User"**
   - Username: `adohealth` (or any name)
   - Password: Click **"Autogenerate Secure Password"** → **COPY AND SAVE IT!**
   - Database User Privileges: **"Atlas admin"**
   - Click **"Add User"**

4. **Configure Network Access:**
   - Go to **"Network Access"** (left sidebar)
   - Click **"Add IP Address"**
   - Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - Click **"Confirm"**

5. **Get Connection String:**
   - Go to **"Database"** (left sidebar)
   - Click **"Connect"** button on your cluster
   - Choose **"Connect your application"**
   - Driver: **Node.js**, Version: **5.5 or later**
   - **Copy the connection string**
   - It looks like: `mongodb+srv://adohealth:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority`

6. **Update `.env.local`:**
   
   Open `.env.local` and **REPLACE** this line:
   ```env
   MONGODB_URI=mongodb://localhost:27017/adohealthicmr
   ```
   
   **WITH** (replace YOUR_PASSWORD and cluster address):
   ```env
   MONGODB_URI=mongodb+srv://adohealth:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/adohealthicmr?retryWrites=true&w=majority
   ```
   
   **Example:**
   ```env
   MONGODB_URI=mongodb+srv://adohealth:MyPassword123@cluster0.abc123.mongodb.net/adohealthicmr?retryWrites=true&w=majority
   ```
   
   **⚠️ CRITICAL:**
   - Replace `YOUR_PASSWORD` with the password you saved in Step 3
   - Replace `cluster0.xxxxx.mongodb.net` with your actual cluster address
   - Make sure `/adohealthicmr` is added **before** the `?`
   - No spaces in the connection string

7. **Test Connection:**
   ```bash
   npm run test-db
   ```
   **Expected:** `✅ SUCCESS! MongoDB is connected!`

8. **Create Admin User:**
   ```bash
   npm run create-default-admin
   ```
   **Expected output:**
   ```
   ✅ Connected to database
   ✅ Default admin user created successfully!
      Username: adohealthicmr
      Password: Welcome@25
   ```

9. **Restart Server:**
   ```bash
   npm run dev
   ```

10. **Test Login:**
    - Go to http://localhost:3000
    - Click "Admin Login"
    - Username: `adohealthicmr`
    - Password: `Welcome@25`

## ✅ Verify It's Working

Visit: `http://localhost:3000/api/health`

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "adminUserExists": true,
  "totalUsers": 1
}
```

## 🆘 Common Issues

### "Authentication failed"
- **Problem:** Wrong password in connection string
- **Fix:** Double-check the password you saved in Step 3
- **Note:** If password has special characters, they might need URL encoding

### "IP not whitelisted"
- **Problem:** Your IP is not allowed
- **Fix:** Go to Network Access → Make sure "Allow Access from Anywhere" (0.0.0.0/0) is added

### "Invalid connection string"
- **Problem:** Missing `/adohealthicmr` or wrong format
- **Fix:** Make sure the connection string has `/adohealthicmr` before the `?`
- **Format:** `mongodb+srv://username:password@cluster/database?options`

### Still getting errors?
- Check the terminal where `npm run dev` is running for detailed error messages
- Verify `.env.local` file has the correct connection string
- Make sure you restarted the server after updating `.env.local`

---

## 🎯 Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster created (M0)
- [ ] Database user created (username + password saved)
- [ ] Network access configured (Allow from anywhere)
- [ ] Connection string copied from Atlas
- [ ] `.env.local` updated with connection string (password replaced, `/adohealthicmr` added)
- [ ] Connection test passes (`npm run test-db`)
- [ ] Admin user created (`npm run create-default-admin`)
- [ ] Server restarted (`npm run dev`)
- [ ] Health check returns "healthy" (`/api/health`)
- [ ] Login works with `adohealthicmr` / `Welcome@25`

---

**After completing these steps, your MongoDB connection will work and the 500 error will be fixed!** ✅
