'use client';

import { useTransition } from 'react';
import {
  ChevronDown,
  ChevronUp,
  Link2,
  Link2Off,
  MoreVertical,
  Trash2,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  removeWorkoutExercise,
  reorderExercise,
  toggleSuperset,
} from '@/lib/actions/workouts';
import { toast } from 'sonner';

/**
 * Per-exercise controls inside a workout: reorder, superset, remove.
 *
 * Four icon buttons in a row cost ~112px, which at 375px left so little for the
 * exercise name that "Incline Dumbbell Press" wrapped onto three lines and each
 * card became tall enough to need scrolling past. On phones they collapse into
 * a single overflow menu and the name gets the width back; from sm up, where
 * there is room, they stay inline for one-tap access.
 *
 * Supersetting joins an exercise to the one above it. That constraint keeps the
 * model simple — a superset is always a contiguous run — and matches how you
 * would write it on paper.
 */
export function ExerciseControls({
  id,
  workoutId,
  inSuperset,
  canMoveUp,
  canMoveDown,
  isFirst,
}: {
  id: string;
  workoutId: string;
  inSuperset: boolean;
  canMoveUp: boolean;
  canMoveDown: boolean;
  isFirst: boolean;
}) {
  const [pending, startTransition] = useTransition();

  const supersetDisabled = pending || (isFirst && !inSuperset);
  const supersetLabel = isFirst
    ? 'Nothing above to superset with'
    : inSuperset
      ? 'Remove from superset'
      : 'Superset with the exercise above';

  const run = (fn: () => Promise<unknown>, done?: () => void) =>
    startTransition(async () => {
      await fn();
      done?.();
    });

  const onToggleSuperset = () =>
    run(
      () => toggleSuperset(id, workoutId),
      () => toast.success(inSuperset ? 'Removed from superset' : 'Supersetted'),
    );

  return (
    <>
      {/* Phones: one button, everything behind it. */}
      <div className="shrink-0 sm:hidden">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              aria-label="Exercise options"
              disabled={pending}
              className="size-7 text-muted-foreground"
            >
              <MoreVertical className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-52">
            <DropdownMenuItem disabled={supersetDisabled} onSelect={onToggleSuperset}>
              {inSuperset ? <Link2Off className="size-4" /> : <Link2 className="size-4" />}
              {inSuperset ? 'Remove from superset' : 'Superset with above'}
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={pending || !canMoveUp}
              onSelect={() => run(() => reorderExercise(id, workoutId, 'up'))}
            >
              <ChevronUp className="size-4" />
              Move up
            </DropdownMenuItem>
            <DropdownMenuItem
              disabled={pending || !canMoveDown}
              onSelect={() => run(() => reorderExercise(id, workoutId, 'down'))}
            >
              <ChevronDown className="size-4" />
              Move down
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              variant="destructive"
              disabled={pending}
              onSelect={() => run(() => removeWorkoutExercise(id, workoutId))}
            >
              <Trash2 className="size-4" />
              Remove exercise
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      {/* Tablet and up: inline, one tap each. */}
      <div className="hidden shrink-0 items-center gap-0.5 sm:flex">
        <Button
          variant="ghost"
          size="icon"
          aria-label={inSuperset ? 'Remove from superset' : 'Superset with exercise above'}
          title={supersetLabel}
          disabled={supersetDisabled}
          className="size-7 text-muted-foreground"
          onClick={onToggleSuperset}
        >
          {inSuperset ? <Link2Off className="size-3.5" /> : <Link2 className="size-3.5" />}
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Move up"
          disabled={pending || !canMoveUp}
          className="size-7 text-muted-foreground"
          onClick={() => run(() => reorderExercise(id, workoutId, 'up'))}
        >
          <ChevronUp className="size-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Move down"
          disabled={pending || !canMoveDown}
          className="size-7 text-muted-foreground"
          onClick={() => run(() => reorderExercise(id, workoutId, 'down'))}
        >
          <ChevronDown className="size-3.5" />
        </Button>

        <Button
          variant="ghost"
          size="icon"
          aria-label="Remove exercise"
          disabled={pending}
          className="size-7 text-muted-foreground hover:text-destructive"
          onClick={() => run(() => removeWorkoutExercise(id, workoutId))}
        >
          <Trash2 className="size-3.5" />
        </Button>
      </div>
    </>
  );
}
