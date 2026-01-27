# Vercel Deployment Guide

This guide will help you deploy your AdoHealth ICMR application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. MongoDB Atlas account (for production database) or your MongoDB connection string
3. Web3Forms access key (for email functionality)

## Step 1: Prepare Your Repository

1. Make sure all your code is committed and pushed to GitHub/GitLab/Bitbucket:
   ```bash
   git add .
   git commit -m "Prepare for Vercel deployment"
   git push origin main
   ```

## Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New Project"**
3. Import your Git repository
4. Vercel will auto-detect Next.js - click **"Deploy"**

### Option B: Deploy via Vercel CLI

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Login to Vercel:
   ```bash
   vercel login
   ```

3. Deploy:
   ```bash
   vercel
   ```

4. For production deployment:
   ```bash
   vercel --prod
   ```

## Step 3: Configure Environment Variables

In your Vercel project dashboard, go to **Settings → Environment Variables** and add:

### Required Variables:

1. **MONGODB_URI**
   - Value: Your MongoDB connection string
   - Example: `mongodb+srv://username:password@cluster.mongodb.net/adohealthicmr`
   - **Important**: Use MongoDB Atlas for production (not localhost)

2. **JWT_SECRET**
   - Value: A strong random string (at least 32 characters)
   - Generate one: `openssl rand -base64 32`
   - Example: `a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6q7r8s9t0u1v2w3x4y5z6`

3. **WEB3FORMS_ACCESS_KEY** (Optional - for email functionality)
   - Value: Your Web3Forms access key
   - Get one at: https://web3forms.com

4. **NODE_ENV**
   - Value: `production`

5. **NEXT_PUBLIC_APP_URL** (Optional - for email links)
   - Value: Your Vercel deployment URL
   - Example: `https://your-app.vercel.app`

### Environment Variables Setup:

```
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/adohealthicmr
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters-long
WEB3FORMS_ACCESS_KEY=your-web3forms-access-key-here
NODE_ENV=production
NEXT_PUBLIC_APP_URL=https://your-app.vercel.app
```

## Step 4: Set Up MongoDB Atlas (If Not Already Done)

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user
4. Whitelist Vercel IPs (or use `0.0.0.0/0` for all IPs - less secure but easier)
5. Get your connection string
6. Replace `<password>` with your actual password

## Step 5: Initialize Database

After deployment, you need to initialize your database:

1. **Option A: Use Vercel CLI to run scripts**
   ```bash
   vercel env pull .env.local
   npm run create-default-admin
   ```

2. **Option B: Create admin via API** (after deployment)
   - Use the `/api/auth/register` endpoint to create an admin user
   - Or use MongoDB Compass/Atlas UI to manually create a user

## Step 6: Verify Deployment

1. Visit your Vercel deployment URL
2. Test the application:
   - Check if pages load correctly
   - Test user registration/login
   - Test admin functionality
   - Test API endpoints

## Troubleshooting

### Build Errors

If you encounter build errors:

1. Check build logs in Vercel dashboard
2. Ensure all dependencies are in `package.json`
3. Check for TypeScript errors: `npm run lint`
4. Test build locally: `npm run build`

### Database Connection Issues

1. Verify `MONGODB_URI` is correct
2. Check MongoDB Atlas network access (whitelist IPs)
3. Verify database user credentials
4. Check MongoDB Atlas cluster status

### Authentication Issues

1. Verify `JWT_SECRET` is set correctly
2. Ensure it's the same across all environments
3. Check cookie settings (should work automatically with Vercel)

### API Route Errors

1. Check Vercel function logs
2. Verify environment variables are set
3. Check MongoDB connection
4. Review API route error messages

## Post-Deployment Checklist

- [ ] Environment variables configured
- [ ] MongoDB Atlas connected
- [ ] Admin user created
- [ ] Test user registration
- [ ] Test user login
- [ ] Test admin login
- [ ] Test module CRUD operations
- [ ] Test question CRUD operations
- [ ] Test video upload
- [ ] Test answer submission
- [ ] Test email functionality (if configured)

## Custom Domain (Optional)

1. Go to **Settings → Domains** in Vercel
2. Add your custom domain
3. Follow DNS configuration instructions
4. Wait for SSL certificate (automatic)

## Continuous Deployment

Vercel automatically deploys on every push to your main branch. To disable:

1. Go to **Settings → Git**
2. Configure deployment settings

## Monitoring

- View deployment logs in Vercel dashboard
- Check function logs for API routes
- Monitor MongoDB Atlas for database performance

## Support

- Vercel Docs: https://vercel.com/docs
- Next.js Deployment: https://nextjs.org/docs/deployment
- MongoDB Atlas: https://docs.atlas.mongodb.com

---

**Note**: Make sure to keep your `.env` file local and never commit it to Git. Vercel uses environment variables from the dashboard, not from `.env` files.
