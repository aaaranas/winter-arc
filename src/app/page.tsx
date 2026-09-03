import Link from 'next/link';
import { ArrowRight, Dumbbell, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { PageHeader } from '@/components/layout/page-header';
import { StartRoutineDayButton } from '@/components/workout/start-routine-day-button';
import { startWorkout } from '@/lib/actions/workouts';
import {
  getActiveWorkout,
  getDayTotals,
  getSettings,
  getTodayWorkouts,
} from '@/lib/queries';
import { getRoutine } from '@/lib/routines';
import { friendlyDay, todayKey } from '@/lib/dates';
import { getExercise } from '@/lib/exercises';
import { grams, kcal } from '@/lib/format';

// This page reads the live database on every request. Without this it would
// be prerendered at build time and serve the (empty) build-time snapshot.
export const dynamic = 'force-dynamic';

export default async function TodayPage() {
  const [active, todayWorkouts, settings, { totals }] = await Promise.all([
    getActiveWorkout(),
    getTodayWorkouts(),
    getSettings(),
    getDayTotals(todayKey()),
  ]);

  const finished = todayWorkouts.filter((w) => w.finishedAt);
  const routine = getRoutine(settings?.activeRoutineKey);

  return (
    <div>
      <PageHeader
        title={friendlyDay(new Date())}
        description="Log a workout, or what you ate."
      />

      {/* Two columns from lg up so the desktop viewport is used rather than
          leaving a tall empty gutter beside a phone-width column. */}
      <div className="grid gap-8 lg:grid-cols-2 lg:gap-x-10">
        <div className="space-y-8">
          {active ? (
            <section className="space-y-3">
              <SectionLabel>In progress</SectionLabel>
              <Link href={`/workout/${active.id}`} className="block">
                <Card className="transition-colors hover:bg-accent/40">
                  <CardContent className="flex items-center gap-4">
                    <div className="flex size-10 shrink-0 items-center justify-center rounded-md border">
                      <Dumbbell className="size-4" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="truncate font-medium">
                        {active.name ?? 'Untitled workout'}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {active.exercises.length}{' '}
                        {active.exercises.length === 1 ? 'exercise' : 'exercises'}
                        {' · '}
                        {active.exercises.reduce((n, e) => n + e.sets.length, 0)} sets
                      </p>
                    </div>
                    <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                  </CardContent>
                </Card>
              </Link>
            </section>
          ) : null}

          {routine ? (
            <section className="space-y-3">
              <SectionLabel>{routine.name}</SectionLabel>
              <ul className="space-y-2">
                {routine.days.map((day) => (
                  <li key={day.key}>
                    <Card>
                      <CardContent className="flex items-center gap-3 py-3">
                        <div className="min-w-0 flex-1">
                          <p className="truncate text-sm font-medium">{day.name}</p>
                          <p className="truncate text-xs text-muted-foreground">
                            {day.focus} · {day.exercises.length} exercises
                          </p>
                        </div>
                        <StartRoutineDayButton
                          routineKey={routine.key}
                          dayKey={day.key}
                        />
                      </CardContent>
                    </Card>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section className="space-y-3">
              <SectionLabel>Routines</SectionLabel>
              <Card>
                <CardContent className="space-y-3">
                  <p className="text-sm text-muted-foreground">
                    Follow a split — PPL, Upper/Lower, Arnold or PHUL — and its
                    days appear here ready to start.
                  </p>
                  <Button asChild variant="outline" size="sm">
                    <Link href="/routines">
                      <Play className="size-3.5" />
                      Browse routines
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            </section>
          )}

          <section className="space-y-3">
            <SectionLabel>Freestyle</SectionLabel>
            <form action={startWorkout} className="flex gap-2">
              <Input name="name" placeholder="Push day, legs, …" autoComplete="off" />
              <Button type="submit">Start</Button>
            </form>
          </section>
        </div>

        <div className="space-y-8">
          <section className="space-y-3">
            <SectionLabel>Today&rsquo;s macros</SectionLabel>
            <Link href="/food" className="block">
              <Card className="transition-colors hover:bg-accent/40">
                <CardContent className="grid grid-cols-4 gap-2 text-center">
                  <Stat label="kcal" value={kcal(totals.calories)} target={settings?.calorieTarget} />
                  <Stat label="protein" value={grams(totals.proteinG)} target={settings?.proteinTarget} />
                  <Stat label="carbs" value={grams(totals.carbsG)} target={settings?.carbsTarget} />
                  <Stat label="fat" value={grams(totals.fatG)} target={settings?.fatTarget} />
                </CardContent>
              </Card>
            </Link>
            {!settings?.calorieTarget ? (
              <p className="text-xs text-muted-foreground">
                No targets yet —{' '}
                <Link href="/plan" className="underline underline-offset-4">
                  build a plan
                </Link>{' '}
                from your height and weight.
              </p>
            ) : null}
          </section>

          {finished.length > 0 ? (
            <section className="space-y-3">
              <SectionLabel>Finished today</SectionLabel>
              <ul className="space-y-2">
                {finished.map((w) => (
                  <li key={w.id}>
                    <Link
                      href={`/workout/${w.id}`}
                      className="flex items-center justify-between gap-3 rounded-lg border px-4 py-3 text-sm transition-colors hover:bg-accent/40"
                    >
                      <span className="min-w-0 truncate">
                        {w.name ?? 'Untitled workout'}
                        <span className="ml-2 text-muted-foreground">
                          {w.exercises
                            .map((e) => getExercise(e.exerciseSlug)?.name)
                            .filter(Boolean)
                            .slice(0, 2)
                            .join(', ')}
                        </span>
                      </span>
                      <ArrowRight className="size-4 shrink-0 text-muted-foreground" />
                    </Link>
                  </li>
                ))}
              </ul>
            </section>
          ) : null}
        </div>
      </div>
    </div>
  );
}

function SectionLabel({ children }: { children: React.ReactNode }) {
  return (
    <h2 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
      {children}
    </h2>
  );
}

function Stat({
  label,
  value,
  target,
}: {
  label: string;
  value: string;
  target?: number | null;
}) {
  return (
    <div className="space-y-0.5">
      <p className="text-lg font-semibold tabular-nums">{value}</p>
      <p className="text-[11px] text-muted-foreground">
        {target ? `${label} / ${Math.round(target)}` : label}
      </p>
    </div>
  );
}
