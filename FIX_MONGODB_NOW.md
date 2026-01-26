# 🚨 URGENT: Fix MongoDB Connection - Step by Step

## The Problem
Your app can't connect to MongoDB because it's not running. Error: `ECONNREFUSED 127.0.0.1:27017`

## ✅ SOLUTION: Use MongoDB Atlas (Cloud - 5 minutes)

### Step 1: Create Free MongoDB Atlas Account
1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with Google/GitHub/Email (FREE, no credit card needed)
3. Verify your email

### Step 2: Create a Free Cluster
1. After login, click **"Build a Database"**
2. Choose **"FREE" (M0 Sandbox)** - it's free forever
3. Select any cloud provider (AWS, Google Cloud, Azure)
4. Choose any region (closest to you)
5. Click **"Create"** (takes 3-5 minutes)

### Step 3: Create Database User
1. While cluster is creating, go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `adohealth` (or any name you want)
5. Password: **Create a strong password** (SAVE IT!)
   - Click "Autogenerate Secure Password" or create your own
   - **COPY THE PASSWORD** - you'll need it!
6. Database User Privileges: **"Atlas admin"**
7. Click **"Add User"**

### Step 4: Configure Network Access
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - Or add your specific IP address
4. Click **"Confirm"**

### Step 5: Get Connection String
1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. **Copy the connection string** - looks like:
   ```
   mongodb+srv://adohealth:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update .env.local File
1. Open `.env.local` in your project
2. Replace the `MONGODB_URI` line with your connection string
3. **Replace `<password>` with your database user password**
4. **Add `/adohealthicmr` before the `?`** in the connection string

**Example:**
```env
MONGODB_URI=mongodb+srv://adohealth:YourPassword123@cluster0.abc123.mongodb.net/adohealthicmr?retryWrites=true&w=majority
```

**IMPORTANT:** 
- Replace `YourPassword123` with your actual database user password
- Replace `cluster0.abc123.mongodb.net` with your actual cluster address
- Keep `/adohealthicmr` at the end (this is your database name)

### Step 7: Restart Your Server
```bash
# Stop server (Ctrl+C)
# Then restart
npm run dev
```

### Step 8: Create Admin User
```bash
npm run create-default-admin
```

Expected output:
```
✅ Connected to database
✅ Default admin user created successfully!
   Username: adohealthicmr
   Password: Welcome@25
```

### Step 9: Test Login
1. Go to http://localhost:3000
2. Click "Admin Login"
3. Username: `adohealthicmr`
4. Password: `Welcome@25`
5. Click "Admin Login"

## ✅ Verify It's Working

Visit: `http://localhost:3000/api/health`

Should show:
```json
{
  "status": "healthy",
  "database": "connected",
  "adminUserExists": true,
  "totalUsers": 1
}
```

## 🆘 Still Having Issues?

### Common Problems:

1. **"Authentication failed"**
   - Check your database user password in the connection string
   - Make sure you replaced `<password>` with actual password

2. **"IP not whitelisted"**
   - Go to Network Access in Atlas
   - Make sure "Allow Access from Anywhere" is added

3. **"Invalid connection string"**
   - Make sure you added `/adohealthicmr` before the `?`
   - Check for typos in username/password

4. **"Module not found"**
   - Run: `npm install`
   - Clear cache: `Remove-Item -Recurse -Force .next`

## 📝 Quick Checklist

- [ ] MongoDB Atlas account created
- [ ] Free cluster created (M0)
- [ ] Database user created (username + password saved)
- [ ] Network access configured (Allow from anywhere)
- [ ] Connection string copied
- [ ] `.env.local` updated with connection string
- [ ] Server restarted (`npm run dev`)
- [ ] Admin user created (`npm run create-default-admin`)
- [ ] Health check passes (`/api/health`)
- [ ] Login works with `adohealthicmr` / `Welcome@25`

---

**Need help?** Check the terminal where `npm run dev` is running - it will show the exact error message.
