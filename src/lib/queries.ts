import 'server-only';
import { db } from '@/lib/db';
import { currentUserId } from '@/lib/user';
import { fromDayKey, toDayStart } from '@/lib/dates';
import { scale, sum, type Macros } from '@/lib/macros';

export async function getSettings() {
  const userId = currentUserId();
  return db.settings.findUnique({ where: { userId } });
}

export async function getWorkout(id: string) {
  return db.workout.findUnique({
    where: { id },
    include: {
      exercises: {
        orderBy: { position: 'asc' },
        include: { sets: { orderBy: { position: 'asc' } } },
      },
    },
  });
}

/** The most recent workout that hasn't been finished yet, if any. */
export async function getActiveWorkout() {
  return db.workout.findFirst({
    where: { userId: currentUserId(), finishedAt: null },
    orderBy: { startedAt: 'desc' },
    include: {
      exercises: {
        orderBy: { position: 'asc' },
        include: { sets: true },
      },
    },
  });
}

export async function getWorkoutHistory(limit = 50) {
  return db.workout.findMany({
    where: { userId: currentUserId() },
    orderBy: [{ date: 'desc' }, { startedAt: 'desc' }],
    take: limit,
    include: {
      exercises: {
        orderBy: { position: 'asc' },
        include: { sets: true },
      },
    },
  });
}

export async function getTodayWorkouts() {
  const today = toDayStart(new Date());
  return db.workout.findMany({
    where: { userId: currentUserId(), date: today },
    orderBy: { startedAt: 'desc' },
    include: { exercises: { include: { sets: true } } },
  });
}

export type DailyLogWithTotals = {
  entries: Awaited<ReturnType<typeof getDailyLogEntries>>;
  totals: Macros;
};

export async function getDailyLogEntries(dayKey: string) {
  const userId = currentUserId();
  const date = fromDayKey(dayKey);

  const log = await db.dailyLog.findUnique({
    where: { userId_date: { userId, date } },
    include: {
      entries: { orderBy: { loggedAt: 'asc' }, include: { foodItem: true } },
    },
  });

  return log?.entries ?? [];
}

export async function getDayTotals(dayKey: string): Promise<DailyLogWithTotals> {
  const entries = await getDailyLogEntries(dayKey);
  const totals = sum(entries.map((e) => scale(e.foodItem, e.quantity)));
  return { entries, totals };
}

/**
 * Food search. SQLite has no case-insensitive `contains` through Prisma's
 * `mode` option, so we lowercase both sides and compare — fine at this dataset
 * size, and it keeps the query in the database rather than loading every row.
 */
export async function searchFoods(query: string, category?: string) {
  const userId = currentUserId();
  const q = query.trim().toLowerCase();

  const foods = await db.foodItem.findMany({
    where: {
      userId,
      archived: false,
      ...(category && category !== 'ALL' ? { category } : {}),
    },
    orderBy: [{ name: 'asc' }],
    take: 400,
  });

  if (!q) return foods.slice(0, 60);

  return foods
    .filter(
      (f) =>
        f.name.toLowerCase().includes(q) ||
        (f.brand ?? '').toLowerCase().includes(q),
    )
    .slice(0, 60);
}

export async function getRecentFoods(limit = 8) {
  const userId = currentUserId();
  const entries = await db.logEntry.findMany({
    where: { dailyLog: { userId } },
    orderBy: { loggedAt: 'desc' },
    take: 40,
    include: { foodItem: true },
  });

  const seen = new Set<string>();
  const out: typeof entries[number]['foodItem'][] = [];
  for (const e of entries) {
    if (seen.has(e.foodItemId) || e.foodItem.archived) continue;
    seen.add(e.foodItemId);
    out.push(e.foodItem);
    if (out.length >= limit) break;
  }
  return out;
}

// ------------------------------------------------------------------ records

export type PersonalRecord = {
  exerciseSlug: string;
  setId: string;
  weight: number | null;
  reps: number | null;
  unit: string;
  /** Epley estimate: weight x (1 + reps/30). Used to rank weighted sets. */
  e1rm: number | null;
  durationSec: number | null;
  distanceM: number | null;
  achievedAt: Date;
};

/** Epley. Returns null for sets that are not weight x reps. */
export function estimate1Rm(
  weight: number | null,
  reps: number | null,
): number | null {
  if (weight === null || weight <= 0) return null;
  if (reps === null || reps <= 0) return null;
  return weight * (1 + reps / 30);
}

/**
 * The best set ever logged for each exercise, keyed by slug.
 *
 * Derived from the sets themselves rather than stored in its own table: a PR is
 * a fact about your history, so computing it can never drift out of sync with
 * the sets, and deleting a set correctly gives the record back to the runner-up.
 *
 * Ranking is by estimated 1RM for weighted work, reps for bodyweight, duration
 * for holds and distance for cardio — so a plank and a bench press are each
 * judged on the thing that actually improves.
 */
export async function getPersonalRecords(): Promise<Map<string, PersonalRecord>> {
  const sets = await db.exerciseSet.findMany({
    where: { workoutExercise: { workout: { userId: currentUserId() } } },
    include: { workoutExercise: { select: { exerciseSlug: true } } },
    orderBy: { createdAt: 'asc' },
  });

  const best = new Map<string, PersonalRecord>();

  for (const set of sets) {
    const slug = set.workoutExercise.exerciseSlug;
    const candidate: PersonalRecord = {
      exerciseSlug: slug,
      setId: set.id,
      weight: set.weight,
      reps: set.reps,
      unit: set.unit,
      e1rm: estimate1Rm(set.weight, set.reps),
      durationSec: set.durationSec,
      distanceM: set.distanceM,
      achievedAt: set.createdAt,
    };

    const current = best.get(slug);
    if (!current || beats(candidate, current)) best.set(slug, candidate);
  }

  return best;
}

function beats(a: PersonalRecord, b: PersonalRecord): boolean {
  if (a.e1rm !== null || b.e1rm !== null) return (a.e1rm ?? 0) > (b.e1rm ?? 0);
  if (a.reps !== null || b.reps !== null) return (a.reps ?? 0) > (b.reps ?? 0);
  if (a.durationSec !== null || b.durationSec !== null)
    return (a.durationSec ?? 0) > (b.durationSec ?? 0);
  return (a.distanceM ?? 0) > (b.distanceM ?? 0);
}

/** Set ids that currently hold a personal record, for badging. */
export async function getPrSetIds(): Promise<Set<string>> {
  const records = await getPersonalRecords();
  return new Set([...records.values()].map((r) => r.setId));
}
