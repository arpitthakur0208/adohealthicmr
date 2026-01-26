# ✅ After MongoDB Installation - Next Steps

## Check Installation Status

### Step 1: Verify MongoDB is Installed

Run in PowerShell:
```powershell
Get-Service MongoDB
```

**If service exists:**
- Status should be `Running` or `Stopped`
- If `Stopped`, run: `Start-Service MongoDB`

**If service doesn't exist:**
- Installation may still be in progress
- Or installation failed - try manual installation

### Step 2: Check Installation Location

```powershell
Test-Path "C:\Program Files\MongoDB"
```

Should return: `True`

### Step 3: If MongoDB is Installed but Service Not Running

1. **Find MongoDB installation:**
   ```powershell
   Get-ChildItem "C:\Program Files\MongoDB\Server" -Directory
   ```
   This shows installed versions (e.g., `8.2.3`)

2. **Create data directory:**
   ```powershell
   New-Item -ItemType Directory -Force -Path "C:\data\db"
   ```

3. **Install MongoDB as a service manually:**
   ```powershell
   & "C:\Program Files\MongoDB\Server\<version>\bin\mongod.exe" --install --serviceName "MongoDB" --serviceDisplayName "MongoDB" --dbpath "C:\data\db"
   ```
   (Replace `<version>` with your MongoDB version, e.g., `8.2.3`)

4. **Start the service:**
   ```powershell
   Start-Service MongoDB
   ```

### Step 4: Test Connection

```bash
npm run test-db
```

Should show: `✅ SUCCESS! MongoDB is connected!`

### Step 5: Create Admin User

```bash
npm run create-default-admin
```

### Step 6: Restart Server

```bash
npm run dev
```

## 🆘 If Installation Failed

### Option 1: Manual Installation

1. **Download:** https://www.mongodb.com/try/download/community
2. **Select:** Windows → MSI → Download
3. **Run installer:**
   - Check "Install MongoDB as a Service"
   - Complete installation
4. **Start service:**
   ```powershell
   Start-Service MongoDB
   ```

### Option 2: Use MongoDB Atlas (Cloud)

If installation is problematic, use MongoDB Atlas (cloud):
1. Sign up: https://www.mongodb.com/cloud/atlas/register
2. Follow steps in `DO_THIS_NOW.md`

## ✅ Quick Verification Commands

```powershell
# Check if service exists
Get-Service MongoDB

# Check if MongoDB is installed
Test-Path "C:\Program Files\MongoDB"

# Check MongoDB version
& "C:\Program Files\MongoDB\Server\*\bin\mongod.exe" --version

# Test connection
npm run test-db
```

---

**After MongoDB is running, your connection will work!** ✅
