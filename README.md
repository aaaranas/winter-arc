# Winter Arc

A single-user PWA for logging workouts and macros. Workout illustrations come
from [`@bryllim/workout-guide`](https://bryllim.github.io/workout-guide/); the
food database is seeded with Philippine/Cebu foods.

## Running it

```bash
npm install          # also copies illustrations into public/ and generates the Prisma client
cp .env.example .env
npm run db:migrate   # creates dev.db
npm run db:seed      # loads 166 foods
npm run dev
```

Then open http://localhost:3000.

| script | does |
|---|---|
| `npm run dev` | dev server (Turbopack; service worker disabled) |
| `npm run build` | production build (webpack — see *Why webpack* below) |
| `npm run db:migrate` | apply schema changes |
| `npm run db:seed` | upsert the seed foods (safe to re-run) |
| `npm run db:studio` | browse the database |
| `npm run db:reset` | drop and rebuild from migrations |
| `npm run check:guides` | verify routine slugs + guide coverage against the package |

## What it does

**Workouts**
- Four built-in splits — Push/Pull/Legs, Upper/Lower, Arnold, PHUL — with 14 days between them. Following one puts its days on the Today screen; starting a day copies its exercises, superset groupings and set/rep prescription into a new workout that is then yours to edit.
- Supersets: link any exercise to the one above it. Linked exercises render as one block and the rest timer waits until the round is finished rather than firing between halves.
- Rest timer, duration set in Settings, starting automatically after each set. It stores a deadline rather than counting down, so backgrounding the phone between sets does not desynchronise it.
- Personal records, computed from your logged sets rather than stored separately — so deleting a set correctly hands the record back to the runner-up. Beating one shows a toast immediately and badges the set.
- How-to steps for **all 302 exercises**, alongside their three illustration frames. Reachable two ways: the book icon beside an exercise while logging, and by tapping any card in the Exercises tab.

**Macros**
- Enter height, weight, age and activity, and get a macro target from Mifflin-St Jeor → TDEE → goal adjustment. One button copies it into the daily targets the food log tracks against.
- Meal suggestions for OMAD, two meals or three, built from the foods actually in your database.

## How it fits together

```
prisma/
  schema.prisma          Workout / WorkoutExercise / ExerciseSet
                         FoodItem / DailyLog / LogEntry / Settings
  seed/
    types.ts             the SeedFood shape and the provenance contract
    foods/               staples · packaged · home-cooked · fastfood
scripts/
  copy-exercise-assets.mjs   node_modules -> public/workout-guide (postinstall)
  generate-icons.mjs         PWA icons, drawn from pixel maths
src/
  app/                   /  ·  /workout/[id]  ·  /history  ·  /exercises
                         /food  ·  /food/[day]  ·  /settings
    sw.ts                service worker source (bundled to public/sw.js)
    manifest.ts          /manifest.webmanifest
  components/
    ui/                  shadcn (radix-nova preset, neutral base)
    workout/ food/ layout/
  lib/
    exercises.ts         the ONLY module importing @bryllim/workout-guide
    exercise-guides/     written form cues — 302 of them, split by movement
                         family (compound · upper-push · upper-pull ·
                         lower-body · glutes · core · conditioning)
    routines.ts          the four splits and their days
    nutrition.ts         BMR/TDEE/macro maths and meal suggestions
    db.ts                Prisma client (libSQL adapter)
    queries.ts           read helpers        actions/  writes (server actions)
  stores/
    rest-timer.ts        zustand; holds a deadline, not a countdown
```

Two conventions worth knowing:

- **Exercise metadata is never stored in the database.** `WorkoutExercise` holds
  a `exerciseSlug` and nothing else; name, muscle, equipment and illustrations
  are resolved at render time through `src/lib/exercises.ts`. Upgrading the
  package updates the whole app with no migration.
- **Routine templates live in code, workouts live in the database.** Starting a
  day copies the template; editing a template never rewrites a logged session.
  `npm run check:guides` fails the build if a template references an exercise
  slug the package does not have, if a routine exercise has no written form
  guide, or if a guide points at a slug the package dropped — a bad slug is
  otherwise invisible until you open that day at the gym. It also reports
  coverage across all 302 exercises.
- **`userId` defaults to `"local"` and is not nullable.** Auth can be added by
  replacing `currentUserId()` in `src/lib/user.ts`. It is non-null because
  SQLite treats NULLs as distinct in unique indexes, which would let
  `@@unique([userId, date])` pass duplicate `DailyLog` rows for one day.

## Deploying to Vercel

**A `file:` SQLite database will not survive on Vercel.** The filesystem is
ephemeral and not shared between invocations, so every write is lost on the next
deploy. `src/lib/db.ts` warns about this at runtime.

The app uses the libSQL driver adapter, which speaks both local files and hosted
Turso, so moving over is environment variables only — no schema or code change:

```
DATABASE_URL=libsql://your-db.turso.io
DATABASE_AUTH_TOKEN=your-token
```

Apply migrations against the hosted database before the first deploy.

### Why webpack for the build

Next 16 builds with Turbopack by default, but `@serwist/next` injects the
service worker through a webpack plugin and has no Turbopack support yet, so
`npm run build` passes `--webpack`. `npm run dev` still uses Turbopack — the
service worker is disabled in development anyway, so nothing is lost.

## About the food data

Every `FoodItem` carries a `sourceType` that is shown in the UI, so a rounded
guess never looks like a label reading. Settings has a full breakdown.

| provenance | count | what it means |
|---|---|---|
| `OFFICIAL` | 22 | transcribed from the publisher's own nutrition document |
| `REFERENCE` | 44 | typical composition for a generic food |
| `ESTIMATE` | 100 | inherently variable, deliberately rounded |
| `LABEL` | — | you corrected it against a physical nutrition panel |
| `USER` | — | you entered it |

Specifically:

- **Jollibee (22 items) is real published data**, transcribed from Jollibee's
  own [nutrition PDF](https://jollibeefoods.com/nutrition) dated 01 July 2026.
  It documents the **USA** menu — Philippine portions and formulations may
  differ, so treat these as close rather than exact.
- **Chowking, Mang Inasal and Greenwich publish no retrievable nutrition data.**
  Their items are rounded estimates, flagged as such. They were not dressed up
  with citations to third-party aggregators.
- **Packaged goods are estimates, not label readings.** None could be verified
  against a primary source at seed time. The panel is on the pack in your
  kitchen — correct them in the app and the row flips to `LABEL`.
- **Home-cooked dishes are estimates by nature** and rounded to the nearest
  5 kcal, because the fat in humba depends on the cut of liempo.

Correcting a food in the app edits it in place; the seed upserts on `seedKey`,
so re-running it will overwrite your corrections to seeded rows but never
touches foods you created yourself.

## About the exercise instructions

All 302 exercises have written steps — setup, the rep, and cues. They are
**standard form cues written for this app**, not quoted from anywhere.
`@bryllim/workout-guide` ships illustrations and metadata but no instruction
text — its `Exercise` type has no description or steps field — so there is no
official source to reproduce, and labelling them "official" would be false.

They are not coaching or medical advice. If a movement hurts, stop.

## Licensing

Exercise illustrations are © Bryl Lim, licensed
[CC BY-SA 4.0](https://creativecommons.org/licenses/by-sa/4.0/); 76 of the
first-pose frames are adaptations of [Everkinetic](https://github.com/everkinetic/data)
artwork, also CC BY-SA 4.0. The package's code is MIT. Attribution is rendered
in Settings, as the licence requires — **CC BY-SA is share-alike, so adaptations
of the artwork must be shared under the same licence.**
