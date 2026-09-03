import {
  CalendarDays,
  Dumbbell,
  History,
  ListChecks,
  Settings,
  Target,
  UtensilsCrossed,
} from 'lucide-react';

export type NavItem = {
  href: string;
  label: string;
  icon: typeof Dumbbell;
  /** Shown in the phone's bottom bar. Only five fit comfortably at 390px. */
  primary: boolean;
};

export const NAV_ITEMS: NavItem[] = [
  { href: '/', label: 'Today', icon: CalendarDays, primary: true },
  { href: '/routines', label: 'Routines', icon: ListChecks, primary: true },
  { href: '/food', label: 'Food', icon: UtensilsCrossed, primary: true },
  { href: '/plan', label: 'Plan', icon: Target, primary: true },
  { href: '/history', label: 'History', icon: History, primary: true },
  { href: '/exercises', label: 'Exercises', icon: Dumbbell, primary: false },
  { href: '/settings', label: 'Settings', icon: Settings, primary: false },
];

export function isActive(pathname: string, href: string): boolean {
  if (href === '/') return pathname === '/';
  return pathname === href || pathname.startsWith(`${href}/`);
}
