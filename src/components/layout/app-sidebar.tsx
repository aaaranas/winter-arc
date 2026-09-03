'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, isActive } from './nav-items';
import { ThemeToggle } from './theme-toggle';
import { Logo } from './logo';

/**
 * Desktop navigation. Hidden below lg, where the bottom bar takes over.
 *
 * A sidebar rather than a wider centred column: at 1440px a single 672px column
 * left the page looking like a phone screenshot dropped into a void. Anchoring
 * navigation to the left edge gives the content somewhere to sit and lets the
 * main area use the width it has.
 */
export function AppSidebar() {
  const pathname = usePathname();

  return (
    <aside className="sticky top-0 hidden h-dvh w-56 shrink-0 flex-col border-r lg:flex xl:w-64">
      <div className="px-5 pt-6 pb-4">
        <Link href="/" aria-label="Winter Arc — home">
          <Logo />
        </Link>
      </div>

      <nav className="flex-1 px-3">
        <ul className="space-y-0.5">
          {NAV_ITEMS.map(({ href, label, icon: Icon }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={cn(
                    'flex items-center gap-2.5 rounded-md px-3 py-2 text-sm transition-colors',
                    active
                      ? 'bg-accent font-medium text-foreground'
                      : 'text-muted-foreground hover:bg-accent/50 hover:text-foreground',
                  )}
                >
                  <Icon className="size-4 shrink-0" />
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>

      <div className="flex items-center justify-between border-t px-5 py-3">
        <span className="text-xs text-muted-foreground">Theme</span>
        <ThemeToggle />
      </div>
    </aside>
  );
}
