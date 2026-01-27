# 🚀 Quick MongoDB Atlas Setup (5 Minutes)

## Step-by-Step Instructions

### Step 1: Sign Up for MongoDB Atlas (FREE)
1. Go to: **https://www.mongodb.com/cloud/atlas/register**
2. Sign up with Google, GitHub, or Email
3. **No credit card required** - completely free!

### Step 2: Create a Free Cluster
1. After login, click **"Build a Database"**
2. Select **"FREE" (M0 Sandbox)** - Free forever!
3. Choose any cloud provider (AWS, Google Cloud, or Azure)
4. Choose any region (pick closest to you)
5. Click **"Create"** (takes 3-5 minutes)

### Step 3: Create Database User
1. While cluster is creating, go to **"Database Access"** (left sidebar)
2. Click **"Add New Database User"**
3. Authentication Method: **"Password"**
4. Username: `adohealth` (or any name)
5. Password: Click **"Autogenerate Secure Password"** or create your own
   - **⚠️ IMPORTANT: COPY AND SAVE THIS PASSWORD!** You'll need it!
6. Database User Privileges: **"Atlas admin"**
7. Click **"Add User"**

### Step 4: Configure Network Access
1. Go to **"Network Access"** (left sidebar)
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (for development)
   - This allows connection from any IP address
4. Click **"Confirm"**

### Step 5: Get Your Connection String
1. Go back to **"Database"** (left sidebar)
2. Click **"Connect"** button on your cluster
3. Choose **"Connect your application"**
4. Driver: **Node.js**, Version: **5.5 or later**
5. **Copy the connection string** - it looks like:
   ```
   mongodb+srv://adohealth:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```

### Step 6: Update Your .env.local File
1. Open `.env.local` in your project
2. Find the line: `MONGODB_URI=mongodb://localhost:27017/adohealthicmr`
3. Replace it with your Atlas connection string
4. **IMPORTANT CHANGES:**
   - Replace `<password>` with your actual database user password
   - Add `/adohealthicmr` before the `?` (this is your database name)

**Example:**
```env
MONGODB_URI=mongodb+srv://adohealth:MyPassword123@cluster0.abc123.mongodb.net/adohealthicmr?retryWrites=true&w=majority
```

**⚠️ Make sure:**
- Password is correct (the one you saved in Step 3)
- `/adohealthicmr` is added before the `?`
- No spaces in the connection string

### Step 7: Test the Connection
```bash
npm run test-db
```

**Expected output:**
```
✅ SUCCESS! MongoDB is connected!
✅ You can now run: npm run create-default-admin
```

### Step 8: Create Admin User
```bash
npm run create-default-admin
```

**Expected output:**
```
✅ Connected to database
✅ Default admin user created successfully!
   Username: adohealthicmr
   Email: admin@adohealthicmr.com
   Role: admin
   Password: Welcome@25
```

### Step 9: Restart Your Server
```bash
# Stop server (Ctrl+C if running)
npm run dev
```

### Step 10: Test Login
1. Go to http://localhost:3000
2. Click "Admin Login"
3. Username: `adohealthicmr`
4. Password: `Welcome@25`
5. Click "Admin Login"

## ✅ Verify Everything Works

Visit: `http://localhost:3000/api/health`

Should return:
```json
{
  "status": "healthy",
  "database": "connected",
  "adminUserExists": true,
  "totalUsers": 1
}
```

## 🆘 Troubleshooting

### "Authentication failed"
- Check your password in the connection string
- Make sure you replaced `<password>` with actual password
- Password might have special characters - try URL encoding if needed

### "IP not whitelisted"
- Go to Atlas → Network Access
- Make sure "Allow Access from Anywhere" (0.0.0.0/0) is added

### "Invalid connection string"
- Make sure `/adohealthicmr` is added before the `?`
- Check for typos in username/password
- No spaces in connection string

### Still getting errors?
Check the terminal where `npm run dev` is running - it shows the exact error!
