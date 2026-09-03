'use client';

import { useState } from 'react';
import Image from 'next/image';
import { cn } from '@/lib/utils';
import { getFrameUrls, type Exercise } from '@/lib/exercises';

/**
 * The package's PNGs are pure-white line art on transparency (verified: every
 * opaque pixel has luminance 255). That reads perfectly on our dark default and
 * is INVISIBLE on white, so light mode inverts them to black.
 *
 * Hence `invert dark:invert-0` on the image — remove it and light mode renders
 * blank cards.
 */
export function ExerciseIllustration({
  exercise,
  className,
  animate = false,
  sizes = '96px',
  priority = false,
}: {
  exercise: Exercise;
  className?: string;
  /** Cycle through the three frames on hover/tap to show the movement. */
  animate?: boolean;
  sizes?: string;
  priority?: boolean;
}) {
  const frames = getFrameUrls(exercise);
  const [frame, setFrame] = useState(0);

  const cycle = () => {
    if (animate) setFrame((f) => (f + 1) % frames.length);
  };

  return (
    <div
      className={cn(
        'relative aspect-square overflow-hidden rounded-md bg-muted/40',
        animate && 'cursor-pointer',
        className,
      )}
      onMouseEnter={cycle}
      onClick={cycle}
    >
      <Image
        src={frames[frame] ?? frames[0]}
        alt={`${exercise.name}, frame ${frame + 1}`}
        fill
        sizes={sizes}
        priority={priority}
        className="object-contain p-2 invert dark:invert-0"
      />
    </div>
  );
}
