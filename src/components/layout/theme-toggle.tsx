'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';

export function ThemeToggle() {
  const { setTheme } = useTheme();

  return (
    <Button
      variant="ghost"
      size="icon"
      aria-label="Toggle theme"
      // Read the current theme off the DOM at click time rather than from
      // state. The server cannot know the stored theme, so anything derived
      // from it during render either mismatches on hydration or needs a
      // mounted flag set from an effect; next-themes has already stamped the
      // class on <html> by the time a click can happen.
      onClick={() =>
        setTheme(
          document.documentElement.classList.contains('dark') ? 'light' : 'dark',
        )
      }
      className="text-muted-foreground"
    >
      {/* Both icons render; CSS picks one. This keeps the server and client
          markup identical, so there is no hydration mismatch and no flash. */}
      <Sun className="hidden size-4 dark:block" />
      <Moon className="size-4 dark:hidden" />
    </Button>
  );
}
