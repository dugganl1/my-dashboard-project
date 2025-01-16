'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { GalleryVerticalEnd } from 'lucide-react';
import { useState } from 'react';
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from '@/components/ui/navigation-menu';

const features = [
  {
    title: 'Collaborative Editing',
    description: 'Real-time document editing with multiple users',
    href: '/features/collaborative-editing',
  },
  {
    title: 'Version Control',
    description: 'Track and manage changes with detailed history',
    href: '/features/version-control',
  },
  {
    title: 'Smart Analytics',
    description: 'Insights and metrics to improve productivity',
    href: '/features/analytics',
  },
];

export function NavBar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <header className="fixed left-0 right-0 top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
      <div className="container mx-auto max-w-screen-xl px-6 md:px-10">
        <div className="relative z-40 flex h-16 items-center justify-between">
          {/* Left: Logo & Brand */}
          <div className="flex items-center flex-shrink-0">
            <Link
              href="/"
              className="flex items-center gap-2 font-medium whitespace-nowrap"
            >
              <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
                <GalleryVerticalEnd className="h-4 w-4" />
              </div>
              <span>Acme Inc.</span>
            </Link>
          </div>
          {/* Center: Navigation */}
          <div className="hidden md:flex justify-center flex-1 mx-8">
            <div className="flex items-center gap-6">
              <NavigationMenu>
                <NavigationMenuList>
                  <NavigationMenuItem>
                    <NavigationMenuTrigger className="p-0 px-0 h-auto bg-transparent hover:bg-transparent text-sm font-medium text-muted-foreground hover:text-foreground">
                      Features
                    </NavigationMenuTrigger>
                    <NavigationMenuContent>
                      <div className="w-[400px] p-4">
                        {features.map((feature) => (
                          <Link
                            key={feature.title}
                            href={feature.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground"
                          >
                            <div className="text-sm font-medium leading-none">
                              {feature.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {feature.description}
                            </p>
                          </Link>
                        ))}
                      </div>
                    </NavigationMenuContent>
                  </NavigationMenuItem>
                </NavigationMenuList>
              </NavigationMenu>

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
            </div>
          </div>
          {/* Right: Auth Buttons */}
          <div className="hidden md:flex items-center gap-2 flex-shrink-0">
            <Button variant="ghost" asChild>
              <Link href="/auth/login">Sign in</Link>
            </Button>
            <Button asChild>
              <Link href="/auth/signup">Get started</Link>
            </Button>
          </div>

          {/* Mobile Menu Button - Moved outside the nav structure */}
          <button
            className="md:hidden ml-4 inline-flex items-center justify-center rounded-md p-2 text-foreground"
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
          {/* Mobile Menu */}
          {isMobileMenuOpen && (
            <div className="absolute left-0 right-0 top-[64px] border-b border-border bg-background/80 backdrop-blur-sm md:hidden">
              <div className="container mx-auto max-w-screen-xl px-6 md:px-10">
                <div className="space-y-1 py-3">
                  {features.map((feature) => (
                    <Link
                      key={feature.title}
                      href={feature.href}
                      className="block rounded-md px-3 py-2 text-base font-medium text-foreground hover:bg-accent"
                    >
                      {feature.title}
                    </Link>
                  ))}
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
            </div>
          )}
        </div>
      </div>
    </header>
  );
}
