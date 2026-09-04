'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { authClient } from '@/lib/auth-client';

/** Re-sends the verification email, for when the first one goes astray. */
export function ResendVerification({ email }: { email: string }) {
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');

  async function resend() {
    setState('sending');
    const { error } = await authClient.sendVerificationEmail({
      email,
      callbackURL: '/',
    });
    setState(error ? 'error' : 'sent');
  }

  return (
    <div className="space-y-2">
      <Button
        variant="outline"
        className="w-full"
        onClick={resend}
        disabled={state === 'sending' || state === 'sent'}
      >
        {state === 'sending'
          ? 'Sending…'
          : state === 'sent'
            ? 'Sent — check your inbox'
            : 'Resend the link'}
      </Button>
      {state === 'error' ? (
        <p role="alert" className="text-sm text-destructive">
          Could not resend just now. Try again in a moment.
        </p>
      ) : null}
    </div>
  );
}
