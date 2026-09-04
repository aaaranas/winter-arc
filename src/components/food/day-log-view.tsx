import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { PageHeader } from '@/components/layout/page-header';
import { MacroSummary } from './macro-summary';
import { LogEntryList } from './log-entry-list';
import { FoodSearchSheet, type FoodOption } from './food-search-sheet';
import { db } from '@/lib/db';
import { requireUserId } from '@/lib/user';
import { visibleFoods } from '@/lib/food-scope';
import { getDayTotals, getRecentFoods, getSettings } from '@/lib/queries';
import { dayKey, friendlyDay, fromDayKey } from '@/lib/dates';

/**
 * One day of eating. Shared by /food (today) and /food/[day] so the two views
 * cannot drift apart.
 */
export async function DayLogView({ day }: { day: string }) {
  const date = fromDayKey(day);

  const [{ entries, totals }, settings, foods, recent] = await Promise.all([
    getDayTotals(day),
    getSettings(),
    db.foodItem.findMany({
      where: visibleFoods(await requireUserId()),
      orderBy: { name: 'asc' },
    }),
    getRecentFoods(),
  ]);

  const prev = dayKey(new Date(date.getTime() - 86_400_000));
  const next = dayKey(new Date(date.getTime() + 86_400_000));
  const isToday = day === dayKey(new Date());

  return (
    <div>
      <PageHeader
        title={friendlyDay(date)}
        description={`${entries.length} ${entries.length === 1 ? 'item' : 'items'} logged`}
        action={
          <div className="flex items-center gap-1">
            <Button
              asChild
              variant="ghost"
              size="icon"
              aria-label="Previous day"
              className="size-8 text-muted-foreground"
            >
              <Link href={`/food/${prev}`}>
                <ChevronLeft className="size-4" />
              </Link>
            </Button>
            <Button
              asChild
              variant="ghost"
              size="icon"
              aria-label="Next day"
              disabled={isToday}
              className="size-8 text-muted-foreground"
            >
              <Link href={`/food/${next}`}>
                <ChevronRight className="size-4" />
              </Link>
            </Button>
          </div>
        }
      />

      <div className="space-y-6">
        <MacroSummary totals={totals} targets={settings} />

        <FoodSearchSheet
          dayKey={day}
          foods={foods as FoodOption[]}
          recent={recent as FoodOption[]}
        />

        <LogEntryList entries={entries} dayKey={day} />
      </div>
    </div>
  );
}
