import { getExercise } from '@/lib/exercises';

/**
 * Built-in training splits.
 *
 * These are app content, not user data, so they live in code rather than the
 * database: you pick one in Settings, and starting a day copies its exercises
 * into a fresh Workout that you then own and can edit freely. Changing a
 * template later never rewrites workouts you have already logged.
 *
 * Every `slug` must exist in @bryllim/workout-guide. `npm run check:routines`
 * validates that and fails loudly, because a bad slug would otherwise render as
 * a blank card only once you got to the gym.
 */

export type RoutineExercise = {
  slug: string;
  sets: number;
  /** Free text so "3-5", "8-12" and "AMRAP" all work. */
  reps: string;
  /**
   * Exercises in a day that share a superset letter are performed back to back
   * with no rest in between. The rest timer waits until the last one is logged.
   */
  superset?: string;
};

export type RoutineDay = {
  key: string;
  name: string;
  focus: string;
  exercises: RoutineExercise[];
};

export type Routine = {
  key: string;
  name: string;
  /** One line, shown when choosing. */
  summary: string;
  daysPerWeek: string;
  bestFor: string;
  days: RoutineDay[];
};

export const ROUTINES: Routine[] = [
  {
    key: 'ppl',
    name: 'Push / Pull / Legs',
    summary:
      'Three sessions rotating push, pull and legs. Run once through for 3 days a week, twice for 6.',
    daysPerWeek: '3–6 days',
    bestFor: 'The default hypertrophy split. Scales with how often you can train.',
    days: [
      {
        key: 'push',
        name: 'Push',
        focus: 'Chest · Shoulders · Triceps',
        exercises: [
          { slug: 'bench-press', sets: 4, reps: '6-8' },
          { slug: 'incline-dumbbell-press', sets: 3, reps: '8-12' },
          { slug: 'overhead-press', sets: 3, reps: '6-10' },
          { slug: 'cable-fly', sets: 3, reps: '12-15' },
          { slug: 'lateral-raise', sets: 4, reps: '12-20' },
          { slug: 'rope-tricep-pushdown', sets: 3, reps: '10-15' },
          { slug: 'overhead-tricep-extension', sets: 3, reps: '10-15' },
        ],
      },
      {
        key: 'pull',
        name: 'Pull',
        focus: 'Back · Biceps · Rear delts',
        exercises: [
          { slug: 'pull-up', sets: 4, reps: 'AMRAP' },
          { slug: 'barbell-row', sets: 4, reps: '6-10' },
          { slug: 'seated-row', sets: 3, reps: '10-12' },
          { slug: 'straight-arm-pulldown', sets: 3, reps: '12-15' },
          { slug: 'face-pull', sets: 3, reps: '15-20' },
          { slug: 'bicep-curl', sets: 3, reps: '10-12' },
          { slug: 'hammer-curl', sets: 3, reps: '10-12' },
        ],
      },
      {
        key: 'legs',
        name: 'Legs',
        focus: 'Quads · Hamstrings · Glutes · Calves',
        exercises: [
          { slug: 'squat', sets: 4, reps: '5-8' },
          { slug: 'romanian-deadlift', sets: 3, reps: '8-12' },
          { slug: 'leg-press', sets: 3, reps: '10-15' },
          { slug: 'leg-curl', sets: 3, reps: '10-15' },
          { slug: 'leg-extension', sets: 3, reps: '12-15' },
          { slug: 'standing-calf-raise', sets: 4, reps: '10-15' },
          { slug: 'hanging-leg-raise', sets: 3, reps: '10-15' },
        ],
      },
    ],
  },

  {
    key: 'upper-lower',
    name: 'Upper / Lower',
    summary:
      'Four sessions alternating upper and lower body, with a heavier day and a lighter day of each.',
    daysPerWeek: '4 days',
    bestFor: 'Hitting everything twice a week without six gym trips.',
    days: [
      {
        key: 'upper-a',
        name: 'Upper A',
        focus: 'Heavy pressing and rowing',
        exercises: [
          { slug: 'bench-press', sets: 4, reps: '5-8' },
          { slug: 'barbell-row', sets: 4, reps: '6-8' },
          { slug: 'overhead-press', sets: 3, reps: '6-10' },
          { slug: 'lat-pulldown', sets: 3, reps: '10-12' },
          { slug: 'lateral-raise', sets: 3, reps: '12-20' },
          { slug: 'ez-bar-curl', sets: 3, reps: '10-12' },
          { slug: 'tricep-pushdown', sets: 3, reps: '10-15' },
        ],
      },
      {
        key: 'lower-a',
        name: 'Lower A',
        focus: 'Squat-led',
        exercises: [
          { slug: 'squat', sets: 4, reps: '5-8' },
          { slug: 'romanian-deadlift', sets: 3, reps: '8-10' },
          { slug: 'leg-press', sets: 3, reps: '10-15' },
          { slug: 'seated-leg-curl', sets: 3, reps: '10-15' },
          { slug: 'standing-calf-raise', sets: 4, reps: '10-15' },
          { slug: 'plank', sets: 3, reps: '45-60s' },
        ],
      },
      {
        key: 'upper-b',
        name: 'Upper B',
        focus: 'Volume and isolation',
        exercises: [
          { slug: 'incline-dumbbell-press', sets: 4, reps: '8-12' },
          { slug: 'seated-row', sets: 4, reps: '8-12' },
          { slug: 'seated-dumbbell-press', sets: 3, reps: '10-12' },
          { slug: 'close-grip-lat-pulldown', sets: 3, reps: '10-12' },
          { slug: 'pec-deck', sets: 3, reps: '12-15' },
          { slug: 'incline-dumbbell-curl', sets: 3, reps: '10-12' },
          { slug: 'rope-tricep-pushdown', sets: 3, reps: '12-15' },
        ],
      },
      {
        key: 'lower-b',
        name: 'Lower B',
        focus: 'Hinge-led',
        exercises: [
          { slug: 'deadlift', sets: 3, reps: '3-5' },
          { slug: 'front-squat', sets: 3, reps: '6-10' },
          { slug: 'bulgarian-split-squat', sets: 3, reps: '8-12' },
          { slug: 'leg-extension', sets: 3, reps: '12-15' },
          { slug: 'lying-leg-curl', sets: 3, reps: '10-15' },
          { slug: 'seated-calf-raise', sets: 4, reps: '12-20' },
        ],
      },
    ],
  },

  {
    key: 'arnold',
    name: 'Arnold Split',
    summary:
      'Chest with back, shoulders with arms, then legs — run twice a week. Built around supersets.',
    daysPerWeek: '6 days',
    bestFor: 'High volume and short rests. Demanding; it assumes you can recover.',
    days: [
      {
        key: 'chest-back',
        name: 'Chest & Back',
        focus: 'Antagonist supersets',
        exercises: [
          { slug: 'bench-press', sets: 4, reps: '8-10', superset: 'A' },
          { slug: 'barbell-row', sets: 4, reps: '8-10', superset: 'A' },
          { slug: 'incline-bench-press', sets: 3, reps: '10-12', superset: 'B' },
          { slug: 'pull-up', sets: 3, reps: 'AMRAP', superset: 'B' },
          { slug: 'dumbbell-fly', sets: 3, reps: '12-15', superset: 'C' },
          { slug: 'seated-row', sets: 3, reps: '12-15', superset: 'C' },
          { slug: 'chest-dip', sets: 3, reps: 'AMRAP' },
        ],
      },
      {
        key: 'shoulders-arms',
        name: 'Shoulders & Arms',
        focus: 'Delts, then biceps against triceps',
        exercises: [
          { slug: 'overhead-press', sets: 4, reps: '8-10' },
          { slug: 'arnold-press', sets: 3, reps: '10-12' },
          { slug: 'lateral-raise', sets: 4, reps: '12-15', superset: 'A' },
          { slug: 'rear-delt-fly', sets: 4, reps: '12-15', superset: 'A' },
          { slug: 'ez-bar-curl', sets: 3, reps: '10-12', superset: 'B' },
          { slug: 'skull-crusher', sets: 3, reps: '10-12', superset: 'B' },
          { slug: 'concentration-curl', sets: 3, reps: '12-15', superset: 'C' },
          { slug: 'rope-tricep-pushdown', sets: 3, reps: '12-15', superset: 'C' },
        ],
      },
      {
        key: 'legs-arnold',
        name: 'Legs',
        focus: 'Quads, hamstrings, calves',
        exercises: [
          { slug: 'squat', sets: 5, reps: '8-12' },
          { slug: 'leg-extension', sets: 4, reps: '12-15', superset: 'A' },
          { slug: 'leg-curl', sets: 4, reps: '12-15', superset: 'A' },
          { slug: 'romanian-deadlift', sets: 3, reps: '10-12' },
          { slug: 'walking-lunge', sets: 3, reps: '12-15' },
          { slug: 'standing-calf-raise', sets: 4, reps: '15-20', superset: 'B' },
          { slug: 'seated-calf-raise', sets: 4, reps: '15-20', superset: 'B' },
        ],
      },
    ],
  },

  {
    key: 'phul',
    name: 'PHUL',
    summary:
      'Power Hypertrophy Upper Lower: two heavy strength days and two lighter volume days.',
    daysPerWeek: '4 days',
    bestFor: 'Training strength and size in the same week without picking one.',
    days: [
      {
        key: 'upper-power',
        name: 'Upper Power',
        focus: 'Heavy, low reps',
        exercises: [
          { slug: 'bench-press', sets: 4, reps: '3-5' },
          { slug: 'barbell-row', sets: 4, reps: '3-5' },
          { slug: 'overhead-press', sets: 3, reps: '5-8' },
          { slug: 'weighted-pull-up', sets: 3, reps: '5-8' },
          { slug: 'close-grip-bench-press', sets: 3, reps: '6-10' },
          { slug: 'ez-bar-curl', sets: 3, reps: '6-10' },
        ],
      },
      {
        key: 'lower-power',
        name: 'Lower Power',
        focus: 'Heavy squat and hinge',
        exercises: [
          { slug: 'squat', sets: 4, reps: '3-5' },
          { slug: 'deadlift', sets: 3, reps: '3-5' },
          { slug: 'leg-press', sets: 4, reps: '10-15' },
          { slug: 'leg-curl', sets: 4, reps: '6-10' },
          { slug: 'standing-calf-raise', sets: 4, reps: '6-10' },
        ],
      },
      {
        key: 'upper-hypertrophy',
        name: 'Upper Hypertrophy',
        focus: 'Moderate weight, higher reps',
        exercises: [
          { slug: 'incline-dumbbell-press', sets: 4, reps: '8-12' },
          { slug: 'lat-pulldown', sets: 4, reps: '8-12' },
          { slug: 'cable-fly', sets: 3, reps: '12-15' },
          { slug: 'seated-row', sets: 3, reps: '10-15' },
          { slug: 'cable-lateral-raise', sets: 3, reps: '12-20' },
          { slug: 'cable-curl', sets: 3, reps: '10-15' },
          { slug: 'rope-tricep-pushdown', sets: 3, reps: '10-15' },
        ],
      },
      {
        key: 'lower-hypertrophy',
        name: 'Lower Hypertrophy',
        focus: 'Volume and single-leg work',
        exercises: [
          { slug: 'front-squat', sets: 3, reps: '8-12' },
          { slug: 'bulgarian-split-squat', sets: 3, reps: '10-12' },
          { slug: 'leg-extension', sets: 4, reps: '12-15' },
          { slug: 'seated-leg-curl', sets: 4, reps: '10-15' },
          { slug: 'seated-calf-raise', sets: 4, reps: '12-20' },
          { slug: 'cable-crunch', sets: 3, reps: '12-15' },
        ],
      },
    ],
  },
];

