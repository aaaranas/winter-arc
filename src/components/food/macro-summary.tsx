import { Card, CardContent } from '@/components/ui/card';
import { pctOf, type Macros } from '@/lib/macros';
import { grams, kcal } from '@/lib/format';
import { cn } from '@/lib/utils';

/**
 * Daily totals against optional targets.
 *
 * Deliberately not a chart — the brief scoped analytics out, and four numbers
 * with a progress bar each reads faster mid-day than any graph.
 *
 * The bars were originally 1px rules, which was too subtle to be read as
 * progress at all: at a glance they looked like underlines and every row
 * looked the same. They are still quiet, just thick enough that "how much
 * room is left" is answered without doing the division.
 */
export function MacroSummary({
  totals,
  targets,
}: {
  totals: Macros;
  targets: {
    calorieTarget: number | null;
    proteinTarget: number | null;
    carbsTarget: number | null;
    fatTarget: number | null;
  } | null;
}) {
  const rows = [
    { label: 'Calories', value: kcal(totals.calories), raw: totals.calories, target: targets?.calorieTarget, unit: '' },
    { label: 'Protein', value: grams(totals.proteinG), raw: totals.proteinG, target: targets?.proteinTarget, unit: 'g' },
    { label: 'Carbs', value: grams(totals.carbsG), raw: totals.carbsG, target: targets?.carbsTarget, unit: 'g' },
    { label: 'Fat', value: grams(totals.fatG), raw: totals.fatG, target: targets?.fatTarget, unit: 'g' },
  ];

  return (
    <Card>
      <CardContent className="space-y-4">
        {rows.map((row) => {
          const pct = pctOf(row.raw, row.target);
          const over = pct !== null && pct > 100;
          return (
            <div key={row.label} className="space-y-1.5">
              <div className="flex items-baseline justify-between gap-3">
                <span className="text-sm text-muted-foreground">{row.label}</span>
                <span className="text-sm font-medium tabular-nums">
                  {row.value}
                  {row.target ? (
                    <span className="font-normal text-muted-foreground">
                      {' / '}
                      {Math.round(row.target)}
                      {row.unit}
                    </span>
                  ) : null}
                </span>
              </div>
              {pct !== null ? (
                <div
                  className="h-1.5 w-full overflow-hidden rounded-full bg-border/60"
                  role="progressbar"
                  aria-valuenow={Math.round(pct)}
                  aria-valuemin={0}
                  aria-valuemax={100}
                  aria-label={`${row.label}: ${Math.round(pct)}% of target`}
                >
                  <div
                    className={cn(
                      'h-full rounded-full transition-all',
                      over ? 'bg-destructive' : 'bg-foreground',
                    )}
                    style={{ width: `${Math.min(100, pct)}%` }}
                  />
                </div>
              ) : null}
            </div>
          );
        })}
        {!targets?.calorieTarget ? (
          <p className="pt-1 text-xs text-muted-foreground">
            Set targets in Settings to see progress.
          </p>
        ) : null}
      </CardContent>
    </Card>
  );
}
