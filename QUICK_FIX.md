# ⚡ QUICK FIX - Start MongoDB Now

## The Problem
MongoDB is installed but not running. The connection fails because MongoDB needs to be started manually.

## ✅ SOLUTION - Choose One:

### Method 1: Run Batch File (EASIEST) ⭐
1. **Find** `start-mongodb-debug.bat` in your project folder
2. **Right-click** → **"Run as administrator"**
3. A window will open showing MongoDB output
4. **Keep that window open**
5. Wait 10 seconds, then run: `npm run test-db`

### Method 2: Command Prompt (as Administrator)
1. Press `Win + X` → Select **"Command Prompt (Admin)"** or **"Terminal (Admin)"**
2. Navigate to project:
   ```cmd
   cd C:\Users\chaki\adohealthicmr
   ```
3. Run:
   ```cmd
   start-mongodb-debug.bat
   ```

### Method 3: PowerShell (as Administrator)
1. Press `Win + X` → Select **"Windows PowerShell (Admin)"**
2. Run:
   ```powershell
   cd C:\Users\chaki\adohealthicmr
   & "C:\Program Files\MongoDB\Server\8.2\bin\mongod.exe" --dbpath "C:\data\db"
   ```

---

## ✅ After Starting MongoDB

Wait 10-15 seconds for MongoDB to fully start, then test:

```bash
npm run test-db
```

**Expected output:**
```
✅ SUCCESS! MongoDB is connected!
```

---

## ⚠️ Important Notes

1. **Run as Administrator** - MongoDB needs admin rights
2. **Keep MongoDB Running** - Don't close the MongoDB window while developing
3. **Wait 10-15 seconds** - MongoDB needs time to initialize

---

## 🔍 If MongoDB Still Won't Start

Check the MongoDB window for error messages. Common issues:

- **"Access Denied"** → Run as Administrator
- **"Port already in use"** → Something else is using port 27017
- **"Cannot create data directory"** → Run as Administrator

---

## 📝 Your Configuration is Correct!

Your `.env.local` is already set correctly:
```
MONGODB_URI=mongodb://localhost:27017/adohealthicmr
```

You just need to **start MongoDB**!
