export function welcomeEmail(name: string) {
  return {
    subject: "Welcome to Atlas Beauty!",
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
            <h2 style="color: #1a1a2e; margin-top: 0;">Welcome, ${name}!</h2>
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Thank you for joining Atlas Beauty. We're thrilled to have you as part of our community.
            </p>
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Explore our curated collection of premium beauty products, from skincare essentials to luxury cosmetics.
            </p>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL}/products" style="background: #d4af37; color: #1a1a2e; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Shop Now
              </a>
            </div>
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
