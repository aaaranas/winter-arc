import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { Sparkline } from '@/components/charts/sparkline';
import { getExerciseProgress } from '@/lib/queries';
import { getExercise } from '@/lib/exercises';
import { formatDuration, friendlyDay } from '@/lib/dates';
import { num } from '@/lib/format';
import { cn } from '@/lib/utils';

// This page reads the live database on every request. Without this it would
// be prerendered at build time and serve the (empty) build-time snapshot.
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Progress' };

/** How to read the number, since not every exercise is weight × reps. */
function describe(value: number, metric: string, unit: string): string {
  if (metric === 'duration') return formatDuration(Math.round(value));
  if (metric === 'reps') return `${Math.round(value)} reps`;
  if (metric === 'distance') return `${num(value)} m`;
  return `${num(value)} ${unit}`;
}

export default async function ProgressPage() {
  const progress = await getExerciseProgress();

  return (
    <div>
      <PageHeader
        title="Progress"
        description={
          progress.length
            ? `${progress.length} exercises trained in the last year. One point per session — its best set.`
            : 'Log some sets and your trends appear here.'
        }
      />

      {progress.length === 0 ? (
        <p className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
          Nothing logged yet.
        </p>
      ) : (
        <ul className="grid gap-3 lg:grid-cols-2">
          {progress.map((row) => {
            const exercise = getExercise(row.exerciseSlug);
            const values = row.points.map((p) => p.value);
            const change = row.points.length >= 2 ? row.latest - row.points[0].value : null;
            const atBest = row.latest >= row.best;

            return (
              <li key={row.exerciseSlug} className="flex min-w-0">
                <Card className="w-full">
                  <CardContent className="space-y-3">
                    <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
                      <div className="min-w-0">
                        <p className="font-medium">
                          {exercise?.name ?? row.exerciseSlug}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {row.sessions} {row.sessions === 1 ? 'session' : 'sessions'} ·
                          last {friendlyDay(row.lastPerformed)}
                        </p>
                      </div>

                      <div className="text-right">
                        <p className="tabular-nums">
                          {describe(row.latest, row.metric, row.unit)}
                          {atBest && row.points.length > 1 ? (
                            <span className="ml-2 text-xs text-muted-foreground">
                              best
                            </span>
                          ) : null}
                        </p>
                        {change !== null && Math.abs(change) >= 0.1 ? (
                          <p
                            className={cn(
                              'text-xs tabular-nums',
                              change > 0 ? 'text-foreground' : 'text-muted-foreground',
                            )}
                          >
                            {change > 0 ? '+' : ''}
                            {num(change)} since {friendlyDay(row.points[0].date)}
                          </p>
                        ) : null}
                      </div>
                    </div>

                    {values.length >= 2 ? (
                      <Sparkline
                        values={values}
                        width={520}
                        height={44}
                        className="w-full text-foreground/60"
                        ariaLabel={`${exercise?.name ?? row.exerciseSlug} over ${values.length} sessions`}
                        startLabel={describe(values[0], row.metric, row.unit)}
                        endLabel={describe(row.latest, row.metric, row.unit)}
                      />
                    ) : (
                      <p className="text-xs text-muted-foreground">
                        One session so far — the line appears after the next one.
                      </p>
                    )}
                  </CardContent>
                </Card>
              </li>
            );
          })}
        </ul>
      )}

      {progress.length > 0 ? (
        <p className="pt-6 text-xs text-muted-foreground">
          Weighted lifts are ranked by estimated 1RM (Epley: weight × (1 + reps/30)),
          so a heavier triple and a lighter set of ten stay comparable. Bodyweight
          work is ranked by reps, holds by time.
        </p>
      ) : null}
    </div>
  );
}
