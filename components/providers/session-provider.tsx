'use client';

import { createBrowserClient } from '@supabase/ssr';
import { useRouter } from 'next/navigation';
import { useEffect } from 'react';

/**
 * SessionProvider: Manages authentication state across the application
 *
 * This provider serves as a central handler for authentication state changes.
 * It listens for sign-in/sign-out events and updates the application accordingly.
 *
 * Key features:
 * - Real-time auth state monitoring
 * - Automatic navigation on auth changes
 * - Server state synchronization
 * - Cleanup of auth subscriptions
 *
 * This should be placed at the root level of your application to ensure
 * consistent auth state management across all pages and components.
 */
export function SessionProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Set up auth state listener
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'SIGNED_OUT') {
        router.push('/auth/login');
        router.refresh();
      } else if (event === 'SIGNED_IN') {
        router.refresh();
      }
    });

    // Clean up subscription when component unmounts
    return () => {
      subscription.unsubscribe();
    };
  }, [router]);

  return children;
}
