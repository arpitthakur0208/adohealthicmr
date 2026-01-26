# Database Setup Guide

## The Problem
You're getting a 500 error because MongoDB is not connected. The `.env.local` file has been created, but you need to configure it.

## Quick Setup Options

### Option 1: MongoDB Atlas (Cloud - Easiest, Recommended)

1. **Go to MongoDB Atlas:**
   - Visit: https://www.mongodb.com/cloud/atlas/register
   - Create a free account (no credit card required)

2. **Create a Cluster:**
   - Click "Build a Database"
   - Choose "FREE" (M0) tier
   - Select a cloud provider and region
   - Click "Create"

3. **Get Connection String:**
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`)

4. **Update `.env.local`:**
   ```env
   MONGODB_URI=mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/adohealthicmr?retryWrites=true&w=majority
   JWT_SECRET=your-generated-secret-key-here
   ```

5. **Configure Network Access:**
   - In Atlas, go to "Network Access"
   - Click "Add IP Address"
   - Click "Allow Access from Anywhere" (for development)
   - Or add your specific IP

### Option 2: Local MongoDB

1. **Install MongoDB:**
   - Download from: https://www.mongodb.com/try/download/community
   - Install MongoDB Community Server
   - During installation, check "Install MongoDB as a Service"

2. **Start MongoDB Service:**
   ```powershell
   Start-Service MongoDB
   ```

3. **Update `.env.local`:**
   ```env
   MONGODB_URI=mongodb://localhost:27017/adohealthicmr
   JWT_SECRET=your-generated-secret-key-here
   ```

## After Setting Up Database

1. **Create Admin User:**
   ```bash
   npm run create-default-admin
   ```

2. **Migrate Existing Data (Optional):**
   ```bash
   npm run migrate
   ```

3. **Restart Development Server:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Test Login:**
   - Username: `adohealthicmr`
   - Password: `Welcome@25`

## Verify Setup

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

## Troubleshooting

### "Database connection failed"
- Check MongoDB is running (local) or cluster is active (Atlas)
- Verify MONGODB_URI in `.env.local` is correct
- For Atlas: Check Network Access allows your IP

### "Admin user doesn't exist"
- Run: `npm run create-default-admin`

### Still getting 500 errors?
- Check server terminal for detailed error messages
- Verify `.env.local` file exists and has correct values
- Restart development server after changing `.env.local`
