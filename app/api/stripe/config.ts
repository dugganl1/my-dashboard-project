console.log('Loading server config with env vars:', {
  monthly: process.env.STRIPE_PRICE_MONTHLY_SUB_MONTHLY,
  yearly: process.env.STRIPE_PRICE_MONTHLY_SUB_YEARLY,
  dayPass: process.env.STRIPE_PRICE_DAY_PASS,
  lifetime: process.env.STRIPE_PRICE_LIFETIME,
});

interface Plan {
  name: string;
  type: 'one_time' | 'subscription';
  stripePriceId: string | { monthly: string; yearly: string };
}

export const STRIPE_PLANS: Record<string, Plan> = {
  DAY_PASS: {
    name: 'Day Pass',
    type: 'one_time',
    stripePriceId: process.env.STRIPE_PRICE_DAY_PASS!,
  },
  MONTHLY_SUB: {
    name: 'Monthly Subscription',
    type: 'subscription',
    stripePriceId: {
      monthly: process.env.STRIPE_PRICE_MONTHLY_SUB_MONTHLY!,
      yearly: process.env.STRIPE_PRICE_MONTHLY_SUB_YEARLY!,
    },
  },
  LIFETIME: {
    name: 'Lifetime Membership',
    type: 'one_time',
    stripePriceId: process.env.STRIPE_PRICE_LIFETIME!,
  },
};
