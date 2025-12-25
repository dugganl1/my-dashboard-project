/**
 * Unified pricing configuration
 * Single source of truth for all pricing data (display + Stripe)
 */

export interface PlanPricing {
  monthly: number;
  yearly: number;
}

export interface Plan {
  id: string;
  name: string;
  description: string;
  type: 'one_time' | 'subscription';
  price: number | PlanPricing;
  features: string[];
  cta: string;
  popular: boolean;
  stripePriceId: string | { monthly: string; yearly: string };
}

function getEnvVar(name: string): string {
  const value = process.env[name];
  if (!value) {
    console.warn(`Missing environment variable: ${name}`);
    return '';
  }
  return value;
}

export const PLANS: Record<string, Plan> = {
  DAY_PASS: {
    id: 'DAY_PASS',
    name: 'Day Pass',
    description: 'Perfect for side projects and learning',
    type: 'one_time',
    price: 9.99,
    features: [
      'Up to 3 projects',
      '1GB storage',
      'Basic analytics',
      'Community support',
    ],
    cta: 'Get Started',
    popular: false,
    stripePriceId: getEnvVar('STRIPE_PRICE_DAY_PASS'),
  },
  MONTHLY_SUB: {
    id: 'MONTHLY_SUB',
    name: 'Monthly Subscription',
    description: 'For professional developers and small teams',
    type: 'subscription',
    price: {
      monthly: 29.99,
      yearly: 299.99,
    },
    features: [
      'Unlimited projects',
      '10GB storage',
      'Advanced analytics',
      'Priority support',
      'Custom domains',
      'Team collaboration',
    ],
    cta: 'Start Free Trial',
    popular: true,
    stripePriceId: {
      monthly: getEnvVar('STRIPE_PRICE_MONTHLY_SUB_MONTHLY'),
      yearly: getEnvVar('STRIPE_PRICE_MONTHLY_SUB_YEARLY'),
    },
  },
  LIFETIME: {
    id: 'LIFETIME',
    name: 'Lifetime Membership',
    description: 'For large teams with advanced needs',
    type: 'one_time',
    price: 299.99,
    features: [
      'Unlimited everything',
      'Advanced security',
      'Custom integrations',
      '24/7 phone support',
      'SLA guarantee',
      'Dedicated account manager',
    ],
    cta: 'Get Lifetime Access',
    popular: false,
    stripePriceId: getEnvVar('STRIPE_PRICE_LIFETIME'),
  },
};

// Helper to get all plans as array (for rendering)
export const PLANS_LIST = Object.values(PLANS);

// Helper to get price for display
export function getDisplayPrice(plan: Plan, isYearly = false): number {
  if (typeof plan.price === 'number') {
    return plan.price;
  }
  return isYearly ? plan.price.yearly : plan.price.monthly;
}

// Helper to get Stripe price ID
export function getStripePriceId(plan: Plan, isYearly = false): string {
  if (typeof plan.stripePriceId === 'string') {
    return plan.stripePriceId;
  }
  return isYearly ? plan.stripePriceId.yearly : plan.stripePriceId.monthly;
}
