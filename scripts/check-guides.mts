/**
 * Verifies the exercise guides and routine templates against the actual
 * package contents.
 *
 * Fails the build when:
 *   - a routine references an exercise slug that does not exist
 *   - a routine exercise has no written form guide
 *   - a guide exists for a slug the package does not have (a typo, or an
 *     exercise removed by a package upgrade)
 *
 * Coverage across all 302 is reported but not enforced, so adding exercises in
 * a future package version does not break the build — it just shows up here.
 */
import { exercises } from '@bryllim/workout-guide';
import { invalidRoutineSlugs, allRoutineSlugs, ROUTINES } from '../src/lib/routines.js';
import { EXERCISE_GUIDES } from '../src/lib/exercise-guides/index.js';

const packageSlugs = new Set(exercises.map((e) => e.slug));
const guideSlugs = Object.keys(EXERCISE_GUIDES);

const invalidRoutines = invalidRoutineSlugs();
const routineSlugs = allRoutineSlugs();
const routineMissingGuides = routineSlugs.filter((slug) => !EXERCISE_GUIDES[slug]);
const guidesForUnknown = guideSlugs.filter((slug) => !packageSlugs.has(slug));
const withoutGuides = exercises.filter((e) => !EXERCISE_GUIDES[e.slug]);

const covered = exercises.length - withoutGuides.length;
const pct = ((covered / exercises.length) * 100).toFixed(1);

console.log(`Routines:       ${ROUTINES.length} (${ROUTINES.reduce((n, r) => n + r.days.length, 0)} days)`);
console.log(`Routine slugs:  ${routineSlugs.length}`);
console.log(`Guides written: ${guideSlugs.length}`);
console.log(`Coverage:       ${covered}/${exercises.length} exercises (${pct}%)`);

let failed = false;

function report(label: string, slugs: string[]) {
  if (!slugs.length) return;
  console.error(`\n✗ ${slugs.length} ${label}:`);
  for (const s of slugs.slice(0, 20)) console.error(`    ${s}`);
  if (slugs.length > 20) console.error(`    …and ${slugs.length - 20} more`);
  failed = true;
}

report('routine slug(s) not in the exercise package', invalidRoutines);
report('routine exercise(s) with no form guide', routineMissingGuides);
report('guide(s) for slugs the package does not have', guidesForUnknown);

if (withoutGuides.length) {
  console.log(`\n${withoutGuides.length} exercise(s) have no written guide yet:`);
  for (const e of withoutGuides.slice(0, 20)) console.log(`    ${e.slug}`);
  if (withoutGuides.length > 20) console.log(`    …and ${withoutGuides.length - 20} more`);
}

if (failed) process.exit(1);

console.log('\n✓ Routines and guides all resolve against the exercise package.');
