'use client';

import { useEffect, useRef, useState } from 'react';
import { Plus, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRestTimer } from '@/stores/rest-timer';
import { cn } from '@/lib/utils';

/**
 * The rest countdown, docked above the bottom nav on phones and at the bottom
 * of the content column on desktop.
 *
 * It only exists while a rest is running, so it costs nothing the rest of the
 * time. When it reaches zero it holds at 00:00 with a "rest over" state rather
 * than vanishing, so you can see it finished if you glanced away.
 */
export function RestTimerBar() {
  const { endsAt, durationSec, label, extend, stop } = useRestTimer();
  const [now, setNow] = useState(() => Date.now());
  const announced = useRef(false);

  useEffect(() => {
    if (!endsAt) return;
    // 250ms keeps the seconds readout honest without burning battery.
    const id = setInterval(() => setNow(Date.now()), 250);
    return () => clearInterval(id);
  }, [endsAt]);

  const remainingMs = endsAt ? endsAt - now : 0;
  const done = endsAt !== null && remainingMs <= 0;

  // A short vibration when rest ends, once per timer. Silently unsupported on
  // desktop and on iOS Safari, which is fine — it is a bonus, not the signal.
  useEffect(() => {
    if (!endsAt) {
      announced.current = false;
      return;
    }
    if (done && !announced.current) {
      announced.current = true;
      try {
        navigator.vibrate?.([120, 60, 120]);
      } catch {
        // Ignore: vibration is a nicety, never a failure worth surfacing.
      }
    }
  }, [done, endsAt]);

  if (!endsAt) return null;

  const remainingSec = Math.max(0, Math.ceil(remainingMs / 1000));
  const minutes = Math.floor(remainingSec / 60);
  const seconds = remainingSec % 60;
  const elapsed = Math.min(1, 1 - remainingMs / (durationSec * 1000));

  return (
    <div
      role="status"
      aria-live="polite"
      className={cn(
        'fixed inset-x-0 z-50 border-t bg-background/95 backdrop-blur',
        // Sits directly above the phone bottom bar; on desktop there is none.
        'bottom-[calc(3.75rem+env(safe-area-inset-bottom))] lg:bottom-0',
      )}
    >
      {/* Hairline progress rule rather than a heavy bar, to match the palette. */}
      <div className="h-px w-full bg-border">
        <div
          className={cn('h-px transition-[width]', done ? 'bg-muted-foreground' : 'bg-foreground')}
          style={{ width: `${elapsed * 100}%` }}
        />
      </div>

      <div className="mx-auto flex w-full max-w-3xl items-center gap-3 px-5 py-2.5 xl:max-w-4xl">
        <div className="min-w-0 flex-1">
          <p className="text-xs text-muted-foreground">
            {done ? 'Rest over' : 'Resting'}
            {label ? ` · ${label}` : ''}
          </p>
        </div>

        <span
          className={cn(
            'font-mono text-lg tabular-nums',
            done && 'text-muted-foreground',
          )}
        >
          {minutes}:{seconds.toString().padStart(2, '0')}
        </span>

        <Button
          variant="outline"
          size="sm"
          onClick={() => extend(30)}
          className="h-8 px-2 text-xs"
        >
          <Plus className="size-3.5" />
          30s
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Dismiss rest timer"
          onClick={stop}
          className="size-8 text-muted-foreground"
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
