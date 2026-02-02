# 🔌 Connect to Local MongoDB

## Quick Start

If MongoDB is installed, start it with:
```bash
npm run start-mongodb
```

Then test the connection:
```bash
npm run test-db
```

---

## Manual MongoDB Start Methods

### Method 1: Windows Service (If installed as service)
```powershell
Start-Service MongoDB
```

Check status:
```powershell
Get-Service MongoDB
```

### Method 2: Command Line (If MongoDB is installed)
```bash
mongod --dbpath "C:\data\db"
```

Or if data directory is elsewhere:
```bash
mongod --dbpath "%USERPROFILE%\data\db"
```

### Method 3: Using MongoDB Compass
1. Open MongoDB Compass
2. It will automatically start MongoDB if configured

---

## Verify MongoDB is Running

Test if MongoDB is listening on port 27017:
```powershell
Test-NetConnection -ComputerName localhost -Port 27017
```

Or use the test script:
```bash
npm run test-db
```

---

## Current Configuration

Your `.env.local` is already configured for local MongoDB:
```env
MONGODB_URI=mongodb://localhost:27017/adohealthicmr
```

This is correct! You just need to make sure MongoDB is running.

---

## Troubleshooting

### MongoDB Not Found
If MongoDB is not installed:
1. **Download:** https://www.mongodb.com/try/download/community
2. **Install** MongoDB Community Edition
3. **Start** MongoDB service or run `mongod` manually

### Port Already in Use
If port 27017 is already in use:
```powershell
# Find what's using the port
Get-NetTCPConnection -LocalPort 27017

# Stop MongoDB service if running
Stop-Service MongoDB
```

### Permission Denied
If you get permission errors:
1. Run PowerShell/Command Prompt as **Administrator**
2. Or create the data directory manually:
   ```powershell
   New-Item -ItemType Directory -Path "C:\data\db" -Force
   ```

### Data Directory Issues
MongoDB needs a data directory. Default locations:
- `C:\data\db`
- `%USERPROFILE%\data\db`

Create it if it doesn't exist:
```powershell
New-Item -ItemType Directory -Path "C:\data\db" -Force
```

---

## Alternative: Use MongoDB Atlas (Cloud)

If local MongoDB is causing issues, use cloud MongoDB instead:
```bash
npm run setup-mongodb
```

See: `QUICK_MONGODB_SETUP.md`

---

## Verify Connection

After starting MongoDB, test the connection:
```bash
npm run test-db
```

Expected output:
```
✅ SUCCESS! MongoDB is connected!
✅ You can now run: npm run create-default-admin
```
