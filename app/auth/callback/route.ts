import { createClient } from '@/lib/supabase/server';
import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';

/**
 * This is the OAuth callback route handler for Google authentication.
 * When a user clicks "Sign in with Google":
 * 1. They are redirected to Google's login page
 * 2. After successful Google login, Google redirects back to this route
 * 3. Google includes an authorization code in the URL
 * 4. We exchange this code for a Supabase session
 * 5. Finally, we redirect to the dashboard
 */

export async function GET(request: Request) {
  const requestUrl = new URL(request.url);
  const code = requestUrl.searchParams.get('code');

  if (code) {
    const supabase = await createClient();
    const cookieStore = cookies();

    // Exchange code for session
    await supabase.auth.exchangeCodeForSession(code);

    // Redirect to dashboard on success
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Return to login page if code is missing
  return NextResponse.redirect(new URL('/auth/login', request.url));
}
