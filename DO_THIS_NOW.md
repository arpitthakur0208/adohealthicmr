# ⚠️ ACTION REQUIRED: Set Up MongoDB

## Current Problem
Your `.env.local` is configured for **local MongoDB**, but MongoDB is **NOT installed** on your computer.

## ✅ SOLUTION: Choose ONE Option

---

## 🚀 OPTION 1: MongoDB Atlas (Cloud) - RECOMMENDED ⭐

**Time: 5 minutes | No installation needed**

### Step-by-Step:

1. **Sign Up:** https://www.mongodb.com/cloud/atlas/register
   - Click "Sign Up" (FREE, no credit card)

2. **Create Cluster:**
   - After login, click **"Build a Database"**
   - Select **"FREE" (M0 Sandbox)**
   - Click **"Create"** (wait 3-5 minutes)

3. **Create Database User:**
   - Go to **"Database Access"** (left sidebar)
   - Click **"Add New Database User"**
   - Username: `adohealth`
   - Password: Click **"Autogenerate Secure Password"** → **COPY IT!**
   - Database User Privileges: **"Atlas admin"**
   - Click **"Add User"**

4. **Configure Network:**
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
   MONGODB_URI=mongodb+srv://adohealth:MyPass123@cluster0.abc123.mongodb.net/adohealthicmr?retryWrites=true&w=majority
   ```
   
   **⚠️ IMPORTANT:**
   - Replace `YOUR_PASSWORD` with the password you saved in Step 3
   - Replace `cluster0.xxxxx.mongodb.net` with your actual cluster address
   - Make sure `/adohealthicmr` is added before the `?`

7. **Test Connection:**
   ```bash
   npm run test-db
   ```
   **Expected:** `✅ SUCCESS! MongoDB is connected!`

8. **Create Admin User:**
   ```bash
   npm run create-default-admin
   ```

9. **Restart Server:**
   ```bash
   npm run dev
   ```

10. **Test Login:**
    - Go to http://localhost:3000
    - Username: `adohealthicmr`
    - Password: `Welcome@25`

---

## 💻 OPTION 2: Install Local MongoDB

**Time: 10-15 minutes | Requires installation**

### Steps:

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Select: **Windows** → **MSI** → **Download**

2. **Install:**
   - Run the downloaded `.msi` file
   - During installation:
     - ✅ Check **"Install MongoDB as a Service"**
     - ✅ Check **"Install MongoDB Compass"** (optional GUI tool)
   - Click **"Install"**

3. **Start MongoDB Service:**
   ```powershell
   Start-Service MongoDB
   ```

4. **Verify It's Running:**
   ```powershell
   Get-Service MongoDB
   ```
   Should show: `Status: Running`

5. **Test Connection:**
   ```bash
   npm run test-db
   ```
   **Expected:** `✅ SUCCESS! MongoDB is connected!`

6. **Create Admin User:**
   ```bash
   npm run create-default-admin
   ```

7. **Restart Server:**
   ```bash
   npm run dev
   ```

**Note:** Your `.env.local` is already configured for local MongoDB, so no changes needed!

---

## 🎯 Which Should You Choose?

**Choose MongoDB Atlas if:**
- ✅ You want to get started quickly (5 minutes)
- ✅ You don't want to install anything
- ✅ You want cloud access
- ✅ You're okay with free tier (512MB storage)

**Choose Local MongoDB if:**
- ✅ You prefer local development
- ✅ You want full control
- ✅ You need more storage
- ✅ You're comfortable installing software

---

## ✅ After Setup - Verify

1. **Test Connection:**
   ```bash
   npm run test-db
   ```
   Should show: `✅ SUCCESS!`

2. **Health Check:**
   Visit: `http://localhost:3000/api/health`
   Should return:
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "adminUserExists": true
   }
   ```

3. **Test Login:**
   - Username: `adohealthicmr`
   - Password: `Welcome@25`

---

## 🆘 Common Issues

### "Authentication failed" (Atlas)
- Check password in connection string
- Make sure you replaced `<password>` with actual password

### "IP not whitelisted" (Atlas)
- Go to Network Access → Add IP → "Allow from anywhere"

### "Service not found" (Local)
- MongoDB not installed or service not created
- Reinstall and check "Install as Service"

---

**Need help?** Check the terminal where `npm run dev` is running for detailed error messages.
