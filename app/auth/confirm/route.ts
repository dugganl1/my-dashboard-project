import { type EmailOtpType } from '@supabase/supabase-js';
import { type NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { redirect } from 'next/navigation';
import { Resend } from 'resend';
import { EmailTemplate } from '@/components/email-templates/email-template';

const resend = new Resend(process.env.RESEND_API_KEY);

//This step handles what happens after a user clicks the confirmation link in their email.
export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const token_hash = searchParams.get('token_hash');
  const type = searchParams.get('type') as EmailOtpType | null;
  const next = searchParams.get('next') ?? '/';

  if (token_hash && type) {
    const supabase = await createClient();
    const { error } = await supabase.auth.verifyOtp({
      type,
      token_hash,
    });
    if (!error) {
      // Get user details after successful verification
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (user) {
        try {
          // Send welcome email
          await resend.emails.send({
            from: 'Acme <onboarding@resend.dev>',
            to: user.email!,
            subject: 'Welcome to Acme!',
            react: EmailTemplate({
              firstName:
                user.user_metadata?.full_name?.split(' ')[0] || 'there',
            }),
          });
        } catch (emailError) {
          // Log error but don't block the verification process
          console.error('Failed to send welcome email:', emailError);
        }
      }

      // redirect user to specified redirect URL or root of app
      redirect(next);
    }
  }
  // redirect the user to an error page with some instructions
  redirect('/error');
}
