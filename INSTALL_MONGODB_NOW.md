# 🔧 MongoDB Not Installed - Fix This Now

## The Problem
MongoDB service doesn't exist because **MongoDB is not installed** on your computer.

## ✅ SOLUTION: Install MongoDB

### Option 1: Quick Install (Recommended)

1. **Download MongoDB:**
   - Go to: **https://www.mongodb.com/try/download/community**
   - Select:
     - **Version:** Latest (7.0 or newer)
     - **Platform:** Windows
     - **Package:** MSI
   - Click **"Download"**

2. **Install MongoDB:**
   - Run the downloaded `.msi` file
   - Click **"Next"** through the setup wizard
   - **IMPORTANT:** On "Service Configuration" screen:
     - ✅ Check **"Install MongoDB as a Service"**
     - Service Name: `MongoDB` (default)
     - ✅ Check **"Run service as Network Service user"**
   - ✅ Check **"Install MongoDB Compass"** (optional GUI tool)
   - Click **"Install"**
   - Wait for installation to complete
   - Click **"Finish"**

3. **Verify Installation:**
   Open PowerShell and run:
   ```powershell
   Get-Service MongoDB
   ```
   Should show: `Status: Running`

4. **If Service is Not Running:**
   ```powershell
   Start-Service MongoDB
   ```

5. **Test Connection:**
   ```bash
   npm run test-db
   ```
   Should show: `✅ SUCCESS! MongoDB is connected!`

6. **Create Admin User:**
   ```bash
   npm run create-default-admin
   ```

7. **Restart Server:**
   ```bash
   npm run dev
   ```

---

## Option 2: Use MongoDB Atlas (Cloud - No Installation)

If you don't want to install MongoDB locally, use MongoDB Atlas (cloud):

1. **Sign up:** https://www.mongodb.com/cloud/atlas/register (FREE)
2. **Create cluster:** "Build Database" → "FREE" → Create
3. **Create user:** Database Access → Add User → Save password
4. **Network access:** Network Access → Add IP → "Allow from anywhere"
5. **Get connection string:** Database → Connect → "Connect your application"
6. **Update `.env.local`:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/adohealthicmr?retryWrites=true&w=majority
   ```
7. **Test:** `npm run test-db`

See `DO_THIS_NOW.md` for detailed Atlas setup.

---

## 🆘 Troubleshooting Installation

### "Access Denied" during installation
- Run the installer as Administrator
- Right-click `.msi` file → "Run as administrator"

### Service still not found after installation
- Reinstall MongoDB
- Make sure to check "Install MongoDB as a Service"
- Check installation logs for errors

### Service exists but won't start
```powershell
# Check service status
Get-Service MongoDB

# Try to start it
Start-Service MongoDB

# If it fails, check logs
Get-EventLog -LogName Application -Source MongoDB -Newest 10
```

### Port 27017 already in use
- Another application is using port 27017
- Stop the conflicting service or change MongoDB port

---

## ✅ After Installation

Once MongoDB is installed and running:

1. **Test:** `npm run test-db` → Should show `✅ SUCCESS!`
2. **Create admin:** `npm run create-default-admin`
3. **Restart:** `npm run dev`
4. **Login:** Username `adohealthicmr`, Password `Welcome@25`

---

**Need help?** If installation fails, use MongoDB Atlas instead - it's easier and requires no installation!
