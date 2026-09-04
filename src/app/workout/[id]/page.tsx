import { notFound } from 'next/navigation';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { PageHeader } from '@/components/layout/page-header';
import { ExerciseIllustration } from '@/components/workout/exercise-illustration';
import { ExerciseGuideSheet } from '@/components/workout/exercise-guide-sheet';
import { ExerciseControls } from '@/components/workout/exercise-controls';
import { SetLogger } from '@/components/workout/set-logger';
import { AddExerciseSheet } from '@/components/workout/add-exercise-sheet';
import { RestTimerBar } from '@/components/workout/rest-timer-bar';
import {
  DeleteWorkoutButton,
  FinishWorkoutButton,
} from '@/components/workout/workout-actions';
import { ShareWorkoutDialog } from '@/components/workout/share-workout-dialog';
import { getPersonalRecords, getPrSetIds, getSettings, getWorkout } from '@/lib/queries';
import { getExercise, getFrameUrls } from '@/lib/exercises';
import { EXERCISE_GUIDES } from '@/lib/exercise-guides';
import { friendlyDay } from '@/lib/dates';
import { cn } from '@/lib/utils';

// This page reads the live database on every request. Without this it would
// be prerendered at build time and serve the (empty) build-time snapshot.
export const dynamic = 'force-dynamic';

export default async function WorkoutPage({ params }: PageProps<'/workout/[id]'>) {
  const { id } = await params;

  const [workout, settings, prSetIds, records] = await Promise.all([
    getWorkout(id),
    getSettings(),
    getPrSetIds(),
    getPersonalRecords(),
  ]);

  if (!workout) notFound();

  const done = Boolean(workout.finishedAt);
  const totalSets = workout.exercises.reduce((n, e) => n + e.sets.length, 0);
  const restTimerSec = settings?.restTimerSec ?? 120;

  const exercises = workout.exercises;

  return (
    <div>
      <PageHeader
        title={workout.name ?? 'Workout'}
        description={[
          friendlyDay(workout.date),
          `${exercises.length} ${exercises.length === 1 ? 'exercise' : 'exercises'}`,
          `${totalSets} ${totalSets === 1 ? 'set' : 'sets'}`,
          ...(done ? ['finished'] : []),
        ].join(' · ')}
        action={
          <div className="flex items-center gap-1">
            <ShareWorkoutDialog workoutId={workout.id} />
            <DeleteWorkoutButton workoutId={workout.id} />
          </div>
        }
      />

      <div className="space-y-4">
        {exercises.length === 0 ? (
          <p className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
            No exercises yet.
          </p>
        ) : (
          exercises.map((we, index) => {
            const exercise = getExercise(we.exerciseSlug);

            // The slug is a soft reference into the package. If a future
            // version drops an exercise, show the raw slug rather than crashing
            // the whole workout view.
            if (!exercise) {
              return (
                <Card key={we.id}>
                  <CardContent className="text-sm text-muted-foreground">
                    Unknown exercise{' '}
                    <code className="font-mono">{we.exerciseSlug}</code> — it may
                    have been removed from the exercise package.
                  </CardContent>
                </Card>
              );
            }

            const group = we.supersetGroup;
            const prev = index > 0 ? exercises[index - 1] : null;
            const next = index < exercises.length - 1 ? exercises[index + 1] : null;

            const continuesGroup = group !== null && prev?.supersetGroup === group;
            const groupContinues = group !== null && next?.supersetGroup === group;

            // You rest after finishing a superset round, not between its parts.
            const restAfterSet = !groupContinues;

            const best = records.get(we.exerciseSlug) ?? null;

            return (
              <div key={we.id} className={cn(continuesGroup && '-mt-3')}>
                {group !== null && !continuesGroup ? (
                  <p className="px-1 pb-1.5 text-xs font-medium tracking-wide text-muted-foreground uppercase">
                    Superset
                  </p>
                ) : null}

                <Card
                  className={cn(
                    // A superset reads as one block: square off the joined edges
                    // so the pair looks like a unit rather than two cards.
                    group !== null && 'border-foreground/20',
                    continuesGroup && 'rounded-t-none border-t-0',
                    groupContinues && 'rounded-b-none',
                  )}
                >
                  <CardContent className="space-y-4">
                    {/* Tight gaps and a small illustration on phones: at 375px
                        every pixel here comes out of the exercise name, which
                        was wrapping onto three lines. */}
                    <div className="flex items-start gap-3 sm:gap-4">
                      <ExerciseIllustration
                        exercise={exercise}
                        animate
                        className="w-12 shrink-0 sm:w-20"
                        sizes="80px"
                      />

                      <div className="min-w-0 flex-1 space-y-0.5">
                        {/* Wraps rather than truncates: at 390px the controls
                            leave ~150px here, which cuts "Incline Bench Press"
                            down to "Incline Be…". Two short lines beat a
                            useless one. */}
                        <div className="flex items-start gap-1">
                          <p className="min-w-0 leading-tight font-medium">
                            {exercise.name}
                          </p>
                          <ExerciseGuideSheet
                            exercise={exercise}
                            guide={EXERCISE_GUIDES[exercise.slug]}
                            frameUrls={getFrameUrls(exercise)}
                          />
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {exercise.primaryMuscle} · {exercise.equipment}
                        </p>
                        {best?.e1rm ? (
                          <p className="text-xs text-muted-foreground">
                            Best: {Math.round(best.e1rm)} {best.unit} est. 1RM
                          </p>
                        ) : null}
                      </div>

                      <ExerciseControls
                        id={we.id}
                        workoutId={workout.id}
                        inSuperset={group !== null}
                        canMoveUp={index > 0}
                        canMoveDown={index < exercises.length - 1}
                        isFirst={index === 0}
                      />
                    </div>

                    <Separator />

                    <SetLogger
                      workoutExerciseId={we.id}
                      workoutId={workout.id}
                      exerciseName={exercise.name}
                      exerciseType={exercise.exerciseType}
                      sets={we.sets}
                      defaultUnit={settings?.weightUnit ?? 'kg'}
                      restTimerSec={restTimerSec}
                      restAfterSet={restAfterSet}
                      targetSets={we.targetSets}
                      targetReps={we.targetReps}
                      prSetIds={[...prSetIds]}
                      currentBest={
                        best
                          ? {
                              e1rm: best.e1rm,
                              reps: best.reps,
                              durationSec: best.durationSec,
                            }
                          : null
                      }
                    />
                  </CardContent>
                </Card>
              </div>
            );
          })
        )}

        <AddExerciseSheet
          workoutId={workout.id}
          selectedSlugs={exercises.map((e) => e.exerciseSlug)}
        />

        {!done ? <FinishWorkoutButton workoutId={workout.id} /> : null}
      </div>

      <RestTimerBar />
    </div>
  );
}
