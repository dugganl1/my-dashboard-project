'use client';

import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';

export function VerificationBanner() {
  const [isResending, setIsResending] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const handleResend = async () => {
    setIsResending(true);
    try {
      const supabase = createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user?.email) throw new Error('No email found');

      const { error } = await supabase.auth.resend({
        type: 'signup',
        email: user.email,
      });

      if (error) throw error;
      setMessage('Verification email sent! Please check your inbox.');
    } catch (error) {
      setMessage('Failed to resend verification email. Please try again.');
    } finally {
      setIsResending(false);
    }
  };

  return (
    <Alert variant="default" className="mb-4">
      <AlertCircle className="h-4 w-4" />
      <AlertDescription className="flex items-center gap-x-2">
        Please verify your email to access all features.
        <Button
          variant="ghost"
          size="sm"
          onClick={handleResend}
          disabled={isResending}
        >
          {isResending ? 'Sending...' : 'Resend verification email'}
        </Button>
        {message && <span className="text-sm">{message}</span>}
      </AlertDescription>
    </Alert>
  );
}
