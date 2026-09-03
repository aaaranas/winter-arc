'use client';

import { useTransition } from 'react';
import { Check, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { deleteWorkout, finishWorkout } from '@/lib/actions/workouts';
import { toast } from 'sonner';

export function FinishWorkoutButton({ workoutId }: { workoutId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      className="w-full"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await finishWorkout(workoutId);
          toast.success('Workout finished.');
        })
      }
    >
      <Check className="size-4" />
      Finish workout
    </Button>
  );
}

export function DeleteWorkoutButton({ workoutId }: { workoutId: string }) {
  const [pending, startTransition] = useTransition();
  return (
    <Button
      variant="ghost"
      size="sm"
      disabled={pending}
      className="text-muted-foreground hover:text-destructive"
      onClick={() => {
        if (!confirm('Delete this workout and all its sets?')) return;
        startTransition(async () => {
          await deleteWorkout(workoutId);
        });
      }}
    >
      <Trash2 className="size-4" />
      Delete
    </Button>
  );
}