export function getRoutine(key: string | null | undefined): Routine | null {
  if (!key) return null;
  return ROUTINES.find((r) => r.key === key) ?? null;
}

export function getRoutineDay(
  routineKey: string | null | undefined,
  dayKey: string,
): { routine: Routine; day: RoutineDay } | null {
  const routine = getRoutine(routineKey);
  if (!routine) return null;
  const day = routine.days.find((d) => d.key === dayKey);
  return day ? { routine, day } : null;
}

/**
 * Turns a day's superset letters into the integer groups the database stores.
 * Exercises without a letter get null, i.e. a normal straight set.
 */
export function supersetGroupFor(
  day: RoutineDay,
  exercise: RoutineExercise,
): number | null {
  if (!exercise.superset) return null;
  const letters = [...new Set(day.exercises.map((e) => e.superset).filter(Boolean))];
  const index = letters.indexOf(exercise.superset);
  return index === -1 ? null : index + 1;
}

/** Every slug referenced by every routine, deduplicated. */
export function allRoutineSlugs(): string[] {
  return [
    ...new Set(ROUTINES.flatMap((r) => r.days.flatMap((d) => d.exercises.map((e) => e.slug)))),
  ];
}

/**
 * Returns the slugs that do not resolve against the exercise package.
 * Used by `npm run check:routines`.
 */
export function invalidRoutineSlugs(): string[] {
  return allRoutineSlugs().filter((slug) => !getExercise(slug));
}
