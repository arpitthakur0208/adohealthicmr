# Immediate Fix for 500 Error

## ✅ Step 1: Environment File Created
I've created `.env.local` file for you. Now you need to configure MongoDB.

## 🔧 Step 2: Choose Your Database Option

### 🚀 Option A: MongoDB Atlas (Cloud - Easiest, 5 minutes)

1. **Sign up for free MongoDB Atlas:**
   - Go to: https://www.mongodb.com/cloud/atlas/register
   - Create free account (no credit card needed)

2. **Create a free cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0 Sandbox)
   - Select any region
   - Click "Create Cluster" (takes 3-5 minutes)

3. **Create database user:**
   - Go to "Database Access" → "Add New Database User"
   - Username: `adohealth` (or any username)
   - Password: Create a strong password (save it!)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"

4. **Configure Network Access:**
   - Go to "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Click "Confirm"

5. **Get connection string:**
   - Go to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `adohealthicmr`

6. **Update `.env.local`:**
   Open `.env.local` and replace the MONGODB_URI line with:
   ```env
   MONGODB_URI=mongodb+srv://adohealth:YOUR_PASSWORD@cluster0.xxxxx.mongodb.net/adohealthicmr?retryWrites=true&w=majority
   ```
   (Replace `YOUR_PASSWORD` and `cluster0.xxxxx.mongodb.net` with your actual values)

### 💻 Option B: Local MongoDB (If you have it installed)

1. **Start MongoDB service:**
   ```powershell
   Start-Service MongoDB
   ```

2. **Verify it's running:**
   ```powershell
   Get-Service MongoDB
   ```
   Should show "Running"

3. **`.env.local` is already configured for local MongoDB:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/adohealthicmr
   ```

## ✅ Step 3: Create Admin User

After MongoDB is connected, run:

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

## ✅ Step 4: Restart Server

```bash
# Stop server (Ctrl+C in terminal)
# Then restart
npm run dev
```

## ✅ Step 5: Test Login

1. Go to http://localhost:3000
2. Click "Admin Login"
3. Enter:
   - Username: `adohealthicmr`
   - Password: `Welcome@25`
4. Click "Admin Login"

## 🔍 Verify Everything Works

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

## ⚠️ Important Notes

1. **`.env.local` file is now created** with a secure JWT_SECRET
2. **You MUST configure MONGODB_URI** - either Atlas or local
3. **After configuring MongoDB, restart the server**
4. **Create the admin user** before trying to login

## 🆘 Still Having Issues?

Check the terminal where `npm run dev` is running - it will show the exact MongoDB connection error.

Common errors:
- `connect ECONNREFUSED` → MongoDB not running (local) or wrong connection string
- `authentication failed` → Wrong username/password in Atlas connection string
- `IP not whitelisted` → Add your IP in Atlas Network Access
