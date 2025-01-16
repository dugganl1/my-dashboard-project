import { GalleryVerticalEnd } from 'lucide-react';
import { SignUpForm } from '@/components/signup-form';

export default function SignUpPage() {
  return (
    <div className="flex min-h-svh w-full flex-col p-6 md:p-10">
      <div className="flex justify-center gap-2 md:justify-start">
        <a href="#" className="flex items-center gap-2 font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </a>
      </div>
      <div className="flex flex-1 items-center justify-center">
        <div className="w-full max-w-[900px]">
          <SignUpForm />
        </div>
      </div>
    </div>
  );
}
