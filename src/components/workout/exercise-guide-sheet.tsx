'use client';

import { useState } from 'react';
import { BookOpen } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import type { ExerciseGuide } from '@/lib/exercise-guides';
import type { Exercise } from '@/lib/exercises';

/**
 * How-to steps for one exercise, alongside its three illustration frames.
 *
 * Split into a controlled dialog and a button that drives it, because it is
 * opened two different ways: from an icon beside an exercise while logging, and
 * by tapping a card in the Exercises browser. Same content either way.
 */

export function ExerciseGuideDialog({
  exercise,
  guide,
  frameUrls,
  open,
  onOpenChange,
}: {
  exercise: Exercise | null;
  guide: ExerciseGuide | undefined;
  frameUrls: string[];
  open: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  if (!exercise) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[85dvh] overflow-y-auto sm:max-w-lg">
        <DialogHeader>
          <DialogTitle>{exercise.name}</DialogTitle>
          <DialogDescription>
            {exercise.primaryMuscle} · {exercise.equipment}
            {exercise.secondaryMuscles.length
              ? ` · also ${exercise.secondaryMuscles.join(', ')}`
              : ''}
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-3 gap-2">
          {frameUrls.map((url, i) => (
            <figure key={url} className="space-y-1">
              <div className="relative aspect-square overflow-hidden rounded-md bg-muted/40">
                {/* Plain img: these are local, already-sized PNGs and the dialog
                    is not a place worth paying for the image optimizer. */}
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={url}
                  alt={`${exercise.name}, frame ${i + 1}`}
                  className="size-full object-contain p-2 invert dark:invert-0"
                />
              </div>
              <figcaption className="text-center text-[10px] text-muted-foreground">
                {i + 1}
              </figcaption>
            </figure>
          ))}
        </div>

        {guide ? (
          <div className="space-y-4">
            <Separator />

            <section className="space-y-1.5">
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                Setup
              </h3>
              <p className="text-sm">{guide.setup}</p>
            </section>

            <section className="space-y-1.5">
              <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                The rep
              </h3>
              <ol className="space-y-2">
                {guide.steps.map((step, i) => (
                  <li key={step} className="flex gap-3 text-sm">
                    <span className="w-4 shrink-0 tabular-nums text-muted-foreground">
                      {i + 1}
                    </span>
                    <span>{step}</span>
                  </li>
                ))}
              </ol>
            </section>

            {guide.cues?.length ? (
              <section className="space-y-1.5">
                <h3 className="text-xs font-medium tracking-wide text-muted-foreground uppercase">
                  Cues
                </h3>
                <ul className="space-y-1.5">
                  {guide.cues.map((cue) => (
                    <li key={cue} className="flex gap-3 text-sm text-muted-foreground">
                      <span aria-hidden className="text-foreground">
                        ·
                      </span>
                      <span>{cue}</span>
                    </li>
                  ))}
                </ul>
              </section>
            ) : null}

            <p className="border-t pt-3 text-xs text-muted-foreground">
              Standard form cues written for this app — the exercise package
              ships illustrations and metadata but no instruction text. Not
              coaching or medical advice.
            </p>
          </div>
        ) : (
          <p className="text-sm text-muted-foreground">
            No written guide for this exercise yet. The frames above show the
            movement.
          </p>
        )}
      </DialogContent>
    </Dialog>
  );
}

/** The icon button used beside an exercise while logging a workout. */
export function ExerciseGuideSheet({
  exercise,
  guide,
  frameUrls,
}: {
  exercise: Exercise;
  guide: ExerciseGuide | undefined;
  frameUrls: string[];
}) {
  const [open, setOpen] = useState(false);

  return (
    <>
      <Button
        variant="ghost"
        size="icon"
        aria-label={`How to do ${exercise.name}`}
        className="size-7 text-muted-foreground"
        onClick={() => setOpen(true)}
      >
        <BookOpen className="size-3.5" />
      </Button>

      <ExerciseGuideDialog
        exercise={exercise}
        guide={guide}
        frameUrls={frameUrls}
        open={open}
        onOpenChange={setOpen}
      />
    </>
  );
}
