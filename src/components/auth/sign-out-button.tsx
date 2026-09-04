'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { signOut } from '@/lib/auth-client';

export function SignOutButton({ compact = false }: { compact?: boolean }) {
  const router = useRouter();
  const [pending, setPending] = useState(false);

  async function handleSignOut() {
    setPending(true);
    await signOut();
    router.push('/sign-in');
    router.refresh();
  }

  return (
    <Button
      variant="ghost"
      size={compact ? 'icon' : 'sm'}
      aria-label="Sign out"
      disabled={pending}
      onClick={handleSignOut}
      className="text-muted-foreground hover:text-foreground"
    >
      <LogOut className={compact ? 'size-4' : 'size-3.5'} />
      {compact ? null : 'Sign out'}
    </Button>
  );
}
