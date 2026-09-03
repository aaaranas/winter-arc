import { cn } from '@/lib/utils';

/**
 * The Winter Arc mark: a rising arc with a dot continuing past its end — the
 * arc of a season of work, and where you are along it.
 *
 * Drawn as inline SVG with `currentColor` so it inherits the text colour and
 * flips with the theme for free. The same geometry is reproduced in pixel maths
 * by scripts/generate-icons.mjs for the PWA icons; if you change one, change
 * the other.
 */
export function LogoMark({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      aria-hidden="true"
      className={cn('size-5', className)}
    >
      <path
        d="M3.6 12.6A8.64 8.64 0 0 1 20 11.2"
        stroke="currentColor"
        strokeWidth="2.9"
        strokeLinecap="round"
      />
      <circle cx="20.4" cy="16.5" r="1.45" fill="currentColor" />
    </svg>
  );
}

/** Mark plus wordmark, used in the sidebar and the phone header. */
export function Logo({
  className,
  showWordmark = true,
}: {
  className?: string;
  showWordmark?: boolean;
}) {
  return (
    <span className={cn('flex items-center gap-2', className)}>
      <LogoMark className="size-5 shrink-0" />
      {showWordmark ? (
        <span className="text-sm font-semibold tracking-tight">
          Winter Arc
        </span>
      ) : null}
      <span className="sr-only">Winter Arc</span>
    </span>
  );
}
