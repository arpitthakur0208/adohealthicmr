# ⚡ Quick MongoDB Setup (Choose One)

## Option 1: MongoDB Atlas (Recommended - 5 minutes) ⭐

### Why Atlas?
- ✅ No installation needed
- ✅ Free forever (M0 tier)
- ✅ Works immediately
- ✅ Cloud-based (accessible anywhere)

### Quick Steps:
1. **Sign up:** https://www.mongodb.com/cloud/atlas/register
2. **Create cluster:** Click "Build Database" → Choose "FREE" → Create
3. **Create user:** Database Access → Add User → Save username/password
4. **Allow IP:** Network Access → Add IP → "Allow from anywhere"
5. **Get connection string:** Database → Connect → "Connect your application" → Copy string
6. **Update `.env.local`:**
   ```env
   MONGODB_URI=mongodb+srv://YOUR_USERNAME:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/adohealthicmr?retryWrites=true&w=majority
   ```
   Replace `YOUR_USERNAME`, `YOUR_PASSWORD`, and `cluster0.xxxxx.mongodb.net` with your values.

7. **Restart server:** `npm run dev`
8. **Create admin:** `npm run create-default-admin`
9. **Login:** Username: `adohealthicmr`, Password: `Welcome@25`

---

## Option 2: Local MongoDB (If you prefer local)

### Install MongoDB:
1. Download: https://www.mongodb.com/try/download/community
2. Install MongoDB Community Server
3. During installation, check "Install MongoDB as a Service"

### Start MongoDB:
```powershell
Start-Service MongoDB
```

### Verify it's running:
```powershell
Get-Service MongoDB
```

### Your `.env.local` should already have:
```env
MONGODB_URI=mongodb://localhost:27017/adohealthicmr
```

### Then:
1. Restart server: `npm run dev`
2. Create admin: `npm run create-default-admin`
3. Login: Username: `adohealthicmr`, Password: `Welcome@25`

---

## 🎯 Which Should You Choose?

**Choose MongoDB Atlas if:**
- You want to get started quickly
- You don't want to install anything
- You want cloud access
- You're okay with free tier limits (512MB storage)

**Choose Local MongoDB if:**
- You want full control
- You need more storage
- You prefer local development
- You're comfortable installing software

---

## ✅ After Setup, Test:

Visit: `http://localhost:3000/api/health`

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "adminUserExists": true
}
```
