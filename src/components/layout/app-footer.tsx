/**
 * Authorship credit, shown at the bottom of every screen.
 *
 * Deliberately quiet: this is a training log used mid-set, so the credit sits
 * in muted text below the content rather than competing with it. On phones it
 * lands above the fixed bottom bar, inside the padding `main` already reserves.
 */
export function AppFooter({ className }: { className?: string }) {
  return (
    <footer
      className={
        className ??
        'px-5 pt-10 pb-2 text-center text-xs text-muted-foreground'
      }
    >
      <p>
        Developed by{' '}
        <span className="text-foreground/80">Andre Milan A. Arañas</span>
      </p>
      <p className="pt-0.5">September 2026</p>
    </footer>
  );
}
