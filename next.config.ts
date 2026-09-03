import { createHash } from 'node:crypto';
import { readdirSync, readFileSync } from 'node:fs';
import path from 'node:path';
import type { NextConfig } from 'next';
import withSerwistInit from '@serwist/next';

const nextConfig: NextConfig = {
  // The exercise illustrations are already 512x512 PNGs served from our own
  // origin, so there is nothing for the image optimizer to do but add a
  // serverless round-trip in front of a file the service worker wants to cache
  // directly. Serving them unoptimized keeps the cache key equal to the URL.
  images: {
    unoptimized: true,
  },
};

/**
 * The precache manifest for everything in public/.
 *
 * We build this ourselves instead of letting @serwist/next glob the directory,
 * for two reasons:
 *
 * 1. The 906 illustration PNGs (32 MB) must stay OUT of the precache. Precaching
 *    them would make the first visit download the whole set before the app is
 *    usable, which is brutal on mobile data. The CacheFirst rule in
 *    src/app/sw.ts caches each one the first time it is actually displayed, so
 *    the picker still works offline for everything you have looked at.
 *    The plugin's own `globPublicPatterns` cannot express this: it passes the
 *    patterns to node-glob, which has no support for "!" negation, so a
 *    "!workout-guide/**" entry silently matches nothing.
 *
 * 2. The plugin joins glob results with the OS path separator, so a Windows
 *    build emits precache URLs like "workout-guide\assets\squat\frame-1.png".
 *    Normalising to forward slashes here makes the manifest identical whether
 *    it is built on Windows or on Vercel's Linux builders.
 */
function publicPrecacheEntries() {
  const publicDir = path.join(process.cwd(), 'public');

  return readdirSync(publicDir, { recursive: true, withFileTypes: true })
    .filter((entry) => entry.isFile())
    .map((entry) => {
      const absolute = path.join(entry.parentPath, entry.name);
      return {
        absolute,
        url: path.relative(publicDir, absolute).split(path.sep).join('/'),
      };
    })
    .filter(
      ({ url }) =>
        !url.startsWith('workout-guide/') &&
        !url.startsWith('swe-worker-') &&
        url !== 'sw.js' &&
        url !== 'sw.js.map',
    )
    .map(({ absolute, url }) => ({
      url: `/${url}`,
      revision: createHash('md5').update(readFileSync(absolute)).digest('hex'),
    }));
}

/**
 * Serwist is applied to production builds only.
 *
 * Not merely `disable: true` in dev: withSerwistInit() attaches a `webpack` key
 * to the config even when disabled, and Next 16 hard-errors when it builds with
 * Turbopack (the default) and finds a webpack config it was not told about.
 * Skipping the wrapper entirely keeps `next dev` on Turbopack with no config to
 * complain about — and a service worker in dev would only serve stale pages
 * while editing anyway.
 *
 * Calling publicPrecacheEntries() inside this branch also keeps its walk of
 * public/ out of dev-server startup.
 */
const nextConfigWithPwa =
  process.env.NODE_ENV === 'development'
    ? nextConfig
    : withSerwistInit({
        swSrc: 'src/app/sw.ts',
        swDest: 'public/sw.js',
        additionalPrecacheEntries: publicPrecacheEntries(),
        exclude: [/\.map$/],
      })(nextConfig);

export default nextConfigWithPwa;
