# 🔧 MongoDB Connection Fix Guide

This guide follows the troubleshooting steps to fix MongoDB connection issues.

## ✅ STEP 1: Verify MongoDB Connection

### If using MongoDB Atlas (MOST COMMON):

Test your connection string directly:
```bash
mongosh "mongodb+srv://USERNAME:PASSWORD@CLUSTER.mongodb.net/DATABASE"
```

- ✔ If this connects → MongoDB credentials are correct
- ❌ If this fails → hosting / IP / DNS issue

## ✅ STEP 2: FIX SRV / DNS ISSUE (VERY COMMON)

Many servers & shared hosting fail with `mongodb+srv://`.

### Use NON-SRV connection (PERMANENT FIX)

Instead of:
```
mongodb+srv://username:password@cluster0.mongodb.net/database
```

Use:
```
mongodb://username:password@cluster0-shard-00-00.mongodb.net:27017,cluster0-shard-00-01.mongodb.net:27017,cluster0-shard-00-02.mongodb.net:27017/database?ssl=true&replicaSet=atlas-xxxxx&authSource=admin
```

📌 Get this URL from: **MongoDB Atlas → Connect → Drivers → "Standard connection string"**

## ✅ STEP 3: CHECK IF HOSTING BLOCKS MONGODB (CRITICAL)

Run this in PowerShell:
```powershell
Test-NetConnection -ComputerName cluster0.mongodb.net -Port 27017
```

Or test with telnet (if available):
```bash
telnet cluster0.mongodb.net 27017
```

**Results:**
- ❌ Connection refused / timeout → MongoDB is BLOCKED by hosting
- ✅ Connected → MongoDB allowed
- ⚠️ If blocked → NO CODE OR AI CAN FIX THIS

## ✅ STEP 4: PERMANENT NODE.JS FIX COMMAND

Run backend with Mongo debug:
```powershell
$env:DEBUG="mongoose:*"; npm run dev
```

This will show:
- auth error
- timeout
- DNS error
- IP whitelist issue

## ✅ STEP 5: PERMANENT ENV FIX (VERY IMPORTANT)

### Check your .env.local file:
```bash
cat .env.local
# Or in PowerShell:
Get-Content .env.local
```

Make sure:
```env
MONGODB_URI=mongodb://USERNAME:PASSWORD@HOST:27017/DATABASE
# OR for Atlas with non-SRV:
MONGODB_URI=mongodb://username:password@cluster0-shard-00-00.mongodb.net:27017,cluster0-shard-00-01.mongodb.net:27017,cluster0-shard-00-02.mongodb.net:27017/database?ssl=true&replicaSet=atlas-xxxxx&authSource=admin
```

Then restart:
```bash
npm run dev
```

## 🚨 REALITY CHECK (IMPORTANT)

If your backend is on Websill / shared hosting:
- ❌ MongoDB is NOT supported ❌ No Cursor AI command can fix it
- ✅ PERMANENT SOLUTION: Move backend to:
  - Render
  - Railway
  - VPS (DigitalOcean / AWS)
  - Hostinger VPS
  - Frontend can stay where it is.

## 🟢 ONE COMMAND THAT DECIDES EVERYTHING

Run the diagnostic script:
```bash
npm run diagnose-mongodb
```

This will:
1. Check your .env.local configuration
2. Test the MongoDB connection
3. Provide specific error diagnosis
4. Give you exact steps to fix

## 📝 Quick Setup for MongoDB Atlas

1. **Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**
2. **Create/get your cluster**
3. **Database Access → Create user** (username and password)
4. **Network Access → Add IP Address → `0.0.0.0/0`** (allows all IPs)
5. **Clusters → Connect → Get connection string**
6. **Choose connection method:**
   - If SRV works: Use `mongodb+srv://...`
   - If SRV fails: Use "Standard connection string" (non-SRV)
7. **Replace `<password>` and `<dbname>` in connection string**
8. **Update `.env.local` with the connection string**

## 🔍 Test Your Connection

After updating `.env.local`, test with:
```bash
npm run test-db
```

Or run the full diagnostic:
```bash
npm run diagnose-mongodb
```
