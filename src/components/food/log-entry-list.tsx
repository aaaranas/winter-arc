'use client';

import { useTransition } from 'react';
import { Minus, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SourceBadge } from './source-badge';
import { deleteLogEntry, updateLogEntry } from '@/lib/actions/food';
import { grams, kcal, mealLabel, num, MEAL_TYPES } from '@/lib/format';
import { scale } from '@/lib/macros';

export type LogEntryView = {
  id: string;
  quantity: number;
  mealType: string;
  foodItem: {
    id: string;
    name: string;
    brand: string | null;
    sourceType: string;
    isEstimate: boolean;
    calories: number;
    proteinG: number;
    carbsG: number;
    fatG: number;
    servingSize: number;
    servingUnit: string;
    servingLabel: string | null;
  };
};

/** Entries grouped by meal, each row adjustable by half-servings. */
export function LogEntryList({
  entries,
  dayKey,
}: {
  entries: LogEntryView[];
  dayKey: string;
}) {
  if (entries.length === 0) {
    return (
      <p className="rounded-lg border border-dashed py-12 text-center text-sm text-muted-foreground">
        Nothing logged yet.
      </p>
    );
  }

  return (
    <div className="space-y-6">
      {MEAL_TYPES.map((meal) => {
        const rows = entries.filter((e) => e.mealType === meal);
        if (rows.length === 0) return null;

        const mealCalories = rows.reduce(
          (n, e) => n + e.foodItem.calories * e.quantity,
          0,
        );

        return (
          <section key={meal} className="space-y-2">
            <div className="flex items-baseline justify-between">
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                {mealLabel(meal)}
              </h3>
              <span className="text-xs text-muted-foreground tabular-nums">
                {kcal(mealCalories)} kcal
              </span>
            </div>
            <ul className="space-y-1">
              {rows.map((entry) => (
                <EntryRow key={entry.id} entry={entry} dayKey={dayKey} />
              ))}
            </ul>
          </section>
        );
      })}
    </div>
  );
}

function EntryRow({
  entry,
  dayKey,
}: {
  entry: LogEntryView;
  dayKey: string;
}) {
  const [pending, startTransition] = useTransition();
  const macros = scale(entry.foodItem, entry.quantity);

  const setQuantity = (next: number) => {
    if (next <= 0) return;
    startTransition(async () => {
      await updateLogEntry(entry.id, dayKey, next);
    });
  };

  return (
    <li className="flex items-center gap-2 rounded-md px-2 py-2 hover:bg-accent/40">
      <div className="min-w-0 flex-1 space-y-0.5">
        <div className="flex items-center gap-2">
          <p className="truncate text-sm font-medium">{entry.foodItem.name}</p>
          <SourceBadge
            sourceType={entry.foodItem.sourceType}
            isEstimate={entry.foodItem.isEstimate}
          />
        </div>
        <p className="truncate text-xs text-muted-foreground">
          {num(entry.quantity, 2)} ×{' '}
          {entry.foodItem.servingLabel ??
            `${entry.foodItem.servingSize}${entry.foodItem.servingUnit}`}
          {' · '}
          {grams(macros.proteinG)} P · {grams(macros.carbsG)} C ·{' '}
          {grams(macros.fatG)} F
        </p>
      </div>

      <div className="flex shrink-0 items-center gap-0.5">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Decrease quantity"
          disabled={pending}
          className="size-7 text-muted-foreground"
          onClick={() => setQuantity(Math.max(0.5, entry.quantity - 0.5))}
        >
          <Minus className="size-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Increase quantity"
          disabled={pending}
          className="size-7 text-muted-foreground"
          onClick={() => setQuantity(entry.quantity + 0.5)}
        >
          <Plus className="size-3.5" />
        </Button>
      </div>

      <span className="w-12 shrink-0 text-right text-sm font-medium tabular-nums">
        {kcal(macros.calories)}
      </span>

      <Button
        variant="ghost"
        size="icon"
        aria-label={`Remove ${entry.foodItem.name}`}
        disabled={pending}
        className="size-7 shrink-0 text-muted-foreground hover:text-destructive"
        onClick={() =>
          startTransition(async () => {
            await deleteLogEntry(entry.id, dayKey);
          })
        }
      >
        <Trash2 className="size-3.5" />
      </Button>
    </li>
  );
}
