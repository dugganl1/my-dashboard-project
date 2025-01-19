import { GalleryVerticalEnd } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function CheckEmailPage() {
  return (
    <div className="flex min-h-svh w-full flex-col">
      <div className="container mx-auto max-w-screen-xl px-6 md:px-10">
        <div className="flex h-16 justify-center gap-2 md:justify-start">
          <Link href="/" className="flex items-center gap-2 font-medium">
            <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
              <GalleryVerticalEnd className="size-4" />
            </div>
            Acme Inc.
          </Link>
        </div>
      </div>
      <div className="flex flex-1 items-center justify-center px-6 md:px-10">
        <div className="w-full max-w-sm">
          <Card>
            <CardHeader>
              <CardTitle className="text-2xl">Check your email</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-muted-foreground">
                We&apos;ve sent you a password reset link. Please check your
                email and follow the instructions to reset your password.
              </p>
              <div className="mt-4 text-sm">
                <Link
                  href="/auth/login"
                  className="underline underline-offset-4"
                >
                  Back to login
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
