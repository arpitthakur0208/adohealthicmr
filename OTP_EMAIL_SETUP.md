# OTP Email Setup Guide

If you're not receiving OTP codes via email, follow these steps:

## Quick Fix: Check Server Console

1. **Start your development server:**
   ```bash
   npm run dev
   ```

2. **Try to login and request an OTP**

3. **Check the server console** - You should see:
   ```
   === OTP EMAIL (Email service not configured) ===
   To: your-email@example.com
   OTP: 123456
   ===============================================
   ```

   The OTP code will be displayed in the console for testing purposes.

## Setup Email Service (Web3Forms)

### Step 1: Get Web3Forms Access Key

1. Go to [https://web3forms.com](https://web3forms.com)
2. Enter your email address
3. Click "Get Your Access Key"
4. Check your email for the access key
5. Copy the access key

### Step 2: Configure Environment Variable

1. **Create or edit `.env.local` file** in the root of your project:
   ```bash
   # If file doesn't exist, create it
   touch .env.local
   ```

2. **Add the Web3Forms access key:**
   ```env
   WEB3FORMS_ACCESS_KEY=your_access_key_here
   ```

   Replace `your_access_key_here` with the actual key from Web3Forms.

3. **Make sure you also have these variables:**
   ```env
   MONGODB_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   NODE_ENV=development
   ```

### Step 3: Restart Development Server

After adding the environment variable:

```bash
# Stop the server (Ctrl+C)
# Then restart it
npm run dev
```

### Step 4: Test OTP Email

1. Try to login again
2. Enter your username and email
3. Click "Send OTP"
4. Check your email inbox (and spam folder)
5. You should receive an email with the 6-digit OTP code

## Troubleshooting

### Issue: Still not receiving emails

1. **Check spam/junk folder** - OTP emails might be filtered
2. **Verify access key** - Make sure it's correct in `.env.local`
3. **Check server console** - Look for error messages
4. **Verify email address** - Make sure the email in your user account is correct
5. **Check Web3Forms dashboard** - Log in to see if emails are being sent

### Issue: "Email service not configured" message

- This means `WEB3FORMS_ACCESS_KEY` is not set or is set to `YOUR_ACCESS_KEY_HERE`
- Follow Step 2 above to configure it

### Issue: OTP code shown in alert/console

- In development mode, if email service is not configured, the OTP will be shown in:
  - Browser console (F12 → Console tab)
  - Server console (terminal where `npm run dev` is running)
  - Alert popup (if in development mode)

### For Production Deployment

When deploying to Vercel or other platforms:

1. Go to your project settings
2. Add environment variable: `WEB3FORMS_ACCESS_KEY`
3. Set the value to your access key
4. Redeploy your application

## Alternative: Use OTP from Console (Development Only)

If you just want to test the login flow without setting up email:

1. Request an OTP
2. Check the server console (terminal) for the OTP code
3. Use that code to login

**Note:** This only works in development mode. For production, you must configure the email service.

## Need Help?

- Check server logs for detailed error messages
- Verify your `.env.local` file is in the root directory
- Make sure you restarted the server after adding environment variables
- Check Web3Forms documentation: https://docs.web3forms.com
