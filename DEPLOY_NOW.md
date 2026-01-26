# 🚀 Quick Deploy to Vercel

## Fast Track (5 minutes)

### 1. Push to GitHub
```bash
git add .
git commit -m "Ready for Vercel deployment"
git push origin main
```

### 2. Deploy on Vercel
1. Go to https://vercel.com/new
2. Import your GitHub repository
3. Click **Deploy**

### 3. Add Environment Variables
In Vercel Dashboard → Settings → Environment Variables, add:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adohealthicmr
JWT_SECRET=generate-a-random-32-character-string-here
NODE_ENV=production
```

**Generate JWT_SECRET:**
```bash
# On Mac/Linux:
openssl rand -base64 32

# On Windows (PowerShell):
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 32 | % {[char]$_})
```

### 4. Redeploy
After adding environment variables, go to **Deployments** → Click **⋯** → **Redeploy**

### 5. Create Admin User
After deployment, visit: `https://your-app.vercel.app/api/auth/register`

Or use MongoDB Atlas UI to create a user with role: "admin"

---

## ✅ That's it! Your app is live!

For detailed instructions, see `VERCEL_DEPLOYMENT.md`
