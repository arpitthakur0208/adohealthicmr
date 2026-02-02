# 🚀 Start MongoDB - Simple Instructions

## ✅ MongoDB is Installed!
Your MongoDB is installed at: `C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe`

## 🎯 EASIEST WAY TO START:

### Option 1: Double-Click Batch File (Recommended)
1. **Right-click** on `start-mongodb-admin.bat`
2. Select **"Run as administrator"**
3. A command window will open showing MongoDB starting
4. **Keep that window open** while you develop
5. Test connection: `npm run test-db`

### Option 2: Command Prompt (Run as Administrator)
1. **Right-click** on Command Prompt → **"Run as administrator"**
2. Navigate to your project:
   ```cmd
   cd C:\Users\chaki\adohealthicmr
   ```
3. Run:
   ```cmd
   start-mongodb-admin.bat
   ```

### Option 3: PowerShell (Run as Administrator)
1. **Right-click** PowerShell → **"Run as administrator"**
2. Navigate to your project:
   ```powershell
   cd C:\Users\chaki\adohealthicmr
   ```
3. Run:
   ```powershell
   & "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
   ```

---

## ✅ After Starting MongoDB

Wait 5-10 seconds for MongoDB to initialize, then test:

```bash
npm run test-db
```

You should see:
```
✅ SUCCESS! MongoDB is connected!
```

---

## ⚠️ Important Notes

1. **Keep MongoDB running** - Don't close the MongoDB window while developing
2. **Run as Administrator** - MongoDB needs admin rights to start
3. **Data Directory** - MongoDB will create `C:\data\db` automatically if it doesn't exist

---

## 🔧 If MongoDB Still Won't Start

### Check if port 27017 is in use:
```powershell
Get-NetTCPConnection -LocalPort 27017
```

### Check MongoDB service:
```powershell
Get-Service MongoDB
```

### Try starting the service:
```powershell
# Run PowerShell as Administrator
Start-Service MongoDB
```

---

## 📝 Your Configuration is Correct!

Your `.env.local` is already set correctly:
```
MONGODB_URI=mongodb://localhost:27017/adohealthicmr
```

You just need to **start MongoDB** using one of the methods above!
