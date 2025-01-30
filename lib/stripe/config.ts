interface Plan {
  name: string;
  type: 'one_time' | 'subscription';
  price: number | { monthly: number; yearly: number };
}

export const STRIPE_PLANS: Record<string, Plan> = {
  DAY_PASS: {
    name: 'Day Pass',
    type: 'one_time',
    price: 9.99,
  },
  MONTHLY_SUB: {
    name: 'Monthly Subscription',
    type: 'subscription',
    price: {
      monthly: 29.99,
      yearly: 299.99,
    },
  },
  LIFETIME: {
    name: 'Lifetime Membership',
    type: 'one_time',
    price: 299.99,
  },
};
