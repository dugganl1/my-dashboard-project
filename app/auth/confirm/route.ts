import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-templates/email-template';

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
  const next = searchParams.get('next') ?? '/dashboard'; // Default to dashboard

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

  // Get user details after successful verification
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (user && resend) {
    try {
      await resend.emails.send({
        from: 'Acme <onboarding@resend.dev>',
        to: user.email!,
        subject: 'Welcome to Acme!',
        react: EmailTemplate({
          firstName: user.user_metadata?.full_name?.split(' ')[0] || 'there',
        }),
      });
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError);
    }
  }

  // Always redirect to dashboard on success
  redirect('/dashboard');
}
