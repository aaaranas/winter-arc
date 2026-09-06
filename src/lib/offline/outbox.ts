/**
 * A durable queue of sets logged while offline.
 *
 * Gyms are the worst place for a signal and the only place this app is used,
 * so a set logged on a dead connection has to survive — including a reload, a
 * phone lock, or the tab being evicted from memory. That rules out React state
 * and sessionStorage; it needs real storage.
 *
 * IndexedDB rather than localStorage because localStorage is synchronous and
 * blocks the main thread, and this can be written to between sets.
 *
 * Raw IDB rather than a wrapper library: this is one object store with four
 * operations, and a dependency would be larger than the code.
 */

const DB_NAME = 'winter-arc-outbox';
const DB_VERSION = 1;
const STORE = 'pending-sets';

export type PendingSet = {
  /** Client-generated, so the row can be rendered and removed before a server
      ever sees it. */
  id: string;
  workoutExerciseId: string;
  workoutId: string;
  exerciseName: string;
  values: {
    reps: number | null;
    weight: number | null;
    unit: string;
    rpe: number | null;
    durationSec: number | null;
    distanceM: number | null;
  };
  queuedAt: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE)) {
        db.createObjectStore(STORE, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

/**
 * Every call is wrapped: IndexedDB throws in private browsing, when storage is
 * blocked, and in some embedded webviews. A failure here must never stop a set
 * being logged — it only means it cannot be replayed later.
 */
async function withStore<T>(
  mode: IDBTransactionMode,
  fn: (store: IDBObjectStore) => IDBRequest,
  fallback: T,
): Promise<T> {
  try {
    const db = await openDb();
    return await new Promise<T>((resolve, reject) => {
      const tx = db.transaction(STORE, mode);
      const request = fn(tx.objectStore(STORE));
      request.onsuccess = () => resolve(request.result as T);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  } catch {
    return fallback;
  }
}

export async function enqueueSet(entry: PendingSet): Promise<void> {
  await withStore('readwrite', (store) => store.put(entry), undefined);
}

export async function allPendingSets(): Promise<PendingSet[]> {
  const rows = await withStore<PendingSet[]>('readonly', (s) => s.getAll(), []);
  return (rows ?? []).sort((a, b) => a.queuedAt - b.queuedAt);
}

export async function removePendingSet(id: string): Promise<void> {
  await withStore('readwrite', (store) => store.delete(id), undefined);
}

export function newId(): string {
  // crypto.randomUUID is unavailable on older webviews and on http origins.
  return typeof crypto !== 'undefined' && 'randomUUID' in crypto
    ? crypto.randomUUID()
    : `pending-${Date.now()}-${Math.random().toString(36).slice(2, 10)}`;
}
