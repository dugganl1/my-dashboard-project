'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GalleryVerticalEnd } from 'lucide-react';
import { useState } from 'react';

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-screen-xl px-6 md:px-10">
        <div className="relative z-40 flex h-16 items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center">
            <Link href="/" className="flex items-center gap-2 font-medium">
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="h-4 w-4" />
              </div>
              <span>Acme Inc.</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-6">
            <Link
              href="/features"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Features
            </Link>
            <Link
              href="/pricing"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              Pricing
            </Link>
            <Link
              href="/about"
              className="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors"
            >
              About
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button */}
          <button
            className="inline-flex items-center justify-center rounded-md p-2 text-foreground md:hidden"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <span className="sr-only">Open main menu</span>
            {!isMobileMenuOpen ? (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            ) : (
              <svg
                className="h-6 w-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="md:hidden">
            <div className="space-y-1 px-2 pb-3 pt-2">
              <Link
                href="/features"
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
              >
                Features
              </Link>
              <Link
                href="/pricing"
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
              >
                Pricing
              </Link>
              <Link
                href="/about"
                className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
              >
                About
              </Link>
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
            </div>
          </div>
        )}
      </div>
    </header>
  );
}
