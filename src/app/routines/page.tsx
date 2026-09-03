import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { PageHeader } from '@/components/layout/page-header';
import { RoutineCard } from '@/components/workout/routine-card';
import { ROUTINES } from '@/lib/routines';
import { getSettings } from '@/lib/queries';
import { getExercise } from '@/lib/exercises';

// This page reads the live database on every request. Without this it would
// be prerendered at build time and serve the (empty) build-time snapshot.
export const dynamic = 'force-dynamic';

export const metadata = { title: 'Routines' };

export default async function RoutinesPage() {
  const settings = await getSettings();
  const active = settings?.activeRoutineKey ?? null;

  return (
    <div>
      <PageHeader
        title="Routines"
        description="Pick a split, then start any of its days. Starting a day copies its exercises into a new workout you can edit."
      />

      <div className="space-y-4">
        {ROUTINES.map((routine) => (
          <RoutineCard
            key={routine.key}
            routine={{
              key: routine.key,
              name: routine.name,
              summary: routine.summary,
              daysPerWeek: routine.daysPerWeek,
              bestFor: routine.bestFor,
              days: routine.days.map((day) => ({
                key: day.key,
                name: day.name,
                focus: day.focus,
                exerciseCount: day.exercises.length,
                supersetCount: new Set(
                  day.exercises.map((e) => e.superset).filter(Boolean),
                ).size,
                exercises: day.exercises.map((e) => ({
                  slug: e.slug,
                  name: getExercise(e.slug)?.name ?? e.slug,
                  sets: e.sets,
                  reps: e.reps,
                  superset: e.superset ?? null,
                })),
              })),
            }}
            isActive={active === routine.key}
          />
        ))}

        <Card>
          <CardContent className="space-y-2 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="font-normal">
                Note
              </Badge>
              <span className="font-medium text-foreground">
                Templates are a starting point
              </span>
            </div>
            <p>
              Starting a day copies its exercises into a fresh workout. From
              there it is yours — add, remove, reorder or supersets as you like,
              and none of it changes the template or any workout you already
              logged.
            </p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
