import Link from 'next/link';
import type { ReactNode } from 'react';

/**
 * Centred card used by every signed-out screen.
 *
 * Fills the space its parent gives it rather than claiming `min-h-dvh` itself.
 * Demanding a full viewport here made the page taller than the screen once the
 * footer was added below, so sign-in scrolled for no reason.
 */
export function AuthShell({
  title,
  description,
  children,
}: {
  title: string;
  description?: ReactNode;
  children: ReactNode;
}) {
  return (
    <div className="flex flex-1 items-center justify-center px-5 py-8">
      <div className="w-full max-w-sm space-y-6">
        <div className="space-y-2 text-center">
          <Link
            href="/"
            className="text-sm font-semibold tracking-tight lowercase text-muted-foreground"
          >
            winter arc
          </Link>
          <h1 className="text-2xl font-semibold tracking-tight">{title}</h1>
          {description ? (
            <p className="text-sm text-muted-foreground">{description}</p>
          ) : null}
        </div>
        {children}
      </div>
    </div>
  );
}
