'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { resendVerificationEmail } from '@/app/auth/actions';
import Link from 'next/link';

export function VerifyEmailForm() {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Verify your email</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">
          We&apos;ve sent a verification link to your email address. It should
          arrive in the next minute or two.
        </p>
        <p className="text-muted-foreground">
          Can&apos;t see it? Check your spam folder or request a new link below.
        </p>
        <form action={resendVerificationEmail}>
          <Button type="submit" className="w-full">
            Resend verification link
          </Button>
        </form>
        <div className="text-center text-sm text-muted-foreground">
          Already clicked it?{' '}
          <Link
            href="/dashboard"
            className="underline underline-offset-4 hover:text-primary"
          >
            Login
          </Link>
        </div>
      </CardContent>
    </Card>
  );
}
