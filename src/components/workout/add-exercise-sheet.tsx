'use client';

import { useState, useTransition } from 'react';
import { Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from '@/components/ui/sheet';
import { ExercisePicker } from './exercise-picker';
import { addExerciseToWorkout } from '@/lib/actions/workouts';
import { toast } from 'sonner';

export function AddExerciseSheet({
  workoutId,
  selectedSlugs,
}: {
  workoutId: string;
  selectedSlugs: string[];
}) {
  const [open, setOpen] = useState(false);
  const [, startTransition] = useTransition();

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button variant="outline" className="w-full">
          <Plus className="size-4" />
          Add exercise
        </Button>
      </SheetTrigger>
      <SheetContent
        side="bottom"
        className="flex h-[92dvh] flex-col gap-4 px-5 pb-6 data-[side=bottom]:h-[92dvh]"
      >
        <SheetHeader className="px-0">
          <SheetTitle>Add an exercise</SheetTitle>
          <SheetDescription>
            Tap an illustration to cycle its three frames.
          </SheetDescription>
        </SheetHeader>

        <ExercisePicker
          selectedSlugs={selectedSlugs}
          onSelect={(exercise) =>
            startTransition(async () => {
              await addExerciseToWorkout(workoutId, exercise.slug);
              toast.success(`Added ${exercise.name}`);
              setOpen(false);
            })
          }
        />
      </SheetContent>
    </Sheet>
  );
}
