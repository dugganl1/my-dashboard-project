'use client';

import { GalleryVerticalEnd } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { PlanSelectionForm } from '@/components/plan-selection-form';

export default function PlanSelectionPage() {
  const router = useRouter();

  const handlePlanSubmit = async (data: {
    planId: string;
    billingCycle: 'monthly' | 'yearly';
  }) => {
    try {
      // Here you'll update the user's plan in your database
      // await updateUserPlan(data);
      console.log('Selected plan:', data);

      // Redirect to dashboard or payment setup
      router.push('/dashboard');
    } catch (error) {
      console.error('Error updating plan:', error);
    }
  };

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
        <div className="w-full max-w-[900px]">
          <PlanSelectionForm onSubmit={handlePlanSubmit} />
        </div>
      </div>
    </div>
  );
}
