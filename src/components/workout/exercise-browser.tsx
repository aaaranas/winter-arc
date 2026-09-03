'use client';

import { useState } from 'react';
import { ExercisePicker } from './exercise-picker';
import { ExerciseGuideDialog } from './exercise-guide-sheet';
import { EXERCISE_GUIDES } from '@/lib/exercise-guides';
import { getFrameUrls, type Exercise } from '@/lib/exercises';

/**
 * Browse mode: tapping a card opens its how-to steps rather than adding it to
 * a workout. Same dialog the workout logger uses, so the two cannot drift.
 */
export function ExerciseBrowser() {
  const [selected, setSelected] = useState<Exercise | null>(null);

  return (
    <>
      <ExercisePicker onSelect={setSelected} />

      <ExerciseGuideDialog
        exercise={selected}
        guide={selected ? EXERCISE_GUIDES[selected.slug] : undefined}
        frameUrls={selected ? getFrameUrls(selected) : []}
        open={selected !== null}
        onOpenChange={(open) => {
          if (!open) setSelected(null);
        }}
      />
    </>
  );
}
