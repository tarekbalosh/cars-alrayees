// Stripe infrastructure - ready for future implementation
// Payment confirmation MUST come from webhooks, not frontend redirects

export interface StripeConfig {
  secretKey: string;
  webhookSecret: string;
}

export function getStripeConfig(): StripeConfig | null {
  const secretKey = process.env.STRIPE_SECRET_KEY;
  const webhookSecret = process.env.STRIPE_WEBHOOK_SECRET;

  if (!secretKey || !webhookSecret) return null;

  return { secretKey, webhookSecret };
}

// Future: Stripe Checkout Session creation
// Future: Webhook handling for payment verification
// IMPORTANT: Never trust frontend redirect for payment confirmation
