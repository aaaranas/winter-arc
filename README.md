# Winter Arc

A single-user PWA for logging workouts and macros. Workout illustrations come
from [`@bryllim/workout-guide`](https://bryllim.github.io/workout-guide/); the
food database is seeded with Philippine/Cebu foods. Data lives in
Prisma Postgres.

## Running it

```bash
npm install                 # copies illustrations into public/, generates the Prisma client
npx prisma postgres link    # provisions/links a Prisma Postgres DB and writes DATABASE_URL to .env
npm run db:migrate          # applies the schema
npm run db:seed             # loads 166 foods
npm run dev
```

No local database daemon is needed — Prisma Postgres is hosted, so dev and
production talk to the same kind of database.

Then open http://localhost:3000.

| script | does |
|---|---|
| `npm run dev` | dev server (Turbopack; service worker disabled) |
| `npm run build` | production build (webpack — see *Why webpack* below) |
| `npm run db:migrate` | create + apply a migration (dev) |
| `npm run db:seed` | upsert the seed foods (safe to re-run) |
| `npm run db:studio` | browse the database |
| `npm run db:reset` | drop and rebuild from migrations, then re-seed |
| `npm run check:guides` | verify routine slugs + guide coverage against the package |

## Mobile

Zoom is locked (`maximum-scale=1, user-scalable=no` in the `viewport` export in
`src/app/layout.tsx`) so the installed PWA behaves like an app rather than a
page. That is normally an accessibility anti-pattern — pinch-zoom is how people
with low vision cope — and it is only acceptable here because this is a private
app for a handful of known people. **Delete those two lines if that ever stops
being true.**

Two limits worth knowing: iOS Safari has ignored `user-scalable=no` since
iOS 10, so it mainly takes effect on Android; and it does not clear a zoom level
the browser has already stored for the origin, which has to be reset once on the
device.

Layout is verified to fit without zooming at 320px, 360px and 375px on every
screen — no page-level sideways scroll and no unclipped overflow. The only
horizontal scrolling is inside the filter chip rows on `/exercises`, which is
deliberate: wrapping 20 muscles and 17 equipment types would push the exercise
grid off the screen.

## Accounts

Email + password, via [Better Auth](https://better-auth.com), stored in your own
Postgres — no third-party identity provider. Password hashes (scrypt), sessions
and accounts sit in tables beside the workout data.

**Data is per-user.** Workouts, sets, PRs, food logs, body metrics and settings
are scoped to the signed-in account; two people using the same deployment never
see each other's training. The exceptions are deliberate and shared:

| shared by everyone | private to each account |
|---|---|
| the 302 exercises, routines and form guides (they come from the npm package and code, not the database) | workouts, sets, PRs |
| the 166 seeded reference foods (`FoodItem.userId IS NULL`) | food logs, custom foods, body metrics, targets |

Enforcement is in two places on purpose. `src/proxy.ts` redirects signed-out
visitors cheaply, checking only that a session cookie exists. The real boundary
is `requireUserId()` in every page and server action — it resolves the actual
session, cannot be fooled by a forged cookie, and covers server-action POSTs
that never pass through a matched route.

### Email verification is currently OFF

Winter Arc is deployed on a `.vercel.app` subdomain, which cannot be verified as
a sending domain with any email provider — so verification mail would reach
nobody but the owner of the sending key, and every friend's signup would
dead-end. Signup therefore creates a usable account immediately.

The trade-off: someone can register an address they do not own. Acceptable for a
known group; not for a public app. Password reset is also unavailable, and the
"Forgot?" link hides itself when no mail provider is configured rather than
leading somewhere broken.

To turn verification back on once you own a domain: verify it with Resend, set
`RESEND_API_KEY` and `EMAIL_FROM`, flip `requireEmailVerification` and
`sendOnSignUp` to `true` in `src/lib/auth.ts`, and send new signups to
`/verify-email` in `src/components/auth/auth-form.tsx`. That route and its
resend button are kept for exactly this.

## What it does

**Workouts**
- Four built-in splits — Push/Pull/Legs, Upper/Lower, Arnold, PHUL — with 14 days between them. Following one puts its days on the Today screen; starting a day copies its exercises, superset groupings and set/rep prescription into a new workout that is then yours to edit.
- Supersets: link any exercise to the one above it. Linked exercises render as one block and the rest timer waits until the round is finished rather than firing between halves.
- Rest timer, duration set in Settings, starting automatically after each set. It stores a deadline rather than counting down, so backgrounding the phone between sets does not desynchronise it.
- Personal records, computed from your logged sets rather than stored separately — so deleting a set correctly hands the record back to the runner-up. Beating one shows a toast immediately and badges the set.
- How-to steps for **all 302 exercises**, alongside their three illustration frames. Reachable two ways: the book icon beside an exercise while logging, and by tapping any card in the Exercises tab.

**Sharing**
- Any workout renders to a PNG for stories and feeds: `Story` (1080×1920) or `Square` (1080×1080), transparent or solid. The transparent variant overlays your own photo the way Strava's route cards do.
- Generated server-side with `next/og`, shared through the Web Share API's file support so it opens the real system share sheet; desktop falls back to a download.
- Only exercises with logged sets appear — a routine day is created with its full plan, and listing untouched exercises would advertise work that was not done.
- **Every** performed exercise fits: row type scales down and the list splits into two columns rather than truncating with "+N more". `src/lib/share-card-layout.ts` does the arithmetic, since Satori renders server-side with no layout engine to measure against.

**Progress and offline**
- **Sets survive no signal.** Logging while offline writes to an IndexedDB outbox and shows the set immediately; `OfflineSync` replays the queue when the connection returns and only removes an item once the server confirms it. Gyms are the worst place for a signal and the only place this app is used.
- **Weight over time**, with the seven-day average as the headline rather than today's reading — daily weight swings a kilo on water alone. The macro plan is built from that trend when there is one, so it follows what the scale actually does.
- **Per-exercise progression** at `/progress`: one point per session (its best set), ranked by estimated 1RM for weighted work, reps for bodyweight, time for holds.
- **Progressive overload prefill.** The logger seeds from your last session with that exercise and offers a one-tap `+2.5 kg`, so nothing has to be recalled between sets.

**Macros**
- Enter height, weight, age and activity, and get a macro target from Mifflin-St Jeor → TDEE → goal adjustment. One button copies it into the daily targets the food log tracks against.
- Meal suggestions for OMAD, two meals or three, built from the foods actually in your database.

## How it fits together

```
prisma/
  schema.prisma          Postgres. Workout / WorkoutExercise / ExerciseSet
                         FoodItem / DailyLog / LogEntry / Settings
  seed/
    types.ts             the SeedFood shape and the provenance contract
    foods/               staples · packaged · home-cooked · fastfood
scripts/
  copy-exercise-assets.mjs   node_modules -> public/workout-guide (postinstall)
  generate-icons.mjs         PWA icons, drawn from pixel maths
src/
  app/                   /  ·  /workout/[id]  ·  /history  ·  /exercises
                         /food  ·  /food/[day]  ·  /settings  ·  /plan
                         /sign-in  ·  /sign-up  ·  /verify-email
                         /forgot-password  ·  /reset-password
                         api/auth/[...all]    Better Auth endpoints
  proxy.ts               signed-out redirect (was middleware.ts before Next 16)
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
    share-card.ts        the numbers behind a share image (ownership-checked)
    share-card-layout.ts fits every exercise into the card without truncating
    offline/outbox.ts    IndexedDB queue for sets logged with no connection
  stores/
    pending-sets.ts      reactive mirror of the outbox
  components/charts/
    sparkline.tsx        inline SVG trend line (currentColor, themes for free)
    auth.ts              Better Auth config (email + password)
    auth-client.ts       browser-side auth
    user.ts              requireUserId() — the real security boundary
    food-scope.ts        which foods a user may see
    mailer.ts            pluggable email; logs to console when unconfigured
    db.ts                Prisma client (lazy; @prisma/adapter-pg)
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
  Postgres treats NULLs as distinct in unique indexes, which would let
  `@@unique([userId, date])` pass duplicate `DailyLog` rows for one day.

## Local database gotchas

`prisma dev` serves **one** database under every name — `winterarc`,
`template1`, `postgres` and any database you create all show identical
contents. That breaks `prisma migrate dev`, because Prisma's shadow database
*is* the main database and every migration dies on
`relation "Workout" already exists`.

So local schema changes do not use `migrate dev`. Generate the migration
offline, then apply it:

```powershell
npx prisma migrate diff --from-migrations prisma/migrations --to-schema prisma/schema.prisma --script
```

Save that as `prisma/migrations/<timestamp>_<name>/migration.sql`, apply it to
the local database, and run `npx prisma generate`. Production is a real Postgres
with real separate databases, so `npx prisma migrate deploy` works there
normally.

## Deploying to Vercel

The database is **Prisma Postgres**, so there is nothing filesystem-bound to
break on a serverless host. Set these in the Vercel dashboard before the first
deploy:

```
DATABASE_URL=postgres://USER:PASSWORD@db.prisma.io:5432/postgres?sslmode=verify-full
```

Get this from console.prisma.io → your database → **Connection strings**. Take
the direct **PostgreSQL/TCP** string, not the `prisma+postgres://…?api_key=…`
one — `@prisma/adapter-pg` wraps node-postgres, which cannot parse that
protocol. If a pooled endpoint (`pooled.db.prisma.io`) is offered, prefer it in
production so concurrent serverless invocations share connections.

**Use `sslmode=verify-full`, not `require`.** node-postgres currently treats
`require` as `verify-full`, but pg v9 will switch it to libpq semantics —
encrypted but *unverified*, which silently drops MITM protection on an upgrade.
Being explicit pins the strong behaviour and removes the runtime warning.

Apply migrations against the hosted database before the first deploy:

```
npx prisma migrate deploy
```

The build itself does not need a database. `src/lib/db.ts` constructs the
client lazily, on first query rather than on import, because `next build` loads
every page module to collect its config — eager construction made the whole
build fail with "Failed to collect page data for /plan" when `DATABASE_URL` was
absent. Every page that reads the database is `force-dynamic`, so only requests
need a connection.

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
