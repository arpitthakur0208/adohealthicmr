# OTP Email Not Working - Troubleshooting Guide

## Quick Diagnosis

If you're not receiving OTP emails, check these in order:

### 1. Check Server Console First

When you request an OTP, look at your server console (terminal where `npm run dev` is running). You should see one of these:

**If email service is NOT configured:**
```
=== OTP EMAIL (Email service not configured) ===
To: your-email@example.com
OTP: 123456
===============================================
⚠️  WEB3FORMS_ACCESS_KEY is not configured!
```

**If email service IS configured but failed:**
```
❌ Web3Forms API Error:
Response status: 400
Error details: {...}
```

**If email sent successfully:**
```
✅ OTP email sent successfully to: your-email@example.com
```

## Common Issues & Solutions

### Issue 1: Email Service Not Configured

**Symptom:** You see "Email service not configured" in console

**Solution:**
1. Open `.env.local` file in your project root
2. Find the line: `WEB3FORMS_ACCESS_KEY=your-web3forms-access-key-here`
3. Get your access key from https://web3forms.com:
   - Go to the website
   - Enter your email address
   - Click "Get Your Access Key"
   - Check your email for the key
4. Replace the placeholder with your actual key:
   ```env
   WEB3FORMS_ACCESS_KEY=a1b2c3d4-e5f6-7890-abcd-ef1234567890
   ```
5. **IMPORTANT:** Restart your server:
   - Press `Ctrl + C` to stop
   - Run `npm run dev` again

### Issue 2: Web3Forms Limitation

**Important Note:** Web3Forms is designed to receive form submissions, not send emails to arbitrary users. It sends emails to the address associated with your access key.

**If you need to send OTP emails to different users**, you have two options:

#### Option A: Use the OTP from Console (Development Only)
- The OTP code is always shown in the server console
- Use that code to login for testing
- This only works in development mode

#### Option B: Switch to a Proper Email Service

For production, consider using:
- **Resend** (Recommended - Free tier available)
- **SendGrid** (Free tier: 100 emails/day)
- **Nodemailer with SMTP** (Gmail, Outlook, etc.)
- **AWS SES** (Very cheap, requires AWS account)

### Issue 3: Email in Spam Folder

**Solution:**
- Check your spam/junk folder
- Mark the email as "Not Spam" if found
- Add the sender to your contacts

### Issue 4: Wrong Email Address

**Solution:**
- Verify the email address in your user account matches what you're entering
- Check for typos
- Make sure the email is lowercase (the system converts it automatically)

### Issue 5: Server Not Restarted

**Symptom:** You updated `.env.local` but still not working

**Solution:**
- Environment variables are only loaded when the server starts
- You MUST restart the server after changing `.env.local`:
  1. Stop: `Ctrl + C`
  2. Start: `npm run dev`

## Step-by-Step Fix

### Immediate Fix (Use Console OTP)

1. Request an OTP from your app
2. Check the server console for the OTP code
3. Use that code to login
4. This works for testing but not for production

### Proper Fix (Configure Email Service)

1. **Get Web3Forms Access Key:**
   - Visit: https://web3forms.com
   - Enter your email
   - Get the access key from your email

2. **Update `.env.local`:**
   ```env
   WEB3FORMS_ACCESS_KEY=your_actual_key_here
   ```

3. **Restart Server:**
   ```bash
   # Stop current server (Ctrl+C)
   npm run dev
   ```

4. **Test:**
   - Request an OTP
   - Check your email (and spam folder)
   - Check server console for success message

## Verification Checklist

- [ ] `.env.local` file exists in project root
- [ ] `WEB3FORMS_ACCESS_KEY` is set (not the placeholder)
- [ ] Server was restarted after updating `.env.local`
- [ ] Checked server console for error messages
- [ ] Checked email inbox AND spam folder
- [ ] Email address in user account is correct
- [ ] Tried using OTP from console (for testing)

## Still Not Working?

1. **Check server console** - Look for error messages
2. **Verify access key** - Make sure it's correct (no extra spaces)
3. **Test Web3Forms** - Try submitting a test form on their website
4. **Consider alternative** - Web3Forms may not work for sending to arbitrary users

## Need Help?

- Check the server console output when requesting OTP
- Share the console output for debugging
- Consider switching to Resend or another email service for production use
