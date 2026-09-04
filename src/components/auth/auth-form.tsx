'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { signIn, signUp } from '@/lib/auth-client';

type Mode = 'sign-in' | 'sign-up';

/**
 * Leave the auth screens with a full page load rather than a client-side push.
 *
 * Signing in changes the whole shell — the root layout reads the session and
 * swaps a bare centred card for the sidebar, nav and app chrome. A soft
 * navigation re-rendered the server components before the freshly-set session
 * cookie had settled, which surfaced as "APIError: Failed to get session" and
 * left the user sitting on /sign-up despite a successful signup.
 *
 * A hard navigation guarantees the new cookie is sent and the signed-in shell
 * is rendered from scratch. It costs one reload, once, at a boundary where the
 * entire page changes anyway.
 *
 * Next's lint rule prefers router.push() for internal links, and it is right
 * almost everywhere — but router.push() reuses the client-cached root layout,
 * which is the signed-out one. That is the bug this replaces, so the rule is
 * knowingly suppressed here and nowhere else.
 */
function enterApp() {
  // eslint-disable-next-line @next/next/no-location-assign-relative-destination
  window.location.assign('/');
}

/**
 * Email + password sign-in and sign-up.
 *
 * One component for both, because the two forms differ only by a name field
 * and which endpoint they call — keeping them together stops the styling and
 * error handling drifting apart.
 */
export function AuthForm({
  mode,
  emailEnabled,
}: {
  mode: Mode;
  /** False when no mail provider is configured — password reset cannot work,
      so we do not offer a link that leads nowhere. */
  emailEnabled: boolean;
}) {
  const isSignUp = mode === 'sign-up';

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [pending, setPending] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (isSignUp && password.length < 8) {
      setError('Password must be at least 8 characters.');
      return;
    }

    setPending(true);

    if (isSignUp) {
      const { error } = await signUp.email({
        email: email.trim(),
        password,
        name: name.trim() || email.trim().split('@')[0],
      });
      setPending(false);

      if (error) {
        setError(error.message ?? 'Could not create that account.');
        return;
      }
      // Email verification is off (see src/lib/auth.ts) and autoSignIn is on,
      // so a new account goes straight into the app.
      enterApp();
      return;
    }

    const { error } = await signIn.email({ email: email.trim(), password });
    setPending(false);

    if (error) {
      // 403 means an unverified account. Only reachable if verification gets
      // switched back on in src/lib/auth.ts; kept so that flow stays correct.
      const message =
        error.status === 403
          ? 'Verify your email address before signing in. Check your inbox for the link.'
          : (error.message ?? 'Wrong email or password.');
      setError(message);
      return;
    }

    enterApp();
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {isSignUp ? (
        <div className="space-y-2">
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Andre"
            autoComplete="name"
          />
        </div>
      ) : null}

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="you@example.com"
          autoComplete="email"
          required
        />
      </div>

      <div className="space-y-2">
        <div className="flex items-baseline justify-between">
          <Label htmlFor="password">Password</Label>
          {!isSignUp && emailEnabled ? (
            <Link
              href="/forgot-password"
              className="text-xs text-muted-foreground underline underline-offset-4"
            >
              Forgot?
            </Link>
          ) : null}
        </div>
        <Input
          id="password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete={isSignUp ? 'new-password' : 'current-password'}
          required
        />
        {isSignUp ? (
          <p className="text-xs text-muted-foreground">At least 8 characters.</p>
        ) : null}
      </div>

      {error ? (
        <p
          role="alert"
          className="rounded-md border border-destructive/40 px-3 py-2 text-sm text-destructive"
        >
          {error}
        </p>
      ) : null}

      <Button type="submit" className="w-full" disabled={pending}>
        {pending
          ? isSignUp
            ? 'Creating account…'
            : 'Signing in…'
          : isSignUp
            ? 'Create account'
            : 'Sign in'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        {isSignUp ? 'Already have an account? ' : 'No account yet? '}
        <Link
          href={isSignUp ? '/sign-in' : '/sign-up'}
          className="text-foreground underline underline-offset-4"
        >
          {isSignUp ? 'Sign in' : 'Sign up'}
        </Link>
      </p>
    </form>
  );
}
