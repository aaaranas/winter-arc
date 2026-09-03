'use client';

import { useMemo, useState, useTransition } from 'react';
import { Search, X } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { ExerciseIllustration } from './exercise-illustration';
import {
  EQUIPMENT,
  MUSCLE_GROUPS,
  searchExercises,
  type Exercise,
} from '@/lib/exercises';
import { cn } from '@/lib/utils';

/**
 * Search + filter over all 302 exercises.
 *
 * Filtering is delegated to the package's own searchExercises() rather than
 * reimplemented here — it already normalises accents and punctuation and
 * matches across name, muscle and equipment.
 *
 * All 302 exercises and their metadata are bundled in the JS, so this runs
 * entirely client-side with no network round-trip per keystroke.
 */
export function ExercisePicker({
  onSelect,
  selectedSlugs = [],
  emptyHint,
}: {
  onSelect?: (exercise: Exercise) => void;
  selectedSlugs?: string[];
  emptyHint?: string;
}) {
  const [query, setQuery] = useState('');
  const [muscle, setMuscle] = useState<string | null>(null);
  const [equipment, setEquipment] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  const results = useMemo(
    () =>
      searchExercises(query, {
        ...(muscle ? { primaryMuscle: muscle } : {}),
        ...(equipment ? { equipment } : {}),
      }),
    [query, muscle, equipment],
  );

  const hasFilters = Boolean(query || muscle || equipment);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4">
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-3 size-4 -translate-y-1/2 text-muted-foreground" />
        <Input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search 302 exercises"
          className="pl-9"
          autoComplete="off"
        />
        {hasFilters ? (
          <Button
            variant="ghost"
            size="icon"
            aria-label="Clear filters"
            onClick={() => {
              setQuery('');
              setMuscle(null);
              setEquipment(null);
            }}
            className="absolute top-1/2 right-1 size-7 -translate-y-1/2 text-muted-foreground"
          >
            <X className="size-4" />
          </Button>
        ) : null}
      </div>

      <FilterRow
        label="Muscle"
        options={MUSCLE_GROUPS}
        value={muscle}
        onChange={setMuscle}
      />
      <FilterRow
        label="Equipment"
        options={EQUIPMENT}
        value={equipment}
        onChange={setEquipment}
      />

      <p className="text-xs text-muted-foreground tabular-nums">
        {results.length} {results.length === 1 ? 'exercise' : 'exercises'}
      </p>

      <ScrollArea className="min-h-0 flex-1">
        {results.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            {emptyHint ?? 'Nothing matches those filters.'}
          </p>
        ) : (
          <ul className="grid grid-cols-2 gap-3 pr-3 sm:grid-cols-3">
            {results.map((exercise) => {
              const selected = selectedSlugs.includes(exercise.slug);
              return (
                <li key={exercise.id}>
                  <button
                    type="button"
                    disabled={pending}
                    onClick={() =>
                      startTransition(() => onSelect?.(exercise))
                    }
                    className={cn(
                      'group flex w-full flex-col gap-3 rounded-lg border p-3 text-left transition-colors',
                      'hover:bg-accent/50 disabled:opacity-50',
                      selected && 'border-foreground/30 bg-accent/40',
                    )}
                  >
                    {/* Generous breathing room around each illustration, as on
                        the package's own gallery site. */}
                    <ExerciseIllustration
                      exercise={exercise}
                      animate
                      sizes="(max-width: 640px) 45vw, 200px"
                    />
                    <div className="space-y-1">
                      <p className="text-sm leading-tight font-medium">
                        {exercise.name}
                      </p>
                      <p className="truncate text-xs text-muted-foreground">
                        {exercise.primaryMuscle} · {exercise.equipment}
                      </p>
                    </div>
                  </button>
                </li>
              );
            })}
          </ul>
        )}
      </ScrollArea>
    </div>
  );
}

function FilterRow({
  label,
  options,
  value,
  onChange,
}: {
  label: string;
  options: string[];
  value: string | null;
  onChange: (next: string | null) => void;
}) {
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted-foreground">{label}</p>
      {/* Scrolls sideways on phones where there is no room; wraps on wider
          screens so chips are not clipped mid-word. */}
      <div className="-mx-5 overflow-x-auto px-5 sm:mx-0 sm:overflow-visible sm:px-0">
        <div className="flex w-max gap-1.5 pb-1 sm:w-auto sm:flex-wrap">
          {options.map((option) => {
            const active = value === option;
            return (
              <Badge
                key={option}
                variant={active ? 'default' : 'outline'}
                onClick={() => onChange(active ? null : option)}
                className="cursor-pointer font-normal whitespace-nowrap"
              >
                {option}
              </Badge>
            );
          })}
        </div>
      </div>
    </div>
  );
}
