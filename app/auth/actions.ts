'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { createClient } from '@/lib/supabase/server';
import { z } from 'zod';
import { cookies } from 'next/headers';

// Define server-side validation schemas
const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

const signupSchema = z.object({
  email: z.string().email(),
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
  fullName: z
    .string()
    .min(1)
    .refine((name) => name.trim().split(/\s+/).length >= 2, {
      message: 'Please enter both first and last name',
    }),
});

const resetPasswordSchema = z.object({
  email: z.string().email(),
});

const updatePasswordSchema = z.object({
  password: z
    .string()
    .min(8)
    .regex(/[A-Z]/, 'Must contain uppercase')
    .regex(/[0-9]/, 'Must contain number')
    .regex(/[^A-Za-z0-9]/, 'Must contain special character'),
});

export async function login(formData: FormData) {
  const redirectTo = formData.get('redirectTo') as string;

  // Server-side validation
  const result = loginSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
  });

  if (!result.success) {
    redirect('/auth/login?error=validation');
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  });

  if (error) {
    // Add specific error handling
    const errorCode = error.message.includes('credentials')
      ? 'invalid-credentials'
      : 'unknown';
    redirect(`/auth/login?error=${errorCode}`);
  }

  revalidatePath('/', 'layout');
  redirect(redirectTo || '/dashboard');
}

export async function signup(formData: FormData) {
  // Server-side validation
  const result = signupSchema.safeParse({
    email: formData.get('email'),
    password: formData.get('password'),
    fullName: formData.get('fullName'),
  });

  if (!result.success) {
    console.error('Validation error:', result.error);
    redirect('/error');
  }

  const supabase = await createClient();

  const signUpData = {
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        full_name: result.data.fullName,
      },
    },
  };

  console.log('Attempting signup with:', {
    email: signUpData.email,
    // Don't log password
    options: signUpData.options,
  });

  const { error, data: userData } = await supabase.auth.signUp(signUpData);

  if (error) {
    console.error('Supabase signup error:', error);
    redirect('/error');
  }

  // Store the email in the session for reference
  const cookieStore = cookies();
  cookieStore.set('pending_verification_email', userData?.user?.email ?? '', {
    // Cookie options must match ResponseCookie type
    value: userData?.user?.email ?? '',
    name: 'pending_verification_email',
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 60 * 30, // 30 minutes
    path: '/',
  });

  revalidatePath('/', 'layout');
  redirect('/auth/verify-email');
}

export async function signInWithGoogle() {
  const supabase = await createClient();

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/callback`,
      queryParams: {
        access_type: 'offline',
        prompt: 'consent',
      },
    },
  });

  if (error) {
    console.error('Google auth error:', error);
    redirect('/error');
  }

  // If successful, supabase will redirect to the URL we specified
  if (data.url) {
    redirect(data.url);
  }
}

export async function resetPassword(formData: FormData) {
  // Server-side validation
  const result = resetPasswordSchema.safeParse({
    email: formData.get('email'),
  });

  if (!result.success) {
    redirect('/error');
  }

  const supabase = await createClient();

  const { error } = await supabase.auth.resetPasswordForEmail(
    result.data.email,
    {
      redirectTo: `${process.env.NEXT_PUBLIC_SITE_URL}/auth/update-password`,
    }
  );

  if (error) {
    console.error('Password reset error:', error);
    redirect('/error');
  }

  redirect('/auth/check-email');
}

export async function updatePassword(formData: FormData) {
  // Server-side validation
  const result = updatePasswordSchema.safeParse({
    password: formData.get('password'),
  });

  if (!result.success) {
    redirect('/error');
  }

  const supabase = await createClient();

  // Verify the user's session first
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('User verification error:', userError);
    redirect('/auth/login');
  }

  const { error } = await supabase.auth.updateUser({
    password: result.data.password,
  });

  if (error) {
    console.error('Password update error:', error);
    redirect('/error');
  }

  // Sign out the user after password update
  await supabase.auth.signOut();

  revalidatePath('/', 'layout');
  redirect('/auth/login?message=password-updated');
}

export async function resendVerificationEmail() {
  const supabase = await createClient();
  const session = cookies();
  const email = session.get('pending_verification_email')?.value;

  if (!email) {
    redirect('/auth/signup');
  }

  const { error } = await supabase.auth.resend({
    type: 'signup',
    email,
  });

  if (error) {
    redirect('/auth/verify-email?error=failed-to-resend');
  }

  redirect('/auth/verify-email?message=verification-email-sent');
}

export async function savePlanSelection(formData: FormData) {
  const supabase = await createClient();

  // Get the current user
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser();

  if (userError || !user) {
    console.error('User not found:', userError);
    redirect('/auth/login');
  }

  // Save the plan selection to your database
  const { error } = await supabase.from('subscriptions').upsert({
    user_id: user.id,
    plan: formData.get('plan'),
    billing_cycle: formData.get('billingCycle'),
    // Add other relevant fields like status, dates, etc.
  });

  if (error) {
    console.error('Error saving plan selection:', error);
    redirect('/error');
  }

  // Redirect to dashboard or payment processing
  redirect('/dashboard');
}
