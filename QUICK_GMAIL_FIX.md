# 🔧 Quick Gmail Fix

## Current Error
```
Invalid login: 535-5.7.8 Username and Password not accepted
```

This means your Gmail credentials are incorrect or not properly configured.

---

## ✅ Step-by-Step Fix

### Step 1: Enable 2-Step Verification
1. Go to: https://myaccount.google.com/security
2. Find **2-Step Verification**
3. Click **Get Started** and follow the steps
4. **This is REQUIRED** - you cannot use App Passwords without it

### Step 2: Generate App Password
1. Go to: https://myaccount.google.com/apppasswords
2. Select **Mail** from the dropdown
3. Select **Other (Custom name)**
4. Enter: `ADO Health ICMR`
5. Click **Generate**
6. **Copy the 16-character password** (it looks like: `abcd efgh ijkl mnop`)

### Step 3: Update .env.local
Open `.env.local` and update:

```env
GMAIL_USER=your-actual-email@gmail.com
GMAIL_PASS=abcdefghijklmnop
```

**Important:**
- Use your **actual Gmail address** (the one you use to login)
- Use the **App Password** (16 characters, **remove spaces**)
- Do NOT use your regular Gmail password
- Do NOT include spaces in the App Password

**Example:**
```env
GMAIL_USER=adohealthicmr2025@gmail.com
GMAIL_PASS=abcdefghijklmnop
```

### Step 4: Test Again
```bash
npm run test-email
```

You should see:
```
✅ Gmail server is ready
✅ Test email sent successfully
```

---

## 🔍 Common Mistakes

❌ **Using regular password** → Use App Password instead
❌ **Spaces in App Password** → Remove all spaces
❌ **2-Step Verification not enabled** → Enable it first
❌ **Wrong email address** → Use the exact Gmail address
❌ **App Password expired** → Generate a new one

---

## ✅ Verification Checklist

- [ ] 2-Step Verification enabled
- [ ] App Password generated (16 characters)
- [ ] `.env.local` has `GMAIL_USER` (your email)
- [ ] `.env.local` has `GMAIL_PASS` (App Password, no spaces)
- [ ] Restarted server after updating `.env.local`
- [ ] Ran `npm run test-email` successfully

---

## 🆘 Still Not Working?

1. **Double-check App Password:**
   - Go to https://myaccount.google.com/apppasswords
   - Delete old App Password
   - Generate a new one
   - Copy it carefully (no spaces)

2. **Check .env.local format:**
   ```env
   GMAIL_USER=email@gmail.com
   GMAIL_PASS=16charactersnospaces
   ```

3. **Restart everything:**
   ```bash
   # Stop server (Ctrl+C)
   npm run dev
   ```

4. **Test again:**
   ```bash
   npm run test-email
   ```

---

## 📧 Once Working

After Gmail is configured:
- OTP emails will be sent automatically
- OTP will also be logged to console (for testing)
- Users will receive OTP in their inbox
