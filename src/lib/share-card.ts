import 'server-only';
import { db } from '@/lib/db';
import { getExercise } from '@/lib/exercises';
import { estimate1Rm } from '@/lib/queries';
import { friendlyDay } from '@/lib/dates';

/**
 * The numbers a share card shows, assembled once so the two layouts cannot
 * disagree about the same workout.
 */

export type ShareCardData = {
  title: string;
  dateLabel: string;
  durationLabel: string | null;
  totalSets: number;
  /** Sum of weight x reps across the session, in the session's unit. */
  volume: number;
  unit: string;
  exercises: { name: string; sets: number; best: string | null; isPr: boolean }[];
  prCount: number;
};

/**
 * Returns null when the workout does not exist OR is not owned by `userId`.
 *
 * Both cases collapse to null on purpose: a "not yours" response that differs
 * from "not found" tells a stranger which workout ids are real.
 */
export async function getShareCardData(
  workoutId: string,
  userId: string,
): Promise<ShareCardData | null> {
  const workout = await db.workout.findFirst({
    where: { id: workoutId, userId },
    include: {
      exercises: {
        orderBy: { position: 'asc' },
        include: { sets: { orderBy: { position: 'asc' } } },
      },
    },
  });

  if (!workout) return null;

  // Personal bests, to mark which of today's sets were records. Scoped to the
  // exercises in THIS workout — the all-time best for a lift you did not do
  // today cannot change what this card says, and loading them made the query
  // grow with every session ever logged.
  const slugs = [...new Set(workout.exercises.map((we) => we.exerciseSlug))];
  const allSets = await db.exerciseSet.findMany({
    where: {
      workoutExercise: {
        exerciseSlug: { in: slugs },
        workout: { userId },
      },
    },
    include: { workoutExercise: { select: { exerciseSlug: true } } },
  });

  const bestBySlug = new Map<string, number>();
  for (const set of allSets) {
    const slug = set.workoutExercise.exerciseSlug;
    const score = estimate1Rm(set.weight, set.reps) ?? set.reps ?? set.durationSec ?? 0;
    if (score > (bestBySlug.get(slug) ?? 0)) bestBySlug.set(slug, score);
  }

  const unit = workout.exercises[0]?.sets[0]?.unit ?? 'kg';
  let totalSets = 0;
  let volume = 0;
  let prCount = 0;

  // Only exercises with at least one logged set reach the card. A routine day
  // is created with its full plan, so including untouched exercises would
  // advertise work that was not done.
  const performed = workout.exercises.filter((we) => we.sets.length > 0);

  const exercises = performed.map((we) => {
    const exercise = getExercise(we.exerciseSlug);
    totalSets += we.sets.length;

    let topWeight = 0;
    let topReps = 0;
    let bestScore = 0;

    for (const set of we.sets) {
      if (set.weight && set.reps) volume += set.weight * set.reps;
      const score = estimate1Rm(set.weight, set.reps) ?? set.reps ?? set.durationSec ?? 0;
      if (score > bestScore) {
        bestScore = score;
        topWeight = set.weight ?? 0;
        topReps = set.reps ?? 0;
      }
    }

    // A PR when this session's best for the exercise equals the all-time best.
    const isPr = bestScore > 0 && bestScore >= (bestBySlug.get(we.exerciseSlug) ?? 0);
    if (isPr) prCount += 1;

    const best =
      topWeight && topReps
        ? `${trim(topWeight)} ${unit} × ${topReps}`
        : we.sets.length > 0
          ? `${we.sets.length} sets`
          : null;

    return {
      name: exercise?.name ?? we.exerciseSlug,
      sets: we.sets.length,
      best,
      isPr,
    };
  });

  const durationLabel =
    workout.startedAt && workout.finishedAt
      ? formatMinutes(
          Math.round(
            (workout.finishedAt.getTime() - workout.startedAt.getTime()) / 60000,
          ),
        )
      : null;

  return {
    title: workout.name ?? 'Workout',
    dateLabel: friendlyDay(workout.date),
    durationLabel,
    totalSets,
    volume: Math.round(volume),
    unit,
    exercises,
    prCount,
  };
}

function trim(n: number): string {
  return Number(n.toFixed(1)).toString();
}

function formatMinutes(mins: number): string {
  if (mins < 60) return `${mins} min`;
  const h = Math.floor(mins / 60);
  const m = mins % 60;
  return m === 0 ? `${h} hr` : `${h} hr ${m} min`;
}
