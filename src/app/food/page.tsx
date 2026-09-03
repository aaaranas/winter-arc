import { DayLogView } from '@/components/food/day-log-view';
import { todayKey } from '@/lib/dates';

// This page reads the live database on every request. Without this it would
// be prerendered at build time and serve the (empty) build-time snapshot.
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Food' };

export default function FoodPage() {
  return <DayLogView day={todayKey()} />;
}
