# 🔧 FIX MONGODB CONNECTION - Choose Your Path

## Current Status
❌ MongoDB is NOT connected
❌ Error: `ECONNREFUSED 127.0.0.1:27017`

---

## 🚀 OPTION 1: MongoDB Atlas (EASIEST - Recommended)

### Why Choose This?
- ✅ No installation needed
- ✅ Works in 5 minutes
- ✅ Free forever
- ✅ No local setup required

### Quick Steps:

1. **Go to:** https://www.mongodb.com/cloud/atlas/register
   - Sign up (FREE, no credit card)

2. **Create Cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0)
   - Click "Create" (wait 3-5 min)

3. **Create User:**
   - "Database Access" → "Add New Database User"
   - Username: `adohealth`
   - Password: **Generate and SAVE IT!**
   - Privileges: "Atlas admin"
   - Click "Add User"

4. **Network Access:**
   - "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere"
   - Click "Confirm"

5. **Get Connection String:**
   - "Database" → Click "Connect" on cluster
   - "Connect your application"
   - Copy the string (looks like: `mongodb+srv://adohealth:<password>@cluster0.xxxxx.mongodb.net/...`)

6. **Update `.env.local`:**
   Open `.env.local` and replace:
   ```env
   MONGODB_URI=mongodb://localhost:27017/adohealthicmr
   ```
   
   With (replace YOUR_PASSWORD and cluster address):
   ```env
   MONGODB_URI=mongodb+srv://adohealth:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/adohealthicmr?retryWrites=true&w=majority
   ```
   
   **IMPORTANT:** 
   - Replace `YOUR_PASSWORD` with your actual password
   - Replace `cluster0.xxxxx.mongodb.net` with your actual cluster address
   - Make sure `/adohealthicmr` is before the `?`

7. **Test:**
   ```bash
   npm run test-db
   ```
   Should show: `✅ SUCCESS!`

8. **Create Admin:**
   ```bash
   npm run create-default-admin
   ```

9. **Restart:**
   ```bash
   npm run dev
   ```

---

## 💻 OPTION 2: Local MongoDB

### If You Prefer Local Setup:

1. **Download MongoDB:**
   - Go to: https://www.mongodb.com/try/download/community
   - Download Windows installer
   - Run installer

2. **During Installation:**
   - Check ✅ "Install MongoDB as a Service"
   - Check ✅ "Install MongoDB Compass" (optional GUI)

3. **After Installation, Start Service:**
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
   Should show: `✅ SUCCESS!`

6. **Create Admin:**
   ```bash
   npm run create-default-admin
   ```

7. **Restart Server:**
   ```bash
   npm run dev
   ```

**Note:** Your `.env.local` is already configured for local MongoDB, so no changes needed!

---

## ❓ Which Should You Choose?

**Choose MongoDB Atlas if:**
- You want to get started quickly (5 minutes)
- You don't want to install anything
- You want cloud access

**Choose Local MongoDB if:**
- You prefer local development
- You want full control
- You're comfortable installing software

---

## ✅ After Setup

Once connected, test:
1. **Health Check:** Visit `http://localhost:3000/api/health`
2. **Login:** Username `adohealthicmr`, Password `Welcome@25`

---

## 🆘 Still Not Working?

1. **Check `.env.local`** - Make sure MONGODB_URI is correct
2. **Check terminal** - Look for error messages
3. **For Atlas:** Make sure IP is whitelisted and password is correct
4. **For Local:** Make sure MongoDB service is running
