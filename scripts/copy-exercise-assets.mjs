/**
 * Copies the 906 exercise illustration PNGs out of @bryllim/workout-guide into
 * public/ so they are served same-origin.
 *
 * Why this exists: the package's own getAssetUrl() defaults to a jsDelivr CDN
 * URL, and a third-party origin can't be precached by our service worker or
 * relied on offline. Serving them ourselves is what makes the exercise picker
 * work after first load.
 *
 * Runs on postinstall, so Vercel picks it up during its install step.
 * Output is gitignored — it is derived from node_modules, never edited by hand.
 */
import { cp, mkdir, stat } from 'node:fs/promises';
import { createRequire } from 'node:module';
import path from 'node:path';

const require = createRequire(import.meta.url);

const pkgJsonPath = require.resolve('@bryllim/workout-guide/package.json');
const sourceDir = path.join(path.dirname(pkgJsonPath), 'assets');
const targetDir = path.join(process.cwd(), 'public', 'workout-guide', 'assets');

try {
  await stat(sourceDir);
} catch {
  console.error(`[exercise-assets] Not found: ${sourceDir}`);
  console.error('[exercise-assets] Is @bryllim/workout-guide installed?');
  process.exit(1);
}

await mkdir(path.dirname(targetDir), { recursive: true });
await cp(sourceDir, targetDir, { recursive: true });

console.log(`[exercise-assets] Copied illustrations -> public/workout-guide/assets`);
