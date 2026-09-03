import { format, startOfDay } from 'date-fns';

/**
 * Days are the primary key of both features: one workout list per day, one
 * DailyLog per day. To keep that stable we store every day as UTC midnight and
 * never let a timezone shift move a log to the day before.
 *
 * dayKey() is the string form used in URLs (/food/2026-09-03).
 */

export function toDayStart(date: Date): Date {
  const local = startOfDay(date);
  return new Date(
    Date.UTC(local.getFullYear(), local.getMonth(), local.getDate()),
  );
}

export function dayKey(date: Date): string {
  return format(date, 'yyyy-MM-dd');
}

/** Parse a yyyy-MM-dd URL segment back to the UTC-midnight Date we store. */
export function fromDayKey(key: string): Date {
  const [y, m, d] = key.split('-').map(Number);
  return new Date(Date.UTC(y, m - 1, d));
}

export function todayKey(): string {
  return dayKey(new Date());
}

/** "Today" / "Yesterday" / "Mon, 3 Sep" — used in list headers. */
export function friendlyDay(date: Date): string {
  const key = dayKey(date);
  const today = dayKey(new Date());
  const yesterday = dayKey(new Date(Date.now() - 86_400_000));
  if (key === today) return 'Today';
  if (key === yesterday) return 'Yesterday';
  return format(date, 'EEE, d MMM');
}

export function formatDuration(seconds: number): string {
  const m = Math.floor(seconds / 60);
  const s = seconds % 60;
  if (m === 0) return `${s}s`;
  return s === 0 ? `${m}m` : `${m}m ${s}s`;
}
