# 🚀 Quick MongoDB Setup Guide

## Problem
MongoDB connection is failing because MongoDB is not running locally.

## ✅ Solution: Use MongoDB Atlas (Cloud) - Recommended

MongoDB Atlas is free and doesn't require local installation.

### Step 1: Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/cloud/atlas
2. Sign up for free (or login if you have an account)
3. Create a free cluster (M0 - Free tier)

### Step 2: Configure Database Access
1. Go to **Database Access** → **Add New Database User**
2. Choose **Password** authentication
3. Create username and password (save these!)
4. Set user privileges to **Read and write to any database**
5. Click **Add User**

### Step 3: Configure Network Access
1. Go to **Network Access** → **Add IP Address**
2. Click **Add Current IP Address** (or use `0.0.0.0/0` to allow all IPs)
3. Click **Confirm**

### Step 4: Get Connection String
1. Go to **Clusters** → Click **Connect** on your cluster
2. Choose **Connect your application**
3. Select **Node.js** and version **5.5 or later**
4. Copy the connection string (looks like):
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 5: Update .env.local

**Option A: Use the setup script (Easiest)**
```bash
npm run setup-mongodb
```
Follow the prompts and paste your connection string.

**Option B: Manual setup**
1. Open `.env.local` file
2. Replace the connection string:
   ```env
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/adohealthicmr?retryWrites=true&w=majority
   ```
   Replace:
   - `YOUR_USERNAME` with your database username
   - `YOUR_PASSWORD` with your database password
   - `cluster0.xxxxx.mongodb.net` with your actual cluster address

### Step 6: Test Connection
```bash
npm run test-db
```

You should see: ✅ SUCCESS! MongoDB is connected!

### Step 7: Create Admin User
After successful connection:
```bash
npm run create-default-admin
```

---

## 🔧 Alternative: Use Local MongoDB

If you prefer local MongoDB:

### Install MongoDB
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Edition
3. Start MongoDB service:

**Windows PowerShell:**
```powershell
Start-Service MongoDB
```

**Or start manually:**
```bash
mongod --dbpath "C:\data\db"
```

### Update .env.local
```env
MONGODB_URI=mongodb://localhost:27017/adohealthicmr
```

### Test Connection
```bash
npm run test-db
```

---

## 🆘 Troubleshooting

### Connection Refused (ECONNREFUSED)
- **Local MongoDB**: Make sure MongoDB service is running
- **MongoDB Atlas**: Check Network Access → Your IP is whitelisted

### Authentication Failed
- Check username and password in connection string
- Make sure you replaced `<password>` with actual password

### SRV/DNS Error
- Some networks don't support `mongodb+srv://`
- Use **non-SRV connection string** from MongoDB Atlas:
  - Go to **Clusters** → **Connect** → **Drivers**
  - Choose **Standard connection string** (not SRV)
  - Copy and use that instead

### Still Having Issues?
Run the diagnostic tool:
```bash
npm run diagnose-mongodb
```

This will check your configuration and provide specific solutions.
