import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-templates/email-template';
import { createCheckoutSession } from '@/app/api/stripe/actions';

// Add comprehensive debugging for environment variables
console.log('Available environment variables:', Object.keys(process.env));
console.log('RESEND_API_KEY exists:', !!process.env.RESEND_API_KEY);
console.log('RESEND_API_KEY type:', typeof process.env.RESEND_API_KEY);
console.log('RESEND_API_KEY length:', process.env.RESEND_API_KEY?.length);

let resend: Resend | undefined;
try {
  if (process.env.RESEND_API_KEY) {
    resend = new Resend(process.env.RESEND_API_KEY);
  }
} catch (error) {
  console.error('Failed to initialize Resend:', error);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const plan = searchParams.get('plan');
  const priceId = searchParams.get('priceId');
  const billingCycle = searchParams.get('billingCycle');

  if (!token_hash || !type) {
    redirect('/auth/login?error=invalid-link');
  }

  const supabase = await createClient();
  const { error } = await supabase.auth.verifyOtp({
    type,
    token_hash,
  });

  if (error) {
    console.error('Verification error:', error);
    redirect('/auth/login?error=verification-failed');
  }

  // If we have plan details, create checkout session
  if (plan && priceId && billingCycle) {
    const response = await createCheckoutSession({
      planId: plan,
      priceId: priceId,
      billingCycle: billingCycle as 'monthly' | 'yearly',
    });

    if (response?.sessionUrl) {
      redirect(response.sessionUrl);
    }
  }

  // Fallback to dashboard if no plan details
  redirect('/dashboard');
}
