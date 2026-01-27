# 🚀 Deploy to Vercel - RIGHT NOW

Your code is pushed to GitHub! Follow these steps:

## Step 1: Go to Vercel
👉 **https://vercel.com/new**

## Step 2: Sign In
- Click "Sign in with GitHub"
- Authorize Vercel

## Step 3: Import Project
1. Click **"Add New Project"**
2. Find and select: **`arpitthakur0208/adohealthicmr`**
3. Click **"Import"**

## Step 4: Configure (IMPORTANT!)

### Before clicking "Deploy", add Environment Variables:

Click **"Environment Variables"** section and add:

1. **MONGODB_URI**
   - Value: `mongodb+srv://username:password@cluster.mongodb.net/adohealthicmr`
   - ⚠️ Must be MongoDB Atlas (cloud), NOT localhost!

2. **JWT_SECRET**
   - Generate: Open terminal and run:
     ```bash
     node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
     ```
   - Copy the output and paste as value

3. **NODE_ENV**
   - Value: `production`

4. **WEB3FORMS_ACCESS_KEY** (Optional)
   - Your Web3Forms key if you have one

5. **NEXT_PUBLIC_APP_URL**
   - Leave empty for now
   - Update after first deployment

## Step 5: Deploy!
Click **"Deploy"** button and wait 2-3 minutes.

## Step 6: After Deployment

1. Copy your Vercel URL (e.g., `https://adohealthicmr.vercel.app`)
2. Go to **Settings → Environment Variables**
3. Update `NEXT_PUBLIC_APP_URL` with your actual URL
4. Go to **Deployments** → Click **⋯** on latest → **Redeploy**

## ✅ Done!

Your app will be live at: `https://your-app.vercel.app`

---

## ⚠️ Need MongoDB Atlas?

If you don't have MongoDB Atlas:
1. Go to: https://www.mongodb.com/cloud/atlas
2. Sign up (free)
3. Create cluster
4. Network Access: Add IP `0.0.0.0/0`
5. Database Access: Create user
6. Get connection string

---

**Your repository:** https://github.com/arpitthakur0208/adohealthicmr
