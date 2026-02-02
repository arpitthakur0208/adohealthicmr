# 🚀 Start Local MongoDB

## MongoDB Found!
✅ MongoDB is installed at: `C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe`

## Quick Start Options

### Option 1: Run Batch File (Easiest)
Double-click: `start-mongodb-admin.bat`

Or run:
```bash
start-mongodb-admin.bat
```

### Option 2: PowerShell (Run as Administrator)
```powershell
# Start MongoDB service (if configured)
Start-Service MongoDB

# Or start manually
& "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
```

### Option 3: Command Prompt (Run as Administrator)
```cmd
cd "C:\Program Files\MongoDB\Server\8.2\bin"
mongod --dbpath "C:\data\db"
```

---

## Verify MongoDB is Running

After starting MongoDB, test the connection:
```bash
npm run test-db
```

You should see:
```
✅ SUCCESS! MongoDB is connected!
```

---

## Current Configuration

Your `.env.local` is correctly configured:
```env
MONGODB_URI=mongodb://localhost:27017/adohealthicmr
```

This is correct! Just make sure MongoDB is running.

---

## Troubleshooting

### "Access Denied" or Permission Error
**Solution:** Run PowerShell/Command Prompt as **Administrator**

### Port 27017 Already in Use
**Solution:** 
```powershell
# Find what's using the port
Get-NetTCPConnection -LocalPort 27017

# Stop MongoDB if already running
Stop-Process -Name mongod -Force
```

### Data Directory Issues
MongoDB needs `C:\data\db` directory. It will be created automatically, but if you get errors:
```powershell
New-Item -ItemType Directory -Path "C:\data\db" -Force
```

---

## Keep MongoDB Running

MongoDB needs to stay running while you develop. Options:

1. **Keep terminal window open** (simplest)
2. **Run as Windows Service** (starts automatically):
   ```powershell
   # Install as service (run once as admin)
   & "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --install --serviceName MongoDB --dbpath "C:\data\db"
   
   # Then start service
   Start-Service MongoDB
   ```

3. **Use MongoDB Compass** - It can manage MongoDB for you

---

## Next Steps

After MongoDB is running:
1. ✅ Test connection: `npm run test-db`
2. ✅ Create admin user: `npm run create-default-admin`
3. ✅ Start your app: `npm run dev`
