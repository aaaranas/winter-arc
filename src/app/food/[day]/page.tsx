import { notFound } from 'next/navigation';
import { DayLogView } from '@/components/food/day-log-view';

// This page reads the live database on every request. Without this it would
// be prerendered at build time and serve the (empty) build-time snapshot.
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Food' };

export default async function FoodDayPage({ params }: PageProps<'/food/[day]'>) {
  const { day } = await params;

  // Guard the URL segment: a bad key would otherwise reach fromDayKey() and
  // produce an Invalid Date that Prisma rejects with an opaque error.
  if (!/^\d{4}-\d{2}-\d{2}$/.test(day)) notFound();

  return <DayLogView day={day} />;
}
