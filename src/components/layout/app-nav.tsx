'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { NAV_ITEMS, isActive } from './nav-items';

/**
 * Phone navigation: a fixed bottom bar, because thumbs live at the bottom of
 * the screen and this app gets used mid-set.
 *
 * Only the primary destinations appear here; Exercises and Settings are
 * reachable from the header. Six is the practical ceiling — beyond that the
 * targets get too narrow to hit reliably at 320px.
 *
 * Hidden from lg up, where AppSidebar takes over.
 */
export function AppNav() {
  const pathname = usePathname();
  const items = NAV_ITEMS.filter((item) => item.primary);

  return (
    <nav
      className={cn(
        'fixed inset-x-0 bottom-0 z-40 border-t bg-background/95 backdrop-blur lg:hidden',
        'pb-[env(safe-area-inset-bottom)]',
      )}
    >
      <ul className="grid grid-cols-6">
        {items.map(({ href, label, icon: Icon }) => {
          const active = isActive(pathname, href);
          return (
            <li key={href}>
              <Link
                href={href}
                aria-current={active ? 'page' : undefined}
                className={cn(
                  'flex flex-col items-center gap-1 py-2.5 text-[10px] font-medium transition-colors',
                  active
                    ? 'text-foreground'
                    : 'text-muted-foreground hover:text-foreground',
                )}
              >
                <Icon className="size-5" />
                {label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
