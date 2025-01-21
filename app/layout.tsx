import type { Metadata } from 'next';
import localFont from 'next/font/local';
import './globals.css';
import { SessionProvider } from '@/components/providers/session-provider';

// Load custom fonts
const geistSans = localFont({
  src: './fonts/GeistVF.woff',
  variable: '--font-geist-sans',
  weight: '100 900',
});
const geistMono = localFont({
  src: './fonts/GeistMonoVF.woff',
  variable: '--font-geist-mono',
  weight: '100 900',
});

export const metadata: Metadata = {
  title: 'Create Next App',
  description: 'Generated by create next app',
};

/**
 * Root layout component that wraps the entire application.
 *
 * The component hierarchy is:
 * 1. HTML/Body tags with language and font classes
 * 2. SessionProvider for app-wide auth state management
 * 3. Child components (pages/other layouts)
 *
 * SessionProvider is placed here to ensure:
 * - Authentication state is managed consistently across all routes
 * - Auth listener is initialized once when the app loads
 * - All components have access to the same auth state
 */
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <SessionProvider>{children}</SessionProvider>
      </body>
    </html>
  );
}
