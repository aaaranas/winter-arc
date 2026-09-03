/// <reference lib="webworker" />

import { defaultCache } from '@serwist/next/worker';
import type { PrecacheEntry, SerwistGlobalConfig } from 'serwist';
import { CacheFirst, ExpirationPlugin, Serwist } from 'serwist';

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    /**
     * Exercise illustrations.
     *
     * CacheFirst because these are immutable: a given frame PNG never changes
     * content, it is only ever replaced wholesale by a package upgrade. Caching
     * them is what makes the exercise picker usable after the first load
     * instead of showing 302 broken images.
     *
     * 906 files at ~35 KB each is why maxEntries is generous — it holds the
     * whole set if you browse it all, and evicts oldest-first if the browser
     * puts pressure on the origin's quota.
     */
    {
      matcher: ({ url }) => url.pathname.startsWith('/workout-guide/assets/'),
      handler: new CacheFirst({
        cacheName: 'exercise-illustrations',
        plugins: [
          new ExpirationPlugin({
            maxEntries: 1000,
            maxAgeSeconds: 60 * 60 * 24 * 365,
            purgeOnQuotaError: true,
          }),
        ],
      }),
    },
    // Everything else keeps Serwist's defaults for Next: stale-while-revalidate
    // for static assets, NetworkFirst for pages and data.
    ...defaultCache,
  ],
});

serwist.addEventListeners();
