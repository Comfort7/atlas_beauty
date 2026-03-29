export function passwordResetEmail(resetUrl: string) {
  return {
    subject: "Reset Your Password - Atlas Beauty",
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f4f0;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px;">
          <div style="background: linear-gradient(135deg, #1a1a2e 0%, #16213e 100%); padding: 40px 30px; text-align: center;">
            <h1 style="color: #d4af37; margin: 0; font-size: 28px; letter-spacing: 2px;">ATLAS BEAUTY</h1>
          </div>
          <div style="padding: 40px 30px;">
            <h2 style="color: #1a1a2e; margin-top: 0;">Reset Your Password</h2>
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              We received a request to reset your password. Click the button below to create a new password.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${resetUrl}" style="background: #d4af37; color: #1a1a2e; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Reset Password
              </a>
            </div>
            <p style="color: #999; font-size: 13px; line-height: 1.6;">
              This link expires in 1 hour. If you didn't request a password reset, you can safely ignore this email.
            </p>
          </div>
          <div style="background: #f8f4f0; padding: 20px 30px; text-align: center; color: #999; font-size: 12px;">
            <p>&copy; ${new Date().getFullYear()} Atlas Beauty. All rights reserved.</p>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
