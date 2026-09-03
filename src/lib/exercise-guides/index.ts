import type { ExerciseGuide } from './types';
import { COMPOUND_GUIDES } from './compound';
import { UPPER_PUSH_GUIDES } from './upper-push';
import { UPPER_PULL_GUIDES } from './upper-pull';
import { LOWER_BODY_GUIDES } from './lower-body';
import { GLUTE_GUIDES } from './glutes';
import { CORE_GUIDES } from './core';
import { CONDITIONING_GUIDES } from './conditioning';

export type { ExerciseGuide };

/**
 * Every written how-to, keyed by exercise slug.
 *
 * Split across files by movement family purely so no single file is thousands
 * of lines; the merge here is what the app consumes. See ./types.ts for where
 * this text comes from — and, importantly, what it is not.
 *
 * `npm run check:guides` verifies that every key resolves to a real exercise in
 * @bryllim/workout-guide and reports coverage across all 302.
 */
export const EXERCISE_GUIDES: Record<string, ExerciseGuide> = {
  ...COMPOUND_GUIDES,
  ...UPPER_PUSH_GUIDES,
  ...UPPER_PULL_GUIDES,
  ...LOWER_BODY_GUIDES,
  ...GLUTE_GUIDES,
  ...CORE_GUIDES,
  ...CONDITIONING_GUIDES,
};

export function hasGuide(slug: string): boolean {
  return Boolean(EXERCISE_GUIDES[slug]);
}
