/**
 * How to perform each exercise.
 *
 * WHERE THESE COME FROM — read before trusting them
 * -------------------------------------------------
 * @bryllim/workout-guide ships illustrations and metadata but **no instruction
 * text**: its Exercise type has no description or steps field. So these are
 * written for this app as standard, widely-taught form cues. They are not
 * transcribed from a governing body, a certification syllabus or the exercise
 * package, and calling them "official" would be false — nothing official
 * exists to quote.
 *
 * They are also not medical or coaching advice. If a movement hurts, stop.
 * `npm run check:guides` reports coverage and fails if a guide references an
 * exercise the package does not have.
 */

export type ExerciseGuide = {
  /** Getting into position before the first rep. */
  setup: string;
  /** The rep itself, in order. */
  steps: string[];
  /** Short reminders and the mistakes people actually make. */
  cues?: string[];
};
