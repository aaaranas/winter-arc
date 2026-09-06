import 'server-only';
import { cache } from 'react';
import { db } from '@/lib/db';
import { requireUserId } from '@/lib/user';
import { visibleFoods } from '@/lib/food-scope';
import { fromDayKey, toDayStart } from '@/lib/dates';
import { scale, sum, type Macros } from '@/lib/macros';

export async function getSettings() {
  const userId = await requireUserId();
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
    where: { userId: await requireUserId(), finishedAt: null },
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
    where: { userId: await requireUserId() },
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
    where: { userId: await requireUserId(), date: today },
    orderBy: { startedAt: 'desc' },
    include: { exercises: { include: { sets: true } } },
  });
}

export type DailyLogWithTotals = {
  entries: Awaited<ReturnType<typeof getDailyLogEntries>>;
  totals: Macros;
};

export async function getDailyLogEntries(dayKey: string) {
  const userId = await requireUserId();
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
  const userId = await requireUserId();
  const q = query.trim().toLowerCase();

  const foods = await db.foodItem.findMany({
    where: {
      ...visibleFoods(userId),
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
  const userId = await requireUserId();
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
 *
 * Pass the slugs you actually need. The workout screen only shows PRs for the
 * exercises on it, and loading a whole training history to badge seven of them
 * gets slower every week you train. Omitting slugs still loads everything, which
 * is what the progression view wants.
 */
const loadRecords = cache(
  async (slugKey: string): Promise<Map<string, PersonalRecord>> => {
    const slugs = slugKey ? slugKey.split(',') : null;

    const sets = await db.exerciseSet.findMany({
      where: {
        workoutExercise: {
          ...(slugs ? { exerciseSlug: { in: slugs } } : {}),
          workout: { userId: await requireUserId() },
        },
      },
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
  },
);

/**
 * Memoised per render via React cache(), keyed on a sorted slug string rather
 * than the array itself — cache() compares arguments by identity, and a fresh
 * array each call would never hit. This is what stops the workout page loading
 * the same history twice for records and for set badges.
 */
export function getPersonalRecords(
  slugs?: string[],
): Promise<Map<string, PersonalRecord>> {
  return loadRecords(slugs?.length ? [...slugs].sort().join(',') : '');
}

function beats(a: PersonalRecord, b: PersonalRecord): boolean {
  if (a.e1rm !== null || b.e1rm !== null) return (a.e1rm ?? 0) > (b.e1rm ?? 0);
  if (a.reps !== null || b.reps !== null) return (a.reps ?? 0) > (b.reps ?? 0);
  if (a.durationSec !== null || b.durationSec !== null)
    return (a.durationSec ?? 0) > (b.durationSec ?? 0);
  return (a.distanceM ?? 0) > (b.distanceM ?? 0);
}

/** Set ids that currently hold a personal record, for badging. */
export async function getPrSetIds(slugs?: string[]): Promise<Set<string>> {
  const records = await getPersonalRecords(slugs);
  return new Set([...records.values()].map((r) => r.setId));
}


// -------------------------------------------------------------- body weight

export type WeightTrend = {
  entries: { id: string; date: Date; weightKg: number; note: string | null }[];
  /** Most recent single reading. */
  latest: number | null;
  /**
   * Seven-day average, which is the number worth acting on. Day-to-day weight
   * swings by a kilo or more on water and food alone, so a single reading is
   * noise; the average is the signal.
   */
  trend: number | null;
  /** Trend now minus the trend a week earlier, in kg. Null until there is
      enough history for both windows to be meaningful. */
  weeklyChange: number | null;
};

export async function getWeightTrend(days = 90): Promise<WeightTrend> {
  const since = new Date(Date.now() - days * 86_400_000);

  const entries = await db.bodyWeightEntry.findMany({
    where: { userId: await requireUserId(), date: { gte: since } },
    orderBy: { date: 'desc' },
    select: { id: true, date: true, weightKg: true, note: true },
  });

  if (entries.length === 0) {
    return { entries, latest: null, trend: null, weeklyChange: null };
  }

  const average = (rows: typeof entries) =>
    rows.length ? rows.reduce((n, r) => n + r.weightKg, 0) / rows.length : null;

  const now = Date.now();
  const within = (fromDaysAgo: number, toDaysAgo: number) =>
    entries.filter((e) => {
      const age = (now - e.date.getTime()) / 86_400_000;
      return age >= fromDaysAgo && age < toDaysAgo;
    });

  const thisWeek = average(within(0, 7));
  const lastWeek = average(within(7, 14));

  return {
    entries,
    latest: entries[0].weightKg,
    trend: thisWeek,
    // Only meaningful when both windows actually have readings.
    weeklyChange:
      thisWeek !== null && lastWeek !== null
        ? Number((thisWeek - lastWeek).toFixed(2))
        : null,
  };
}

/**
 * The weight a macro plan should be built from.
 *
 * Prefers the seven-day trend over Settings.weightKg, so the plan tracks what
 * the scale is actually doing instead of a number typed in once and forgotten.
 * Falls back to the stored value until there is history.
 */
export async function getPlanningWeight(): Promise<{
  weightKg: number | null;
  source: 'trend' | 'stored' | 'none';
}> {
  const [{ trend }, settings] = await Promise.all([getWeightTrend(14), getSettings()]);
  if (trend !== null) return { weightKg: Number(trend.toFixed(1)), source: 'trend' };
  if (settings?.weightKg) return { weightKg: settings.weightKg, source: 'stored' };
  return { weightKg: null, source: 'none' };
}

// ------------------------------------------------------- last time performed

export type LastPerformance = {
  weight: number | null;
  reps: number | null;
  unit: string;
  durationSec: number | null;
  distanceM: number | null;
  date: Date;
};

/**
 * The top set from the last time each exercise was performed, excluding the
 * workout being viewed.
 *
 * This is what makes progressive overload possible without the user
 * remembering anything: the logger can prefill last session's numbers and
 * suggest the next increment, instead of showing empty boxes to fill from
 * memory between sets.
 *
 * Bounded to the 400 most recent sets across the requested exercises — enough
 * to find the previous session for each, without the query growing with
 * training history the way the old PR lookup did.
 */
export async function getLastPerformance(
  slugs: string[],
  excludeWorkoutId?: string,
): Promise<Map<string, LastPerformance>> {
  if (slugs.length === 0) return new Map();

  const sets = await db.exerciseSet.findMany({
    where: {
      workoutExercise: {
        exerciseSlug: { in: slugs },
        workout: {
          userId: await requireUserId(),
          ...(excludeWorkoutId ? { id: { not: excludeWorkoutId } } : {}),
        },
      },
    },
    include: {
      workoutExercise: { select: { exerciseSlug: true, workoutId: true } },
    },
    orderBy: { createdAt: 'desc' },
    take: 400,
  });

  const out = new Map<string, LastPerformance>();
  // Which workout counted as "last session" for each slug, so every set from
  // that session is considered but earlier ones are not.
  const sessionForSlug = new Map<string, string>();

  for (const set of sets) {
    const slug = set.workoutExercise.exerciseSlug;
    const session = sessionForSlug.get(slug);

    if (session === undefined) {
      sessionForSlug.set(slug, set.workoutExercise.workoutId);
    } else if (session !== set.workoutExercise.workoutId) {
      continue; // older session; the previous one already won
    }

    const current = out.get(slug);
    const better =
      !current ||
      (estimate1Rm(set.weight, set.reps) ?? 0) >
        (estimate1Rm(current.weight, current.reps) ?? 0);

    if (better) {
      out.set(slug, {
        weight: set.weight,
        reps: set.reps,
        unit: set.unit,
        durationSec: set.durationSec,
        distanceM: set.distanceM,
        date: set.createdAt,
      });
    }
  }

  return out;
}

// ----------------------------------------------------------------- progress

export type ExerciseProgress = {
  exerciseSlug: string;
  /** One point per session: the best estimated 1RM (or reps/duration) that day. */
  points: { date: Date; value: number }[];
  best: number;
  latest: number;
  /** How the value should be read, since not every exercise is weight x reps. */
  metric: 'e1rm' | 'reps' | 'duration' | 'distance';
  unit: string;
  sessions: number;
  lastPerformed: Date;
};

/**
 * Session-by-session progress for every exercise the user has actually trained.
 *
 * Months of logging are worth little if there is no way to see the line go up;
 * this is the payoff for all that data entry.
 *
 * Each session contributes one point — its best set — so a heavy day and a
 * light day are comparable rather than a scatter of every set ever done.
 * Bounded to the last `days` so the query does not grow without limit.
 */
export async function getExerciseProgress(days = 365): Promise<ExerciseProgress[]> {
  const since = new Date(Date.now() - days * 86_400_000);

  const sets = await db.exerciseSet.findMany({
    where: {
      workoutExercise: {
        workout: { userId: await requireUserId(), date: { gte: since } },
      },
    },
    include: {
      workoutExercise: {
        select: {
          exerciseSlug: true,
          workoutId: true,
          workout: { select: { date: true } },
        },
      },
    },
    orderBy: { createdAt: 'asc' },
  });

  // slug -> workoutId -> best value that session
  const bySlug = new Map<
    string,
    { metric: ExerciseProgress['metric']; unit: string; sessions: Map<string, { date: Date; value: number }> }
  >();

  for (const set of sets) {
    const slug = set.workoutExercise.exerciseSlug;
    const workoutId = set.workoutExercise.workoutId;
    const date = set.workoutExercise.workout.date;

    const e1rm = estimate1Rm(set.weight, set.reps);
    let value: number | null = e1rm;
    let metric: ExerciseProgress['metric'] = 'e1rm';

    if (value === null && set.reps !== null) {
      value = set.reps;
      metric = 'reps';
    }
    if (value === null && set.durationSec !== null) {
      value = set.durationSec;
      metric = 'duration';
    }
    if (value === null && set.distanceM !== null) {
      value = set.distanceM;
      metric = 'distance';
    }
    if (value === null) continue;

    const entry =
      bySlug.get(slug) ?? { metric, unit: set.unit, sessions: new Map() };
    const existing = entry.sessions.get(workoutId);
    if (!existing || value > existing.value) {
      entry.sessions.set(workoutId, { date, value: Number(value.toFixed(1)) });
    }
    bySlug.set(slug, entry);
  }

  const out: ExerciseProgress[] = [];

  for (const [exerciseSlug, entry] of bySlug) {
    const points = [...entry.sessions.values()].sort(
      (a, b) => a.date.getTime() - b.date.getTime(),
    );
    if (points.length === 0) continue;

    out.push({
      exerciseSlug,
      points,
      best: Math.max(...points.map((p) => p.value)),
      latest: points[points.length - 1].value,
      metric: entry.metric,
      unit: entry.unit,
      sessions: points.length,
      lastPerformed: points[points.length - 1].date,
    });
  }

  // Most recently trained first — that is what you want to check on.
  return out.sort((a, b) => b.lastPerformed.getTime() - a.lastPerformed.getTime());
}
