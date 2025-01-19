import { GalleryVerticalEnd } from 'lucide-react';
import { PasswordResetForm } from '@/components/password-reset-form';
import Link from 'next/link';

export default function Page() {
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
          <PasswordResetForm />
        </div>
      </div>
    </div>
  );
}
