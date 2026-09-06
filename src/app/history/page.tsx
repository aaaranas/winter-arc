import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { PageHeader } from '@/components/layout/page-header';
import { getWorkoutHistory } from '@/lib/queries';
import { getExercise } from '@/lib/exercises';
import { friendlyDay } from '@/lib/dates';

// This page reads the live database on every request. Without this it would
// be prerendered at build time and serve the (empty) build-time snapshot.
export const dynamic = 'force-dynamic';

export const metadata = { title: 'History' };

export default async function HistoryPage() {
  const workouts = await getWorkoutHistory();

  return (
    <div>
      <PageHeader
        title="History"
        description={`${workouts.length} logged ${workouts.length === 1 ? 'workout' : 'workouts'}`}
      />

      {workouts.length === 0 ? (
        <p className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
          Nothing logged yet.
        </p>
      ) : (
        <ul className="grid gap-2 lg:grid-cols-2">
          {workouts.map((w) => {
            const names = w.exercises
              .map((e) => getExercise(e.exerciseSlug)?.name)
              .filter(Boolean);
            const sets = w.exercises.reduce((n, e) => n + e.sets.length, 0);

            return (
              <li key={w.id} className="min-w-0">
                <Link
                  href={`/workout/${w.id}`}
                  className="flex h-full items-center gap-4 rounded-lg border px-4 py-3.5 transition-colors hover:bg-accent/40"
                >
                  <div className="min-w-0 flex-1 space-y-1">
                    <div className="flex items-baseline gap-2">
                      <p className="truncate font-medium">
                        {w.name ?? 'Untitled workout'}
                      </p>
                      {!w.finishedAt ? (
                        <span className="text-[11px] text-muted-foreground">
                          in progress
                        </span>
                      ) : null}
                    </div>
                    <p className="truncate text-xs text-muted-foreground">
                      {friendlyDay(w.date)} · {sets} sets
                      {names.length ? ` · ${names.slice(0, 3).join(', ')}` : ''}
                    </p>
                  </div>
                  <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
