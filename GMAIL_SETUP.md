# 📧 Gmail OTP Setup Guide

## Quick Setup for Gmail OTP

### Step 1: Enable 2-Step Verification
1. Go to https://myaccount.google.com/security
2. Enable **2-Step Verification** (if not already enabled)

### Step 2: Generate App Password
1. Go to https://myaccount.google.com/apppasswords
2. Select **Mail** as the app
3. Select **Other (Custom name)** as the device
4. Enter name: `ADO Health ICMR`
5. Click **Generate**
6. Copy the 16-character password (no spaces)

### Step 3: Update .env.local
Add these lines to your `.env.local` file:

```env
GMAIL_USER=your-email@gmail.com
GMAIL_PASS=your-16-character-app-password
```

**Example:**
```env
GMAIL_USER=adohealthicmr2025@gmail.com
GMAIL_PASS=abcd efgh ijkl mnop
```

**Important:** Remove spaces from the app password when pasting!

### Step 4: Restart Server
After updating `.env.local`, restart your development server:
```bash
# Stop server (Ctrl+C)
npm run dev
```

---

## ✅ Verification

After setup, when you request an OTP:
- ✅ OTP will be sent to the user's email via Gmail
- ✅ OTP will also be logged to server console (for testing)
- ✅ OTP expires in 10 minutes

---

## 🔍 Troubleshooting

### "Invalid login" error
- Make sure you're using an **App Password**, not your regular Gmail password
- Verify 2-Step Verification is enabled
- Check that there are no spaces in the app password

### "Connection timeout" error
- Check your internet connection
- Verify Gmail credentials are correct
- Try generating a new app password

### OTP not received
- Check spam folder
- Verify email address is correct
- Check server console for OTP (it's always logged there)
- Verify Gmail credentials in `.env.local`

---

## 📝 Notes

- **App Password** is different from your regular Gmail password
- App Password is 16 characters (may have spaces - remove them)
- OTP is always logged to server console for testing
- OTP expires in 10 minutes for security
