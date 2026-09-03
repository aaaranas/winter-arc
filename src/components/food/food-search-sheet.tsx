'use client';

import { useMemo, useState, useTransition } from 'react';
import { Plus, Search, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { SourceBadge } from './source-badge';
import { CustomFoodDialog } from './custom-food-dialog';
import { logFood } from '@/lib/actions/food';
import { MEAL_TYPES, grams, kcal, mealLabel } from '@/lib/format';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';

export type FoodOption = {
  id: string;
  name: string;
  brand: string | null;
  category: string;
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

const CATEGORIES = [
  { value: 'ALL', label: 'All' },
  { value: 'STAPLE', label: 'Staples' },
  { value: 'PACKAGED', label: 'Packaged' },
  { value: 'HOME_COOKED', label: 'Home-cooked' },
  { value: 'FASTFOOD', label: 'Fast food' },
  { value: 'CUSTOM', label: 'Mine' },
];

/**
 * Food search and quick-add.
 *
 * The whole catalogue is passed in from the server and filtered on the client:
 * it is a few hundred rows, so this avoids a round-trip per keystroke and keeps
 * the search snappy on a phone.
 */
export function FoodSearchSheet({
  foods,
  dayKey,
  recent,
}: {
  foods: FoodOption[];
  dayKey: string;
  recent: FoodOption[];
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState('');
  const [category, setCategory] = useState('ALL');
  const [meal, setMeal] = useState<string>('SNACK');
  const [, startTransition] = useTransition();

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    return foods
      .filter((f) => (category === 'ALL' ? true : f.category === category))
      .filter(
        (f) =>
          !q ||
          f.name.toLowerCase().includes(q) ||
          (f.brand ?? '').toLowerCase().includes(q),
      )
      .slice(0, 80);
  }, [foods, query, category]);

  const add = (food: FoodOption, quantity = 1) => {
    startTransition(async () => {
      await logFood(dayKey, food.id, quantity, meal);
      toast.success(`Logged ${food.name}`);
      setOpen(false);
    });
  };

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button className="w-full">
          <Plus className="size-4" />
          Log food
        </Button>
      </SheetTrigger>

      <SheetContent
        side="bottom"
        className="flex h-[92dvh] flex-col gap-4 px-5 pb-6 data-[side=bottom]:h-[92dvh]"
      >
        <SheetHeader className="px-0">
          <SheetTitle>Log food</SheetTitle>
          <SheetDescription>
            Tap to add one serving. Estimates are labelled.
          </SheetDescription>
        </SheetHeader>

        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search foods"
              className="pl-9"
              autoComplete="off"
            />
            {query ? (
              <Button
                variant="ghost"
                size="icon"
                aria-label="Clear search"
                onClick={() => setQuery('')}
                className="absolute top-1/2 right-1 size-7 -translate-y-1/2 text-muted-foreground"
              >
                <X className="size-4" />
              </Button>
            ) : null}
          </div>

          <Select value={meal} onValueChange={setMeal}>
            <SelectTrigger className="w-32" aria-label="Meal">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {MEAL_TYPES.map((m) => (
                <SelectItem key={m} value={m}>
                  {mealLabel(m)}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="-mx-5 overflow-x-auto px-5">
          <div className="flex w-max gap-1.5 pb-1">
            {CATEGORIES.map((c) => (
              <Badge
                key={c.value}
                variant={category === c.value ? 'default' : 'outline'}
                onClick={() => setCategory(c.value)}
                className="cursor-pointer font-normal whitespace-nowrap"
              >
                {c.label}
              </Badge>
            ))}
          </div>
        </div>

        <ScrollArea className="min-h-0 flex-1">
          <div className="space-y-4 pr-3">
            {!query && recent.length > 0 ? (
              <section className="space-y-2">
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Recent
                </p>
                <ul className="space-y-1">
                  {recent.map((f) => (
                    <FoodRow key={`recent-${f.id}`} food={f} onAdd={add} />
                  ))}
                </ul>
              </section>
            ) : null}

            <section className="space-y-2">
              {!query && recent.length > 0 ? (
                <p className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  All foods
                </p>
              ) : null}
              {results.length === 0 ? (
                <div className="space-y-4 py-10 text-center">
                  <p className="text-sm text-muted-foreground">
                    Nothing matches that search.
                  </p>
                  <CustomFoodDialog
                    defaultName={query}
                    dayKey={dayKey}
                    meal={meal}
                    onDone={() => setOpen(false)}
                  />
                </div>
              ) : (
                <ul className="space-y-1">
                  {results.map((f) => (
                    <FoodRow key={f.id} food={f} onAdd={add} />
                  ))}
                </ul>
              )}
            </section>
          </div>
        </ScrollArea>

        <CustomFoodDialog
          dayKey={dayKey}
          meal={meal}
          onDone={() => setOpen(false)}
          trigger={
            <Button variant="outline" className="w-full">
              Add a custom food
            </Button>
          }
        />
      </SheetContent>
    </Sheet>
  );
}

function FoodRow({
  food,
  onAdd,
}: {
  food: FoodOption;
  onAdd: (food: FoodOption) => void;
}) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onAdd(food)}
        className={cn(
          'flex w-full items-center gap-3 rounded-md px-2 py-2.5 text-left transition-colors',
          'hover:bg-accent/50',
        )}
      >
        <div className="min-w-0 flex-1 space-y-0.5">
          <div className="flex items-center gap-2">
            <p className="truncate text-sm font-medium">{food.name}</p>
            <SourceBadge
              sourceType={food.sourceType}
              isEstimate={food.isEstimate}
            />
          </div>
          <p className="truncate text-xs text-muted-foreground">
            {food.brand ? `${food.brand} · ` : ''}
            {food.servingLabel ?? `${food.servingSize}${food.servingUnit}`}
            {' · '}
            {grams(food.proteinG)} P · {grams(food.carbsG)} C ·{' '}
            {grams(food.fatG)} F
          </p>
        </div>
        <span className="shrink-0 text-sm font-medium tabular-nums">
          {kcal(food.calories)}
        </span>
      </button>
    </li>
  );
}
