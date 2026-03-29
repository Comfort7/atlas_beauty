export function shippingUpdateEmail(
  orderNumber: string,
  trackingNumber?: string | null,
  trackingUrl?: string | null
) {
  const trackingSection = trackingNumber
    ? `
      <div style="background: #f8f4f0; border-radius: 8px; padding: 20px; margin: 20px 0;">
        <p style="margin: 0; color: #1a1a2e; font-size: 14px;"><strong>Tracking Number:</strong> ${trackingNumber}</p>
        ${trackingUrl ? `<p style="margin: 8px 0 0;"><a href="${trackingUrl}" style="color: #d4af37;">Track Your Package</a></p>` : ""}
      </div>
    `
    : "";

  return {
    subject: `Your Order ${orderNumber} Has Shipped!`,
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
            <h2 style="color: #1a1a2e; margin-top: 0;">Your Order Has Shipped!</h2>
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              Great news! Your order <strong>${orderNumber}</strong> is on its way.
            </p>
            ${trackingSection}
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
