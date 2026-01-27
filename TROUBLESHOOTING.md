# Troubleshooting Login 500 Errors

## Common Issues and Solutions

### 1. Database Connection Error

**Symptoms:**
- 500 Internal Server Error on `/api/auth/login`
- 500 Internal Server Error on `/api/auth/me`
- Console shows database connection errors

**Solutions:**

#### Check MongoDB is Running
```bash
# Windows - Check if MongoDB service is running
Get-Service MongoDB

# Start MongoDB if not running
Start-Service MongoDB
```

#### Verify Environment Variables
Check your `.env.local` file has:
```env
MONGODB_URI=mongodb://localhost:27017/adohealthicmr
# OR for MongoDB Atlas:
# MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adohealthicmr
```

#### Test Database Connection
```bash
# Try connecting manually
mongosh mongodb://localhost:27017/adohealthicmr
```

### 2. Admin User Doesn't Exist

**Symptoms:**
- Login fails with "Invalid credentials"
- User not found errors

**Solution:**
Create the default admin user:
```bash
npm run create-default-admin
```

Then login with:
- Username: `adohealthicmr`
- Password: `Welcome@25`

### 3. JWT Token Generation Error

**Symptoms:**
- 500 error specifically during token generation
- "Token generation failed" error message

**Solutions:**

#### Check JWT_SECRET is Set
In `.env.local`:
```env
JWT_SECRET=your-strong-secret-key-here
```

Generate a secure secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

#### Verify jsonwebtoken Package
```bash
npm list jsonwebtoken
# Should show: jsonwebtoken@9.0.2
```

If missing:
```bash
npm install jsonwebtoken
```

### 4. Module Import Errors

**Symptoms:**
- "Module not found" errors
- Build failures

**Solutions:**

#### Clear Build Cache
```bash
# Windows PowerShell
Remove-Item -Recurse -Force .next
Remove-Item -Recurse -Force node_modules\.cache
```

#### Reinstall Dependencies
```bash
npm install
```

#### Restart Development Server
```bash
# Stop the server (Ctrl+C)
# Then restart
npm run dev
```

### 5. Check Server Logs

Look at your terminal/console where `npm run dev` is running. The actual error message will be logged there.

Common error messages:
- `MongoServerError: connect ECONNREFUSED` - MongoDB not running
- `MongooseError: Operation users.findOne() buffering timed out` - Database connection timeout
- `TypeError: Cannot read property 'sign' of undefined` - jsonwebtoken import issue

## Quick Diagnostic Steps

1. **Check MongoDB:**
   ```bash
   # Test connection
   mongosh mongodb://localhost:27017/adohealthicmr
   ```

2. **Check Environment:**
   ```bash
   # Verify .env.local exists and has correct values
   cat .env.local
   ```

3. **Check Admin User:**
   ```bash
   # Create admin user
   npm run create-default-admin
   ```

4. **Check Dependencies:**
   ```bash
   npm install
   ```

5. **Clear Cache and Restart:**
   ```bash
   Remove-Item -Recurse -Force .next
   npm run dev
   ```

## Still Having Issues?

1. Check the terminal where `npm run dev` is running for detailed error messages
2. Check browser console for client-side errors
3. Verify MongoDB is accessible
4. Ensure all environment variables are set correctly
5. Try creating a new user via the register endpoint to test if the issue is specific to the admin user
