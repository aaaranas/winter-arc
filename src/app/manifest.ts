import type { MetadataRoute } from 'next';

/**
 * Served at /manifest.webmanifest by Next's metadata route.
 *
 * theme_color and background_color are the dark theme's background (#0a0a0a,
 * the oklch(0.145 0 0) token) so the splash screen and phone chrome match the
 * app instead of flashing white on launch.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Winter Arc — Workouts & Macros',
    short_name: 'Winter Arc',
    description: 'Workout logging and Philippine macro tracking.',
    start_url: '/',
    scope: '/',
    display: 'standalone',
    orientation: 'portrait',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    categories: ['health', 'fitness', 'lifestyle'],
    icons: [
      {
        src: '/icons/icon-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'any',
      },
      {
        src: '/icons/icon-maskable-192.png',
        sizes: '192x192',
        type: 'image/png',
        purpose: 'maskable',
      },
      {
        src: '/icons/icon-maskable-512.png',
        sizes: '512x512',
        type: 'image/png',
        purpose: 'maskable',
      },
    ],
    shortcuts: [
      { name: 'Log food', url: '/food' },
      { name: 'Exercises', url: '/exercises' },
    ],
  };
}
