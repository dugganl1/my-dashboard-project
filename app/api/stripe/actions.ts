'use server';

import { stripe } from '@/lib/stripe/client';
import { createClient } from '@/lib/supabase/server';
import { PLANS, getStripePriceId } from '@/lib/stripe/config';
import Stripe from 'stripe';

interface CreateCheckoutSessionData {
  priceId: string;
  planId: string;
  billingCycle: 'monthly' | 'yearly';
}

export async function getPlanPriceId(planId: string, isYearly: boolean) {
  const plan = PLANS[planId];

  if (!plan) {
    throw new Error('Invalid plan selected');
  }

  const priceId = getStripePriceId(plan, isYearly);

  if (!priceId) {
    throw new Error(`No price ID configured for plan: ${planId}`);
  }

  return priceId;
}

export async function createCheckoutSession(data: CreateCheckoutSessionData) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) throw new Error('User not authenticated');

  let customerData: Stripe.Customer;
  const customers = await stripe.customers.list({
    email: user.email,
    limit: 1,
  });

  if (customers.data.length > 0) {
    customerData = customers.data[0];
  } else {
    customerData = await stripe.customers.create({
      email: user.email,
      metadata: { supabaseUUID: user.id },
    });
  }

  const plan = PLANS[data.planId];
  if (!plan) throw new Error('Invalid plan selected');

  const baseParams: Stripe.Checkout.SessionCreateParams = {
    customer: customerData.id,
    payment_method_types: ['card'],
    line_items: [{ price: data.priceId, quantity: 1 }],
    success_url: `${process.env.NEXT_PUBLIC_SITE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    cancel_url: `${process.env.NEXT_PUBLIC_SITE_URL}/pricing`,
    metadata: {
      userId: user.id,
      planId: data.planId,
    },
    billing_address_collection: 'auto',
    allow_promotion_codes: true,
    customer_update: {
      address: 'auto',
      name: 'auto',
    },
  };

  const checkoutSession = await stripe.checkout.sessions.create(
    plan.type === 'one_time'
      ? { ...baseParams, mode: 'payment' }
      : {
          ...baseParams,
          mode: 'subscription',
          metadata: {
            ...baseParams.metadata,
            billingCycle: data.billingCycle,
          },
          subscription_data: {
            trial_period_days: 14,
            metadata: {
              userId: user.id,
              planId: data.planId,
            },
          },
        }
  );

  return { sessionUrl: checkoutSession.url };
}
