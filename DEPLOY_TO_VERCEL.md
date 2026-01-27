# 🚀 Deploy ADO Health ICMR to Vercel

This guide will help you deploy your Next.js application to Vercel.

## ✅ Prerequisites

1. **Vercel Account**: Sign up at [vercel.com](https://vercel.com) (free tier available)
2. **MongoDB Atlas Account**: For production database (or use your existing MongoDB)
3. **GitHub Account**: (Optional but recommended) For automatic deployments

## 📋 Pre-Deployment Checklist

- ✅ Build passes successfully (`npm run build`)
- ✅ All environment variables documented
- ✅ MongoDB connection string ready
- ✅ JWT secret generated
- ✅ Email service configured (if using)

## 🔧 Step 1: Prepare Your Repository

1. **Commit all changes**:
   ```bash
   git add .
   git commit -m "Ready for Vercel deployment"
   git push origin main
   ```

2. **Verify your `.gitignore`** includes:
   - `.env.local`
   - `.env`
   - `node_modules/`
   - `.next/`

## 🌐 Step 2: Deploy to Vercel

### Option A: Deploy via Vercel Dashboard (Recommended)

1. **Go to [vercel.com](https://vercel.com)** and sign in
2. **Click "Add New Project"**
3. **Import your Git repository**:
   - Connect your GitHub/GitLab/Bitbucket account
   - Select the `adohealthicmr` repository
   - Click "Import"

4. **Configure Project Settings**:
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (default)
   - **Build Command**: `npm run build` (default)
   - **Output Directory**: `.next` (default)
   - **Install Command**: `npm install` (default)

5. **Add Environment Variables**:
   Click "Environment Variables" and add:

   ```
   MONGODB_URI=your-mongodb-connection-string
   JWT_SECRET=your-super-secret-jwt-key-min-32-characters
   NODE_ENV=production
   NEXT_PUBLIC_APP_URL=https://your-app-name.vercel.app
   WEB3FORMS_ACCESS_KEY=your-web3forms-key (optional)
   ```

   **Important**: 
   - Replace `your-mongodb-connection-string` with your MongoDB Atlas connection string
   - Generate a strong JWT_SECRET (at least 32 characters)
   - Update `NEXT_PUBLIC_APP_URL` after first deployment with your actual Vercel URL

6. **Click "Deploy"**

### Option B: Deploy via Vercel CLI

1. **Install Vercel CLI**:
   ```bash
   npm i -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Deploy**:
   ```bash
   vercel
   ```

4. **Follow the prompts**:
   - Link to existing project or create new
   - Confirm settings
   - Add environment variables when prompted

5. **Deploy to production**:
   ```bash
   vercel --prod
   ```

## 🔐 Step 3: Configure Environment Variables

### Required Environment Variables

Add these in Vercel Dashboard → Project Settings → Environment Variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `MONGODB_URI` | MongoDB connection string | `mongodb+srv://user:pass@cluster.mongodb.net/adohealthicmr` |
| `JWT_SECRET` | Secret for JWT tokens | `your-super-secret-key-min-32-chars` |
| `NODE_ENV` | Environment mode | `production` |
| `NEXT_PUBLIC_APP_URL` | Your Vercel app URL | `https://adohealthicmr.vercel.app` |

### Optional Environment Variables

| Variable | Description | Example |
|----------|-------------|---------|
| `WEB3FORMS_ACCESS_KEY` | For email functionality | `your-web3forms-key` |

### Generate JWT Secret

You can generate a secure JWT secret using:

```bash
node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"
```

Or use an online generator: [randomkeygen.com](https://randomkeygen.com/)

## 🗄️ Step 4: Set Up MongoDB Atlas (If Not Already Done)

1. **Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)**
2. **Create a free cluster** (if you don't have one)
3. **Create a database user**:
   - Database Access → Add New Database User
   - Username and password
   - Save credentials securely

4. **Whitelist IP addresses**:
   - Network Access → Add IP Address
   - For Vercel, add `0.0.0.0/0` (allows all IPs) or use Vercel's IP ranges

5. **Get connection string**:
   - Clusters → Connect → Connect your application
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Replace `<dbname>` with `adohealthicmr`

   Example:
   ```
   mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/adohealthicmr?retryWrites=true&w=majority
   ```

## 🚀 Step 5: Verify Deployment

1. **Wait for deployment to complete** (usually 2-5 minutes)
2. **Visit your Vercel URL**: `https://your-app-name.vercel.app`
3. **Test the application**:
   - Visit the home page
   - Test API endpoints: `https://your-app-name.vercel.app/api/health`
   - Try registering a new user
   - Test login functionality

## 🔄 Step 6: Set Up Automatic Deployments

Vercel automatically deploys when you push to your main branch:

1. **Push to main branch**:
   ```bash
   git push origin main
   ```

2. **Vercel will automatically**:
   - Detect the push
   - Run `npm install`
   - Run `npm run build`
   - Deploy the new version

3. **Preview deployments** are created for pull requests automatically

## 📝 Step 7: Post-Deployment Tasks

### Create Admin User

After deployment, you'll need to create an admin user. You can do this by:

1. **Using the API** (if you have a script):
   ```bash
   # Set environment variables locally
   export MONGODB_URI="your-connection-string"
   export JWT_SECRET="your-secret"
   
   # Run the create-admin script
   npm run create-admin
   ```

2. **Or register via the UI** and manually update the role in MongoDB

### Verify Database Connection

1. Visit: `https://your-app-name.vercel.app/api/health`
2. Should return:
   ```json
   {
     "status": "healthy",
     "database": "connected",
     "adminUserExists": true,
     "totalUsers": 1,
     "timestamp": "..."
   }
   ```

## 🛠️ Troubleshooting

### Build Fails

- **Check build logs** in Vercel dashboard
- **Verify environment variables** are set correctly
- **Ensure MongoDB URI** is correct and accessible
- **Check Node.js version** (should be 18.x or 20.x)

### Database Connection Errors

- **Verify MongoDB Atlas**:
  - IP whitelist includes `0.0.0.0/0` or Vercel IPs
  - Database user has correct permissions
  - Connection string is correct

- **Check environment variables**:
  - `MONGODB_URI` is set correctly
  - No extra spaces or quotes

### API Routes Not Working

- **Verify `NEXT_PUBLIC_APP_URL`** matches your Vercel URL
- **Check API route logs** in Vercel dashboard
- **Ensure all API routes have** `export const dynamic = 'force-dynamic'`

### Authentication Issues

- **Verify `JWT_SECRET`** is set and is at least 32 characters
- **Check cookie settings** (should work automatically in production)
- **Clear browser cookies** and try again

## 📊 Monitoring

- **Vercel Dashboard**: View deployments, logs, and analytics
- **Function Logs**: Check API route execution logs
- **Analytics**: View page views and performance metrics

## 🔒 Security Best Practices

1. **Never commit** `.env.local` or `.env` files
2. **Use strong JWT secrets** (32+ characters, random)
3. **Keep MongoDB credentials secure**
4. **Enable MongoDB Atlas** IP whitelisting
5. **Use HTTPS** (automatic with Vercel)
6. **Regularly update dependencies**: `npm audit fix`

## 📚 Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [MongoDB Atlas Setup](https://www.mongodb.com/docs/atlas/getting-started/)
- [Environment Variables Guide](https://vercel.com/docs/concepts/projects/environment-variables)

## ✅ Deployment Checklist

- [ ] Repository pushed to GitHub/GitLab
- [ ] Vercel project created
- [ ] Environment variables configured
- [ ] MongoDB Atlas cluster set up
- [ ] IP addresses whitelisted
- [ ] Build successful
- [ ] Application accessible
- [ ] Health check endpoint working
- [ ] Admin user created
- [ ] Test registration/login
- [ ] Test API endpoints

## 🎉 Success!

Your application should now be live on Vercel! 

**Your app URL**: `https://your-app-name.vercel.app`

For any issues, check the Vercel dashboard logs or refer to the troubleshooting section above.
