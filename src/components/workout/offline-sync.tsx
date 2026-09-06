'use client';

import { useCallback, useEffect, useSyncExternalStore } from 'react';
import { useRouter } from 'next/navigation';
import { CloudOff, RefreshCw } from 'lucide-react';
import { addSet } from '@/lib/actions/workouts';
import { usePendingSets } from '@/stores/pending-sets';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

/**
 * Replays sets that were logged offline.
 *
 * Runs once on mount and again whenever the browser reports it is back online.
 * Replay is sequential and stops at the first failure: if the connection is
 * still bad, hammering the rest of the queue only produces more failures, and
 * the remaining items stay queued for the next attempt.
 *
 * `navigator.onLine` is optimistic — it reports "online" for a connected wifi
 * with no route to the internet — so a failed replay is treated as "still
 * offline" rather than as a lost set. Nothing is ever dropped from the queue
 * except after the server confirms the write.
 */
function subscribeToConnection(onChange: () => void): () => void {
  window.addEventListener('online', onChange);
  window.addEventListener('offline', onChange);
  return () => {
    window.removeEventListener('online', onChange);
    window.removeEventListener('offline', onChange);
  };
}

function isOnline(): boolean {
  return navigator.onLine;
}

export function OfflineSync() {
  const router = useRouter();
  const pending = usePendingSets((s) => s.pending);
  const hydrated = usePendingSets((s) => s.hydrated);
  const syncing = usePendingSets((s) => s.syncing);
  const hydrate = usePendingSets((s) => s.hydrate);
  const settle = usePendingSets((s) => s.settle);
  const setSyncing = usePendingSets((s) => s.setSyncing);

  // useSyncExternalStore rather than an effect that calls setState: navigator
  // .onLine is an external mutable source, and reading it inside an effect
  // triggers a cascading render. The third argument is the server snapshot,
  // where there is no navigator at all.
  const online = useSyncExternalStore(subscribeToConnection, isOnline, () => true);

  useEffect(() => {
    void hydrate();
  }, [hydrate]);

  const flush = useCallback(async () => {
    if (typeof navigator !== 'undefined' && !navigator.onLine) return;

    const queue = usePendingSets.getState().pending;
    if (queue.length === 0 || usePendingSets.getState().syncing) return;

    setSyncing(true);
    let synced = 0;

    for (const item of queue) {
      try {
        await addSet(item.workoutExerciseId, item.workoutId, item.values);
        await settle(item.id);
        synced += 1;
      } catch {
        break; // still unreachable — leave the rest queued
      }
    }

    setSyncing(false);

    if (synced > 0) {
      toast.success(
        synced === 1 ? '1 offline set synced' : `${synced} offline sets synced`,
      );
      router.refresh();
    }
  }, [router, settle, setSyncing]);

  useEffect(() => {
    if (!hydrated) return;

    const goOnline = () => void flush();

    void flush();
    window.addEventListener('online', goOnline);
    return () => window.removeEventListener('online', goOnline);
  }, [hydrated, flush]);

  if (pending.length === 0 && online) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed inset-x-0 z-40 flex justify-center px-5',
        // Above the phone bottom bar; the rest timer sits above this again.
        'bottom-[calc(4.5rem+env(safe-area-inset-bottom))] lg:bottom-4',
      )}
    >
      <div className="flex items-center gap-2 rounded-full border bg-background/95 px-3 py-1.5 text-xs shadow-sm backdrop-blur">
        {syncing ? (
          <RefreshCw className="size-3.5 animate-spin text-muted-foreground" />
        ) : (
          <CloudOff className="size-3.5 text-muted-foreground" />
        )}
        <span>
          {syncing
            ? 'Syncing…'
            : pending.length > 0
              ? `${pending.length} set${pending.length === 1 ? '' : 's'} saved offline`
              : 'Offline — sets will save here'}
        </span>
      </div>
    </div>
  );
}
