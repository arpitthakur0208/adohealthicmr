# ⚡ QUICK FIX: MongoDB Connection

## The Problem
MongoDB is not running locally. Error: `ECONNREFUSED 127.0.0.1:27017`

## ✅ SOLUTION: MongoDB Atlas (5 minutes)

### Step 1: Sign Up (FREE)
1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up (no credit card needed)

### Step 2: Create Cluster
1. Click **"Build a Database"**
2. Choose **"FREE" (M0)**
3. Click **"Create"** (wait 3-5 minutes)

### Step 3: Create User
1. Go to **"Database Access"** → **"Add New Database User"**
2. Username: `adohealth`
3. Password: **Generate and SAVE IT!**
4. Privileges: **"Atlas admin"**
5. Click **"Add User"**

### Step 4: Allow Network Access
1. Go to **"Network Access"** → **"Add IP Address"**
2. Click **"Allow Access from Anywhere"**
3. Click **"Confirm"**

### Step 5: Get Connection String
1. Go to **"Database"** → Click **"Connect"** on your cluster
2. Choose **"Connect your application"**
3. Copy the connection string

### Step 6: Update .env.local
Replace this line in `.env.local`:
```env
MONGODB_URI=mongodb://localhost:27017/adohealthicmr
```

With your Atlas connection string (replace `<password>` and add `/adohealthicmr` before `?`):
```env
MONGODB_URI=mongodb+srv://adohealth:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/adohealthicmr?retryWrites=true&w=majority
```

### Step 7: Test
```bash
npm run test-db
```

Should show: `✅ SUCCESS! MongoDB is connected!`

### Step 8: Create Admin
```bash
npm run create-default-admin
```

### Step 9: Restart Server
```bash
npm run dev
```

---

## Alternative: Local MongoDB

If you prefer local MongoDB:

1. **Download:** https://www.mongodb.com/try/download/community
2. **Install** (check "Install as Service")
3. **Start:**
   ```powershell
   Start-Service MongoDB
   ```
4. **Test:**
   ```bash
   npm run test-db
   ```

Your `.env.local` is already configured for local MongoDB, so no changes needed.
