# Quick Fix for Login 500 Errors

## Immediate Steps to Fix

### Step 1: Check MongoDB Connection

Open your browser and go to:
```
http://localhost:3000/api/health
```

This will show you:
- Database connection status
- Whether admin user exists
- Total users in database

### Step 2: If Database is Not Connected

**Option A: Start Local MongoDB**
```powershell
# Check if MongoDB service exists
Get-Service MongoDB

# If it exists, start it
Start-Service MongoDB

# If service doesn't exist, MongoDB might not be installed
# Download from: https://www.mongodb.com/try/download/community
```

**Option B: Use MongoDB Atlas (Cloud)**
1. Go to https://www.mongodb.com/cloud/atlas
2. Create free account
3. Create cluster
4. Get connection string
5. Update `.env.local`:
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adohealthicmr
   ```

### Step 3: Create Admin User

Once database is connected, create the admin user:

```bash
npm run create-default-admin
```

Expected output:
```
✅ Connected to database
✅ Default admin user created successfully!
   Username: adohealthicmr
   Email: admin@adohealthicmr.com
   Role: admin
   Password: Welcome@25
```

### Step 4: Verify Environment Variables

Check `.env.local` file exists and has:

```env
MONGODB_URI=mongodb://localhost:27017/adohealthicmr
JWT_SECRET=your-secret-key-here
```

If `JWT_SECRET` is missing, generate one:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### Step 5: Restart Development Server

```bash
# Stop server (Ctrl+C)
# Clear cache
Remove-Item -Recurse -Force .next

# Restart
npm run dev
```

### Step 6: Test Login

1. Go to http://localhost:3000
2. Click "Admin Login"
3. Enter:
   - Username: `adohealthicmr`
   - Password: `Welcome@25`
4. Click "Admin Login"

## Common Error Messages

### "Database connection failed"
- **Cause:** MongoDB not running or wrong connection string
- **Fix:** Start MongoDB or check `.env.local` MONGODB_URI

### "Invalid credentials"
- **Cause:** Admin user doesn't exist
- **Fix:** Run `npm run create-default-admin`

### "Token generation failed"
- **Cause:** JWT_SECRET not set
- **Fix:** Add JWT_SECRET to `.env.local`

### "Module not found: jsonwebtoken"
- **Cause:** Package not installed
- **Fix:** Run `npm install`

## Still Not Working?

1. **Check server terminal** - The actual error will be logged there
2. **Check browser console** - Look for network errors
3. **Test health endpoint** - `http://localhost:3000/api/health`
4. **Verify MongoDB** - Try connecting with `mongosh`

## Quick Test Commands

```bash
# Test database connection
npm run create-default-admin

# Check health
curl http://localhost:3000/api/health

# Test login (after creating user)
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"adohealthicmr","password":"Welcome@25"}'
```
