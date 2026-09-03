'use client';

import { useState, useTransition } from 'react';
import { Check, ChevronDown, Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { startRoutineDay } from '@/lib/actions/workouts';
import { setActiveRoutine } from '@/lib/actions/settings';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type DayView = {
  key: string;
  name: string;
  focus: string;
  exerciseCount: number;
  supersetCount: number;
  exercises: {
    slug: string;
    name: string;
    sets: number;
    reps: string;
    superset: string | null;
  }[];
};

type RoutineView = {
  key: string;
  name: string;
  summary: string;
  daysPerWeek: string;
  bestFor: string;
  days: DayView[];
};

export function RoutineCard({
  routine,
  isActive,
}: {
  routine: RoutineView;
  isActive: boolean;
}) {
  const [expanded, setExpanded] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();

  return (
    <Card className={cn(isActive && 'border-foreground/30')}>
      <CardContent className="space-y-4">
        <div className="flex items-start justify-between gap-3">
          <div className="min-w-0 space-y-1">
            <div className="flex flex-wrap items-center gap-2">
              <h2 className="font-medium">{routine.name}</h2>
              <Badge variant="outline" className="font-normal">
                {routine.daysPerWeek}
              </Badge>
              {isActive ? (
                <Badge className="gap-1 font-normal">
                  <Check className="size-3" />
                  Following
                </Badge>
              ) : null}
            </div>
            <p className="text-sm text-muted-foreground">{routine.summary}</p>
            <p className="text-xs text-muted-foreground">{routine.bestFor}</p>
          </div>

          <Button
            variant={isActive ? 'secondary' : 'outline'}
            size="sm"
            disabled={pending}
            className="shrink-0"
            onClick={() =>
              startTransition(async () => {
                await setActiveRoutine(isActive ? null : routine.key);
                toast.success(
                  isActive ? 'Stopped following' : `Following ${routine.name}`,
                );
              })
            }
          >
            {isActive ? 'Unfollow' : 'Follow'}
          </Button>
        </div>

        <Separator />

        <ul className="space-y-2">
          {routine.days.map((day) => {
            const open = expanded === day.key;
            return (
              <li key={day.key} className="rounded-md border">
                <div className="flex items-center gap-2 p-3">
                  <button
                    type="button"
                    onClick={() => setExpanded(open ? null : day.key)}
                    aria-expanded={open}
                    className="flex min-w-0 flex-1 items-center gap-2 text-left"
                  >
                    <ChevronDown
                      className={cn(
                        'size-4 shrink-0 text-muted-foreground transition-transform',
                        open && 'rotate-180',
                      )}
                    />
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium">
                        {day.name}
                      </span>
                      <span className="block truncate text-xs text-muted-foreground">
                        {day.focus} · {day.exerciseCount} exercises
                        {day.supersetCount > 0
                          ? ` · ${day.supersetCount} superset${day.supersetCount > 1 ? 's' : ''}`
                          : ''}
                      </span>
                    </span>
                  </button>

                  <Button
                    size="sm"
                    disabled={pending}
                    className="shrink-0"
                    onClick={() =>
                      startTransition(async () => {
                        await startRoutineDay(routine.key, day.key);
                      })
                    }
                  >
                    <Play className="size-3.5" />
                    Start
                  </Button>
                </div>

                {open ? (
                  <ol className="space-y-1 border-t px-3 py-2">
                    {day.exercises.map((exercise, i) => (
                      <li
                        key={`${exercise.slug}-${i}`}
                        className="flex items-baseline gap-3 text-sm"
                      >
                        <span className="w-4 shrink-0 text-xs tabular-nums text-muted-foreground">
                          {i + 1}
                        </span>
                        <span className="min-w-0 flex-1 truncate">
                          {exercise.name}
                          {exercise.superset ? (
                            <span className="ml-1.5 text-xs text-muted-foreground">
                              superset {exercise.superset}
                            </span>
                          ) : null}
                        </span>
                        <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                          {exercise.sets} × {exercise.reps}
                        </span>
                      </li>
                    ))}
                  </ol>
                ) : null}
              </li>
            );
          })}
        </ul>
      </CardContent>
    </Card>
  );
}
