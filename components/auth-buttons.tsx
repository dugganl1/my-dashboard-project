'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { createBrowserClient } from '@supabase/ssr';
import { useEffect, useState } from 'react';

export function AuthButtons({ isMobile = false }: { isMobile?: boolean }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);

  useEffect(() => {
    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    // Check initial auth state
    const checkAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      setIsAuthenticated(!!session);
    };

    checkAuth();

    // Listen for auth changes
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((event, session) => {
      setIsAuthenticated(!!session);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  // Show a small transparent placeholder while loading to prevent layout shift
  if (isAuthenticated === null) {
    return <div className={isMobile ? 'h-10' : 'w-[158px]'} />;
  }

  if (isAuthenticated) {
    if (isMobile) {
      return (
        <Link
          href="/dashboard"
          className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
        >
          Dashboard
        </Link>
      );
    }

    return (
      <Button asChild>
        <Link href="/dashboard">Dashboard</Link>
      </Button>
    );
  }

  if (isMobile) {
    return (
      <>
        <Link
          href="/auth/login"
          className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
        >
          Sign in
        </Link>
        <Link
          href="/auth/signup"
          className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
        >
          Get started
        </Link>
      </>
    );
  }

  return (
    <>
      <Button variant="ghost" asChild>
        <Link href="/auth/login">Sign in</Link>
      </Button>
      <Button asChild>
        <Link href="/auth/signup">Get started</Link>
      </Button>
    </>
  );
}
