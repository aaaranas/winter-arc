import { create } from 'zustand';

/**
 * Rest timer state.
 *
 * Stores an absolute `endsAt` timestamp rather than a counter that ticks down.
 * A counter drifts whenever the tab is backgrounded — which is exactly what
 * happens when you put the phone in your pocket between sets — whereas a
 * deadline stays correct no matter how long the interval was throttled.
 */
type RestTimerState = {
  /** Epoch ms when the rest ends, or null when idle. */
  endsAt: number | null;
  /** Duration the current rest was started with, for the progress ring. */
  durationSec: number;
  /** Label of what you just finished, e.g. "Bench Press · set 3". */
  label: string | null;
  start: (durationSec: number, label?: string) => void;
  extend: (seconds: number) => void;
  stop: () => void;
};

export const useRestTimer = create<RestTimerState>((set, get) => ({
  endsAt: null,
  durationSec: 0,
  label: null,

  start: (durationSec, label) => {
    if (durationSec <= 0) return;
    set({
      endsAt: Date.now() + durationSec * 1000,
      durationSec,
      label: label ?? null,
    });
  },

  extend: (seconds) => {
    const { endsAt, durationSec } = get();
    if (!endsAt) return;
    // Extend from now if the timer already elapsed, so "+30s" always gives 30s.
    const base = Math.max(endsAt, Date.now());
    set({ endsAt: base + seconds * 1000, durationSec: durationSec + seconds });
  },

  stop: () => set({ endsAt: null, durationSec: 0, label: null }),
}));
