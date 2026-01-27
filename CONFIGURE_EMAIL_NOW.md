# Configure Email Service - Step by Step

Your `.env.local` file exists but the email service is not configured yet. Follow these steps:

## Step 1: Get Web3Forms Access Key

1. **Open your browser** and go to: https://web3forms.com

2. **Enter your email address** in the form on the homepage
   - Use the email where you want to receive OTP codes
   - Example: `your-email@gmail.com`

3. **Click "Get Your Access Key"** button

4. **Check your email inbox** for a message from Web3Forms
   - The email will contain your access key
   - It looks like: `a1b2c3d4-e5f6-7890-abcd-ef1234567890`

5. **Copy the access key** from the email

## Step 2: Update .env.local File

1. **Open `.env.local` file** in your project root directory
   - Location: `c:\Users\chaki\adohealthicmr\.env.local`

2. **Find this line:**
   ```env
   WEB3FORMS_ACCESS_KEY=your-web3forms-access-key-here
   ```

3. **Replace it with your actual access key:**
   ```env
   WEB3FORMS_ACCESS_KEY=a1b2c3d4-e5f6-7890-abcd-ef1234567890
   ```
   (Replace with YOUR actual key from Web3Forms)

4. **Save the file**

## Step 3: Restart Your Development Server

**IMPORTANT:** You must restart the server for changes to take effect!

1. **Stop the current server:**
   - Press `Ctrl + C` in the terminal where `npm run dev` is running

2. **Start it again:**
   ```bash
   npm run dev
   ```

## Step 4: Test the Email Service

1. **Go to your application** (http://localhost:3000)

2. **Try to login:**
   - Enter your username
   - Enter your email address
   - Click "Send OTP"

3. **Check your email:**
   - Look in your inbox
   - **Also check spam/junk folder** (OTP emails sometimes go there)
   - You should receive an email with subject: "Your Login OTP - AdoHealth Initiative"

4. **Use the 6-digit OTP code** from the email to login

## Verification

After configuring, when you request an OTP, you should see in the server console:
```
OTP email sent successfully to: your-email@example.com
```

Instead of:
```
=== OTP EMAIL (Email service not configured) ===
```

## Quick Checklist

- [ ] Got access key from https://web3forms.com
- [ ] Updated `.env.local` with the access key
- [ ] Saved the `.env.local` file
- [ ] Restarted the development server (`npm run dev`)
- [ ] Tested by requesting an OTP
- [ ] Checked email inbox and spam folder

## Troubleshooting

### Still seeing "Email service not configured"?
- Make sure you saved the `.env.local` file
- Make sure you restarted the server after saving
- Check that the access key doesn't have extra spaces
- Verify the key starts with letters/numbers (not "your-web3forms-access-key-here")

### Not receiving emails?
- Check spam/junk folder
- Verify the email address in your user account is correct
- Check server console for error messages
- Make sure the access key is correct

### Need to test without email?
- The OTP code will still appear in the server console
- You can use that code to login for testing

## Example .env.local File

Your `.env.local` should look like this (with your actual values):

```env
# Database Configuration
MONGODB_URI=mongodb://localhost:27017/adohealthicmr

# JWT Secret
JWT_SECRET=f025b91af8045a911411f75871a2890cd3ff021553ea8a0ceaf10bd3f9b83513

# Email Configuration (Web3Forms)
WEB3FORMS_ACCESS_KEY=YOUR_ACTUAL_KEY_HERE

# Application Configuration
NODE_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

**Replace `YOUR_ACTUAL_KEY_HERE` with the key from Web3Forms!**
