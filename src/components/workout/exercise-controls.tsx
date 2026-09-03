'use client';

import { useTransition } from 'react';
import { ChevronDown, ChevronUp, Link2, Link2Off, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  removeWorkoutExercise,
  reorderExercise,
  toggleSuperset,
} from '@/lib/actions/workouts';
import { toast } from 'sonner';

/**
 * Per-exercise controls inside a workout: reorder, superset, remove.
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

  return (
    <div className="flex shrink-0 items-center gap-0.5">
      <Button
        variant="ghost"
        size="icon"
        aria-label={inSuperset ? 'Remove from superset' : 'Superset with exercise above'}
        title={
          isFirst
            ? 'Nothing above to superset with'
            : inSuperset
              ? 'Remove from superset'
              : 'Superset with the exercise above'
        }
        disabled={pending || (isFirst && !inSuperset)}
        className="size-7 text-muted-foreground"
        onClick={() =>
          startTransition(async () => {
            await toggleSuperset(id, workoutId);
            toast.success(inSuperset ? 'Removed from superset' : 'Supersetted');
          })
        }
      >
        {inSuperset ? <Link2Off className="size-3.5" /> : <Link2 className="size-3.5" />}
      </Button>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Move up"
        disabled={pending || !canMoveUp}
        className="size-7 text-muted-foreground"
        onClick={() =>
          startTransition(async () => {
            await reorderExercise(id, workoutId, 'up');
          })
        }
      >
        <ChevronUp className="size-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Move down"
        disabled={pending || !canMoveDown}
        className="size-7 text-muted-foreground"
        onClick={() =>
          startTransition(async () => {
            await reorderExercise(id, workoutId, 'down');
          })
        }
      >
        <ChevronDown className="size-3.5" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        aria-label="Remove exercise"
        disabled={pending}
        className="size-7 text-muted-foreground hover:text-destructive"
        onClick={() =>
          startTransition(async () => {
            await removeWorkoutExercise(id, workoutId);
          })
        }
      >
        <Trash2 className="size-3.5" />
      </Button>
    </div>
  );
}
