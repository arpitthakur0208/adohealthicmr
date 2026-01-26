# ADO Health ICMR

This is a [Next.js](https://nextjs.org/) project bootstrapped with TypeScript, Tailwind CSS, and ESLint.

## Getting Started

First, install the dependencies:

```bash
npm install
# or
yarn install
# or
pnpm install
```

Then, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `src/app/page.tsx`. The page auto-updates as you edit the file.

## Project Structure

- `src/app/` - App Router directory containing pages and layouts
- `src/components/` - React components (create as needed)
- `public/` - Static assets

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## Backend Setup

This project uses MongoDB as the database and includes a complete backend API with authentication.

### Prerequisites

1. **MongoDB**: Install MongoDB locally or use [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) (cloud)
   - Local: Download from [mongodb.com](https://www.mongodb.com/try/download/community)
   - Cloud: Create a free account at MongoDB Atlas

### Environment Configuration

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Update `.env.local` with your configuration:
   ```env
   # Database Configuration
   MONGODB_URI=mongodb://localhost:27017/adohealthicmr
   # For MongoDB Atlas: mongodb+srv://username:password@cluster.mongodb.net/adohealthicmr

   # JWT Secret (generate a random string)
   JWT_SECRET=your-super-secret-jwt-key-change-this-in-production

   # Email Configuration
   WEB3FORMS_ACCESS_KEY=your-web3forms-access-key-here

   # Application Configuration
   NODE_ENV=development
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

### Database Migration

After setting up MongoDB, migrate your existing data:

```bash
npm run migrate
```

This will import all modules and questions from `data/app-data.json` into MongoDB.

### Create Admin User

Create an admin user for managing content:

```bash
npm run create-admin
```

Follow the prompts to create your admin account.

### API Endpoints

#### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login user
- `POST /api/auth/logout` - Logout user
- `GET /api/auth/me` - Get current user info

#### Modules (Admin only for POST/PUT/DELETE)
- `GET /api/modules` - Get all modules
- `POST /api/modules` - Create a module (Admin)
- `GET /api/modules/[id]` - Get single module
- `PUT /api/modules/[id]` - Update module (Admin)
- `DELETE /api/modules/[id]` - Delete module (Admin)

#### Questions (Admin only for POST/PUT/DELETE)
- `GET /api/questions` - Get all questions (optional: `?moduleId=1`)
- `POST /api/questions` - Create a question (Admin)

#### Answers
- `GET /api/answers` - Get user's answers (optional: `?moduleId=1`)
- `POST /api/answers` - Submit an answer

#### Legacy Routes (for backward compatibility)
- `GET /api/data/load` - Load all data (modules + questions)
- `POST /api/data/save` - Save data (Admin only)

## Email Configuration

To enable email sending for form submissions:

1. Go to [Web3Forms](https://web3forms.com) and get your free access key
2. Add it to your `.env.local` file:
   ```
   WEB3FORMS_ACCESS_KEY=your_access_key_here
   ```
3. Restart your development server

The form will send answers to `adohealthicmr2025@gmail.com` when submitted.

## 🚀 Deploy on Vercel

### Quick Deploy (5 minutes)

See **[DEPLOY_NOW.md](./DEPLOY_NOW.md)** for the fastest deployment guide.

### Detailed Deployment Guide

See **[VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md)** for complete step-by-step instructions.

### Quick Steps:

1. **Push to GitHub:**
   ```bash
   git add .
   git commit -m "Ready for deployment"
   git push origin main
   ```

2. **Deploy on Vercel:**
   - Go to [vercel.com/new](https://vercel.com/new)
   - Import your GitHub repository
   - Click **Deploy**

3. **Add Environment Variables** in Vercel Dashboard:
   - `MONGODB_URI` - Your MongoDB Atlas connection string
   - `JWT_SECRET` - A random 32+ character string
   - `NODE_ENV` - Set to `production`
   - `WEB3FORMS_ACCESS_KEY` - (Optional) For email functionality

4. **Redeploy** after adding environment variables

5. **Create Admin User** via API or MongoDB Atlas UI

**Important:** Use MongoDB Atlas (cloud) for production, not localhost!

For detailed instructions, troubleshooting, and post-deployment checklist, see [VERCEL_DEPLOYMENT.md](./VERCEL_DEPLOYMENT.md).
