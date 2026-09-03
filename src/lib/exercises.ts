/**
 * The only module that imports @bryllim/workout-guide directly.
 *
 * Everything else in the app goes through here, so that if the package's API
 * changes there is exactly one file to fix.
 *
 * Filtering and search are delegated to the package's own searchExercises()
 * rather than reimplemented — it already handles accent/punctuation
 * normalisation and matches across name, muscle and equipment.
 */
import {
  exercises,
  getExercise as pkgGetExercise,
  searchExercises as pkgSearchExercises,
  type Exercise,
  type ExerciseSearchFilters,
  type ExerciseType,
} from '@bryllim/workout-guide';

export type { Exercise, ExerciseSearchFilters, ExerciseType };

/**
 * Where scripts/copy-exercise-assets.mjs puts the package's PNGs.
 * Frame paths inside the package are already prefixed with "assets/".
 */
const ASSET_BASE = '/workout-guide/';

/**
 * Resolve a same-origin URL for one illustration frame.
 *
 * We deliberately do NOT use the package's getAssetUrl(): it defaults to a
 * jsDelivr CDN (a third-party origin our service worker can't precache) and it
 * throws ERR_INVALID_URL when given a relative baseUrl like "/workout-guide/",
 * because it builds URLs with `new URL(path, base)`. Reading frame.path
 * directly is both simpler and SSR-safe.
 */
export function getFrameUrl(
  exercise: Exercise,
  frameIndex: 1 | 2 | 3 = 1,
): string | null {
  const frame = exercise.frames.find((f) => f.index === frameIndex);
  if (!frame) return null;
  return `${ASSET_BASE}${frame.path}`;
}

/** Every frame for an exercise, in order. Used by the animated preview. */
export function getFrameUrls(exercise: Exercise): string[] {
  return exercise.frames
    .map((f) => `${ASSET_BASE}${f.path}`)
    .filter(Boolean);
}

/** Accepts either a slug ("bench-press") or an id ("exercise-bench-press"). */
export function getExercise(idOrSlug: string): Exercise | null {
  return pkgGetExercise(idOrSlug);
}

export function searchExercises(
  query?: string,
  filters?: ExerciseSearchFilters,
): Exercise[] {
  return pkgSearchExercises(query, filters);
}

export function getAllExercises(): Exercise[] {
  return exercises;
}

/**
 * Filter vocabularies, derived from the data rather than hardcoded, so they
 * stay correct if the package adds exercises.
 */
function distinct(values: string[]): string[] {
  return [...new Set(values)].sort((a, b) => a.localeCompare(b));
}

export const MUSCLE_GROUPS: string[] = distinct(
  exercises.map((e) => e.primaryMuscle),
);

export const EQUIPMENT: string[] = distinct(exercises.map((e) => e.equipment));

export const EXERCISE_TYPES: ExerciseType[] = [
  'weight_reps',
  'bodyweight_reps',
  'assisted_bodyweight',
  'duration',
  'distance_duration',
];

export const EXERCISE_TYPE_LABELS: Record<ExerciseType, string> = {
  weight_reps: 'Weight & reps',
  bodyweight_reps: 'Bodyweight reps',
  assisted_bodyweight: 'Assisted bodyweight',
  duration: 'Duration',
  distance_duration: 'Distance & duration',
};

/**
 * Which set fields an exercise type actually uses. The logging UI reads this so
 * a plank asks for time and a run asks for distance, instead of showing
 * reps × weight for everything.
 */
export function setFieldsFor(type: ExerciseType): {
  reps: boolean;
  weight: boolean;
  duration: boolean;
  distance: boolean;
} {
  switch (type) {
    case 'weight_reps':
      return { reps: true, weight: true, duration: false, distance: false };
    case 'bodyweight_reps':
    case 'assisted_bodyweight':
      return { reps: true, weight: true, duration: false, distance: false };
    case 'duration':
      return { reps: false, weight: false, duration: true, distance: false };
    case 'distance_duration':
      return { reps: false, weight: false, duration: true, distance: true };
  }
}

/**
 * Attribution facts, read from the package's own manifest rather than written
 * by hand, so the About screen can't drift from what we actually ship.
 * Note only a subset of exercises derive from Everkinetic.
 */
export function getAttributionSummary() {
  const derived = exercises.filter((e) => e.attribution.source);
  return {
    totalExercises: exercises.length,
    totalFrames: exercises.reduce((n, e) => n + e.frames.length, 0),
    everkineticDerivedCount: derived.length,
    creator: 'Bryl Lim',
    creatorUrl: 'https://bryllim.com',
    assetLicense: 'CC BY-SA 4.0',
    assetLicenseUrl: 'https://creativecommons.org/licenses/by-sa/4.0/',
    codeLicense: 'MIT',
    upstream: 'Everkinetic',
    upstreamUrl: 'https://github.com/everkinetic/data',
    packageHomepage: 'https://bryllim.github.io/workout-guide/',
  };
}
