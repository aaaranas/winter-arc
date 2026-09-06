'use client';

import { useTransition } from 'react';
import { ArrowDown, ArrowUp, Minus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkline } from '@/components/charts/sparkline';
import { logBodyWeight, deleteBodyWeightEntry } from '@/lib/actions/body-weight';
import { num } from '@/lib/format';
import { friendlyDay, todayKey } from '@/lib/dates';
import { toast } from 'sonner';

type Entry = { id: string; date: Date; weightKg: number; note: string | null };

/**
 * Weight logging and its trend.
 *
 * The headline number is the seven-day average, not today's reading. Weight
 * swings a kilo or more day to day on water and food alone, so the single
 * reading is noise and acting on it leads people to change a plan that was
 * working.
 */
export function WeightCard({
  entries,
  latest,
  trend,
  weeklyChange,
  unit,
}: {
  entries: Entry[];
  latest: number | null;
  trend: number | null;
  weeklyChange: number | null;
  unit: string;
}) {
  const [pending, startTransition] = useTransition();

  // Oldest-first for the line; the query returns newest-first.
  const series = [...entries].reverse().map((e) => e.weightKg);
  const recent = entries.slice(0, 5);

  const Direction =
    weeklyChange === null || Math.abs(weeklyChange) < 0.05
      ? Minus
      : weeklyChange > 0
        ? ArrowUp
        : ArrowDown;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Weight</CardTitle>
      </CardHeader>
      <CardContent className="space-y-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div className="space-y-0.5">
            <p className="text-3xl font-semibold tabular-nums">
              {trend !== null ? num(trend) : latest !== null ? num(latest) : '—'}
              <span className="ml-1 text-sm font-normal text-muted-foreground">
                {unit}
              </span>
            </p>
            <p className="text-xs text-muted-foreground">
              {trend !== null ? '7-day average' : latest !== null ? 'latest reading' : 'nothing logged yet'}
            </p>
          </div>

          {weeklyChange !== null ? (
            <div className="flex items-center gap-1.5 text-sm">
              <Direction className="size-4 text-muted-foreground" />
              <span className="tabular-nums">
                {weeklyChange > 0 ? '+' : ''}
                {num(weeklyChange, 2)} {unit}
              </span>
              <span className="text-muted-foreground">/ week</span>
            </div>
          ) : null}
        </div>

        {series.length >= 2 ? (
          <Sparkline
            values={series}
            width={520}
            height={56}
            className="w-full text-foreground/70"
            ariaLabel={`Weight over the last ${series.length} readings`}
          />
        ) : null}

        <form
          action={(formData) =>
            startTransition(async () => {
              await logBodyWeight(formData);
              toast.success("Today's weight saved");
            })
          }
          className="flex items-end gap-2"
        >
          <input type="hidden" name="date" value={todayKey()} />
          <div className="space-y-2">
            <Label htmlFor="todayWeight">Today ({unit})</Label>
            <Input
              id="todayWeight"
              name="weightKg"
              inputMode="decimal"
              placeholder={latest !== null ? num(latest) : '70'}
              className="w-28 tabular-nums"
              required
            />
          </div>
          <Button type="submit" disabled={pending}>
            Log
          </Button>
        </form>

        {recent.length > 0 ? (
          <ul className="space-y-1 border-t pt-3">
            {recent.map((entry) => (
              <li
                key={entry.id}
                className="flex items-center gap-3 rounded-md px-1 py-1 text-sm hover:bg-accent/40"
              >
                <span className="flex-1 text-muted-foreground">
                  {friendlyDay(entry.date)}
                </span>
                <span className="tabular-nums">
                  {num(entry.weightKg)} {unit}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  aria-label={`Delete reading for ${friendlyDay(entry.date)}`}
                  disabled={pending}
                  className="size-7 text-muted-foreground hover:text-destructive"
                  onClick={() =>
                    startTransition(async () => {
                      await deleteBodyWeightEntry(entry.id);
                    })
                  }
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="border-t pt-3 text-xs text-muted-foreground">
            Log a few mornings in a row and the plan will follow the trend rather
            than a number typed in once.
          </p>
        )}
      </CardContent>
    </Card>
  );
}
