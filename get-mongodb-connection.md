# 🔗 How to Get Your MongoDB Atlas Connection String

## The Problem
Your connection string has placeholder values like `cluster0.xxxxx.mongodb.net` which won't work. You need your **actual** cluster address.

## ✅ Step-by-Step Guide

### Step 1: Login to MongoDB Atlas
1. Go to https://cloud.mongodb.com/
2. Login with your MongoDB Atlas account

### Step 2: Get Your Connection String
1. In the left sidebar, click **"Clusters"** (or "Database" → "Clusters")
2. You should see your cluster (usually named "Cluster0")
3. Click the **"Connect"** button on your cluster

### Step 3: Choose Connection Method
1. A popup will appear with connection options
2. Click **"Connect your application"**

### Step 4: Copy Connection String
1. You'll see a connection string that looks like:
   ```
   mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority
   ```
   **Note:** The `cluster0.abc123.mongodb.net` part will have REAL characters, not `xxxxx`

2. Click the **copy icon** to copy the connection string

### Step 5: Replace Placeholders
The connection string has placeholders that need to be replaced:

**Replace:**
- `<username>` → Your database username (the one you created in Database Access)
- `<password>` → Your database password
- `?retryWrites=true&w=majority` → Add `/adohealthicmr?retryWrites=true&w=majority`

**Example:**
```
Original: mongodb+srv://<username>:<password>@cluster0.abc123.mongodb.net/?retryWrites=true&w=majority

After replacement: mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/adohealthicmr?retryWrites=true&w=majority
```

### Step 6: Update .env.local
1. Open `.env.local` file
2. Find the line: `MONGODB_URI=...`
3. Replace it with your complete connection string:
   ```env
   MONGODB_URI=mongodb+srv://myuser:mypassword123@cluster0.abc123.mongodb.net/adohealthicmr?retryWrites=true&w=majority
   ```
4. Save the file

### Step 7: Test Connection
```bash
npm run test-db
```

---

## 🆘 If SRV Connection Doesn't Work

Some networks/firewalls block SRV queries. Use **non-SRV connection** instead:

### Get Non-SRV Connection String:
1. In MongoDB Atlas, go to **Clusters** → **Connect**
2. Click **"Drivers"** tab (instead of "Connect your application")
3. Select **"Standard connection string"** (not SRV)
4. Copy the connection string
5. Replace `<password>` and add database name
6. Update `.env.local`

**Example non-SRV:**
```
mongodb://myuser:mypassword123@cluster0-shard-00-00.abc123.mongodb.net:27017,cluster0-shard-00-01.abc123.mongodb.net:27017,cluster0-shard-00-02.abc123.mongodb.net:27017/adohealthicmr?ssl=true&replicaSet=atlas-xxxxx-shard-0&authSource=admin&retryWrites=true&w=majority
```

---

## ✅ Quick Checklist

- [ ] Logged into MongoDB Atlas
- [ ] Created database user (Database Access)
- [ ] Whitelisted IP address (Network Access → Add IP)
- [ ] Got connection string from Clusters → Connect
- [ ] Replaced `<username>` with actual username
- [ ] Replaced `<password>` with actual password
- [ ] Added `/adohealthicmr` before the `?` in connection string
- [ ] Updated `.env.local` file
- [ ] Tested with `npm run test-db`

---

## 🚀 Or Use Interactive Setup

Run this command for step-by-step interactive setup:
```bash
npm run setup-mongodb
```

This will guide you through the process!
