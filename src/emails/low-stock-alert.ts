export function lowStockAlertEmail(
  productName: string,
  variantName: string,
  quantity: number
) {
  return {
    subject: `Low Stock Alert: ${productName} - ${variantName}`,
    html: `
      <!DOCTYPE html>
      <html>
      <head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
      <body style="font-family: 'Helvetica Neue', Arial, sans-serif; margin: 0; padding: 0; background-color: #f8f4f0;">
        <div style="max-width: 600px; margin: 0 auto; background: #ffffff; border-radius: 8px; overflow: hidden; margin-top: 20px;">
          <div style="background: #dc3545; padding: 30px; text-align: center;">
            <h1 style="color: #fff; margin: 0; font-size: 24px;">LOW STOCK ALERT</h1>
          </div>
          <div style="padding: 40px 30px;">
            <p style="color: #555; line-height: 1.6; font-size: 16px;">
              The following product variant is running low on stock:
            </p>
            <div style="background: #fff3cd; border: 1px solid #ffc107; border-radius: 8px; padding: 20px; margin: 20px 0;">
              <p style="margin: 0; color: #1a1a2e; font-size: 16px;"><strong>Product:</strong> ${productName}</p>
              <p style="margin: 8px 0 0; color: #1a1a2e; font-size: 16px;"><strong>Variant:</strong> ${variantName}</p>
              <p style="margin: 8px 0 0; color: #dc3545; font-size: 18px; font-weight: bold;">Remaining: ${quantity} units</p>
            </div>
            <div style="text-align: center; margin: 30px 0;">
              <a href="${process.env.APP_URL}/admin/inventory" style="background: #1a1a2e; color: #d4af37; padding: 14px 32px; text-decoration: none; border-radius: 4px; font-weight: bold; display: inline-block;">
                Manage Inventory
              </a>
            </div>
          </div>
        </div>
      </body>
      </html>
    `,
  };
}
