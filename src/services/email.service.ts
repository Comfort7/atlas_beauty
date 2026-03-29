import { resend, EMAIL_FROM } from "@/lib/resend";
import { welcomeEmail } from "@/emails/welcome";
import { orderConfirmationEmail } from "@/emails/order-confirmation";
import { shippingUpdateEmail } from "@/emails/shipping-update";
import { passwordResetEmail } from "@/emails/password-reset";
import { lowStockAlertEmail } from "@/emails/low-stock-alert";

type ResendClient = NonNullable<typeof resend>;

async function sendIfConfigured(
  fn: (client: ResendClient) => ReturnType<ResendClient["emails"]["send"]>
) {
  if (!resend) {
    console.warn("[email] RESEND_API_KEY not set — skipping send");
    return;
  }
  await fn(resend);
}

export const emailService = {
  async sendWelcome(to: string, name: string) {
    try {
      const { subject, html } = welcomeEmail(name);
      await sendIfConfigured((r) =>
        r.emails.send({ from: EMAIL_FROM, to, subject, html })
      );
    } catch (error) {
      console.error("Failed to send welcome email:", error);
    }
  },

  async sendOrderConfirmation(to: string, orderNumber: string, total: string) {
    try {
      const { subject, html } = orderConfirmationEmail(orderNumber, total);
      await sendIfConfigured((r) =>
        r.emails.send({ from: EMAIL_FROM, to, subject, html })
      );
    } catch (error) {
      console.error("Failed to send order confirmation:", error);
    }
  },

  async sendShippingUpdate(
    to: string,
    orderNumber: string,
    trackingNumber?: string | null,
    trackingUrl?: string | null
  ) {
    try {
      const { subject, html } = shippingUpdateEmail(
        orderNumber,
        trackingNumber,
        trackingUrl
      );
      await sendIfConfigured((r) =>
        r.emails.send({ from: EMAIL_FROM, to, subject, html })
      );
    } catch (error) {
      console.error("Failed to send shipping update:", error);
    }
  },

  async sendPasswordReset(to: string, token: string) {
    try {
      const resetUrl = `${process.env.APP_URL}/reset-password?token=${token}`;
      const { subject, html } = passwordResetEmail(resetUrl);
      await sendIfConfigured((r) =>
        r.emails.send({ from: EMAIL_FROM, to, subject, html })
      );
    } catch (error) {
      console.error("Failed to send password reset:", error);
    }
  },

  async sendLowStockAlert(
    productName: string,
    variantName: string,
    quantity: number
  ) {
    try {
      const adminEmail = process.env.ADMIN_EMAIL || "admin@atlasbeauty.com";
      const { subject, html } = lowStockAlertEmail(
        productName,
        variantName,
        quantity
      );
      await sendIfConfigured((r) =>
        r.emails.send({ from: EMAIL_FROM, to: adminEmail, subject, html })
      );
    } catch (error) {
      console.error("Failed to send low stock alert:", error);
    }
  },
};
