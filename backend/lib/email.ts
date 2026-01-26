/**
 * Email service utility for sending OTP emails
 */

export interface SendOTPEmailParams {
  to: string;
  otp: string;
}

/**
 * Send OTP email using Web3Forms service
 */
export async function sendOTPEmail({ to, otp }: SendOTPEmailParams): Promise<boolean> {
  try {
    const web3formsAccessKey = process.env.WEB3FORMS_ACCESS_KEY;

    if (!web3formsAccessKey || web3formsAccessKey === 'YOUR_ACCESS_KEY_HERE' || web3formsAccessKey === 'your-web3forms-access-key-here') {
      // In development, log the OTP instead of sending email
      console.log('\n=== OTP EMAIL (Email service not configured) ===');
      console.log('To:', to);
      console.log('OTP:', otp);
      console.log('===============================================');
      console.log('⚠️  WEB3FORMS_ACCESS_KEY is not configured!');
      console.log('📧 To fix: Get your access key from https://web3forms.com');
      console.log('📝 Then update .env.local: WEB3FORMS_ACCESS_KEY=your_actual_key');
      console.log('🔄 Then restart your server (npm run dev)\n');
      return true; // Return true for development/testing
    }

    const subject = 'Your Login OTP - AdoHealth Initiative';
    const message = `Your One-Time Password (OTP) for login is: ${otp}\n\nThis OTP will expire in 10 minutes.\n\nIf you did not request this OTP, please ignore this email.`;
    const htmlBody = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #333;">AdoHealth Initiative - Login OTP</h2>
        <p>Your One-Time Password (OTP) for login is:</p>
        <div style="background-color: #f4f4f4; padding: 20px; text-align: center; margin: 20px 0; border-radius: 5px;">
          <h1 style="color: #007bff; font-size: 32px; margin: 0; letter-spacing: 5px;">${otp}</h1>
        </div>
        <p>This OTP will expire in <strong>10 minutes</strong>.</p>
        <p style="color: #666; font-size: 12px;">If you did not request this OTP, please ignore this email.</p>
      </div>
    `;

    const response = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        access_key: web3formsAccessKey,
        subject: subject,
        from_name: 'AdoHealth Initiative',
        email: to,
        message: message,
        html: htmlBody,
      }),
    });

    const result = await response.json();
    
    if (!result.success) {
      console.error('\n❌ Web3Forms API Error:');
      console.error('Response status:', response.status);
      console.error('Error details:', JSON.stringify(result, null, 2));
      console.error('\n⚠️  Note: Web3Forms sends emails to the address associated with your access key.');
      console.error('   It may not send emails to arbitrary recipients. Consider using a proper email service.\n');
      
      // Log OTP for manual use
      console.log('=== OTP CODE (Email failed - use this for testing) ===');
      console.log('To:', to);
      console.log('OTP:', otp);
      console.log('===================================================\n');
    } else {
      console.log('✅ OTP email sent successfully to:', to);
    }
    
    return result.success === true;
  } catch (error) {
    console.error('\n❌ Error sending OTP email:', error);
    // In development, still return true if email service fails
    if (process.env.NODE_ENV === 'development') {
      console.log('\n=== OTP EMAIL (Fallback - Email service error) ===');
      console.log('To:', to);
      console.log('OTP:', otp);
      console.log('===============================================');
      console.log('⚠️  Email service encountered an error.');
      console.log('📧 Check your WEB3FORMS_ACCESS_KEY configuration.\n');
      return true;
    }
    return false;
  }
}
