import { create } from 'zustand';
import {
  allPendingSets,
  enqueueSet,
  newId,
  removePendingSet,
  type PendingSet,
} from '@/lib/offline/outbox';

/**
 * Reactive mirror of the offline outbox.
 *
 * IndexedDB is the durable record; this store is what the UI renders from, so
 * a set logged with no signal appears in the list immediately instead of
 * vanishing until connectivity returns. The two are kept in step: every
 * mutation writes to IDB first, then updates the store.
 */
type PendingSetsState = {
  pending: PendingSet[];
  /** Set once the queue has been read back from IndexedDB after a load. */
  hydrated: boolean;
  syncing: boolean;
  hydrate: () => Promise<void>;
  queue: (entry: Omit<PendingSet, 'id' | 'queuedAt'>) => Promise<void>;
  settle: (id: string) => Promise<void>;
  setSyncing: (syncing: boolean) => void;
};

export const usePendingSets = create<PendingSetsState>((set, get) => ({
  pending: [],
  hydrated: false,
  syncing: false,

  hydrate: async () => {
    const pending = await allPendingSets();
    set({ pending, hydrated: true });
  },

  queue: async (entry) => {
    const record: PendingSet = { ...entry, id: newId(), queuedAt: Date.now() };
    await enqueueSet(record);
    set({ pending: [...get().pending, record] });
  },

  settle: async (id) => {
    await removePendingSet(id);
    set({ pending: get().pending.filter((p) => p.id !== id) });
  },

  setSyncing: (syncing) => set({ syncing }),
}));

/** Pending sets for one exercise, so the logger can render them inline. */
export function pendingForExercise(
  pending: PendingSet[],
  workoutExerciseId: string,
): PendingSet[] {
  return pending.filter((p) => p.workoutExerciseId === workoutExerciseId);
}
