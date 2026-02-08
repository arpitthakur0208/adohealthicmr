# Complete Setup Guide - ADO Health ICMR

## ✅ What's Already Done (in code)

- ✅ **Postgres support** → Uses `DATABASE_URL` env var when set, falls back to JSON
- ✅ **Migration script** → `npm run migrate-pg` to import JSON data to Postgres
- ✅ **SendGrid emails** → Answer submissions email to `adohealthicr2025@gmail.com`
- ✅ **GitHub Actions** → Auto-deploy to Vercel on push to `main`

---

## 🚀 Step-by-Step Setup

### Phase 1: Local Development (.env.local)

Create `.env.local` in the root directory:

```env
# Database (optional - if using Postgres in dev)
DATABASE_URL=postgresql://user:password@localhost:5432/adohealthicmr

# Email (SendGrid)
SENDGRID_API_KEY=YOUR_SENDGRID_API_KEY
SENDGRID_FROM_EMAIL=noreply@yourdomain.com

# Authentication
JWT_SECRET=your-jwt-secret-here
```

**Get SendGrid API Key** (takes 2 min):
1. Go to https://sendgrid.com/free
2. Sign up or log in
3. **Settings → Email API → API Keys**
4. Click **Create API Key**
5. Name: `ADO Health ICMR`
6. Select **Restricted Access** → Enable **Mail Send**
7. Click **Create & Close**
8. **Copy the key immediately** (shown only once)

---

### Phase 2: Vercel Setup (Production)

#### Step 1: Add Environment Variables

1. Go to https://vercel.com → Your Project
2. Click **Settings** (top menu)
3. Left sidebar → **Environment Variables**
4. Add these variables:

```
SENDGRID_API_KEY = <YOUR_API_KEY_FROM_STEP_1>
SENDGRID_FROM_EMAIL = noreply@yourdomain.com
DATABASE_URL = <YOUR_POSTGRES_CONNECTION_STRING> (optional, for production DB)
JWT_SECRET = <SAME_AS_LOCAL>
```

5. Click **Save**

#### Step 2: Add GitHub Secret (for CI/CD)

1. Go to your GitHub repo: https://github.com/arpitthakur0208/adohealthicmr
2. **Settings → Secrets and variables → Actions**
3. Click **New repository secret**
4. Name: `VERCEL_TOKEN`
5. Value: [Get from https://vercel.com/account/tokens](https://vercel.com/account/tokens)
   - Click **Create**
   - Name: `GitHub Actions`
   - Copy the token
6. Paste in GitHub and **Add secret**

#### Step 3: Redeploy

Option A (Automatic):
```bash
git push origin main
```
The GitHub Actions workflow will run and deploy automatically.

Option B (Manual):
1. In Vercel dashboard, click **Redeploy** on the latest deployment

---

### Phase 3: Verify Everything

#### Test 1: Postgres Migration (if using Postgres)

```bash
# Set DATABASE_URL in terminal (one-time, for this session)
$env:DATABASE_URL = "YOUR_POSTGRES_URL"

# Run migration
npm run migrate-pg
```

#### Test 2: Answer Email Notification

1. Start the app: `npm run dev`
2. Log in as a user
3. Submit an answer to a question
4. Check **two places** for confirmation:
   - ✅ **Browser**: "Your answers have been saved..." message
   - ✅ **Email**: Check `adohealthicr2025@gmail.com` for notification email

#### Test 3: Vercel Deployment

1. Make a small change and push:
   ```bash
   git commit --allow-empty -m "chore: trigger vercel deploy"
   git push origin main
   ```
2. Go to https://github.com/arpitthakur0208/adohealthicmr/actions
3. Watch the workflow run (should deploy automatically)
4. Visit your Vercel app URL and test

---

## 📋 Checklist

- [ ] Created SendGrid account & got API key
- [ ] Added `.env.local` with `SENDGRID_API_KEY`
- [ ] Added Vercel environment variables (`SENDGRID_API_KEY`, `SENDGRID_FROM_EMAIL`)
- [ ] Added `VERCEL_TOKEN` to GitHub Secrets
- [ ] Tested locally: Submit answer → Check email
- [ ] Pushed to main (GitHub Actions should deploy)
- [ ] Tested on Vercel: Submit answer → Check email

---

## 🆘 Troubleshooting

| Issue | Solution |
|-------|----------|
| "Email notification could not be sent" | Check `SENDGRID_API_KEY` in Vercel environment variables |
| GitHub Actions failing | Verify `VERCEL_TOKEN` is in GitHub Secrets |
| No email received | Check spam folder; verify recipient is `adohealthicr2025@gmail.com` |
| Postgres not working | Ensure `DATABASE_URL` is correct; run migration script |

---

## 📚 Useful Commands

```bash
# Local development
npm run dev

# Migrate data to Postgres
npm run migrate-pg

# Build for production
npm build

# Test migrations (requires DATABASE_URL set)
npm run migrate-pg
```

---

**All code is ready. Now just set up the env vars and deploy!** 🎉
