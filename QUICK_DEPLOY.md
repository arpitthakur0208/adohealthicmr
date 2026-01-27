# 🚀 Quick Deploy to Vercel

Your code has been pushed to GitHub! Now deploy to Vercel using one of these methods:

## Method 1: Vercel Dashboard (Easiest - Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in (or create account)

2. **Click "Add New Project"**

3. **Import your repository**:
   - Connect GitHub if not already connected
   - Select `arpitthakur0208/adohealthicmr`
   - Click "Import"

4. **Configure Project**:
   - Framework: Next.js (auto-detected)
   - Root Directory: `./` (default)
   - Build Command: `npm run build` (default)
   - Output Directory: `.next` (default)

5. **Add Environment Variables** (Click "Environment Variables"):
   ```
   MONGODB_URI=your-mongodb-atlas-connection-string
   JWT_SECRET=generate-a-random-32-character-string
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   WEB3FORMS_ACCESS_KEY=your-web3forms-key (optional)
   ```

6. **Click "Deploy"**

7. **After deployment**, update `NEXT_PUBLIC_APP_URL` with your actual Vercel URL

## Method 2: Vercel CLI

1. **Login to Vercel**:
   ```bash
   vercel login
   ```
   (This will open a browser for authentication)

2. **Deploy to production**:
   ```bash
   vercel --prod
   ```

3. **Add environment variables** when prompted, or add them later in Vercel dashboard

## 🔐 Required Environment Variables

### Generate JWT Secret:
```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

### MongoDB Atlas Setup:
1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create/get your cluster
3. Database Access → Create user
4. Network Access → Add IP `0.0.0.0/0` (allows all IPs)
5. Clusters → Connect → Get connection string
6. Replace `<password>` and `<dbname>` with your values

## ✅ After Deployment

1. Visit your app: `https://your-app-name.vercel.app`
2. Test health endpoint: `https://your-app-name.vercel.app/api/health`
3. Create admin user (use scripts or register via UI)

## 🎉 Your app will be live!

For detailed instructions, see `DEPLOY_TO_VERCEL.md`
