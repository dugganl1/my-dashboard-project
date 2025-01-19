import { GalleryVerticalEnd } from 'lucide-react';
import { UpdatePasswordForm } from '@/components/update-password-form';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export default function UpdatePasswordPage({
  searchParams,
}: {
  searchParams: { [key: string]: string | undefined };
}) {
  const error = searchParams.error;
  const errorDescription = searchParams.error_description;

  // If there's an error, show error state instead of the form
  if (error) {
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
                <CardTitle className="text-2xl">Link Expired</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground">
                  This password reset link has expired or is invalid. Please
                  request a new password reset link.
                </p>
                <div className="mt-6 text-center">
                  <Link
                    href="/auth/password-reset"
                    className="inline-block w-full rounded-md bg-primary px-4 py-2 text-center text-sm font-medium text-primary-foreground hover:bg-primary/90"
                  >
                    Request New Link
                  </Link>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    );
  }

  // If no error, show the update password form
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
          <UpdatePasswordForm />
        </div>
      </div>
    </div>
  );
}
