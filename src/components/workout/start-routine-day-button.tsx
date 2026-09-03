'use client';

import { useTransition } from 'react';
import { Play } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { startRoutineDay } from '@/lib/actions/workouts';

export function StartRoutineDayButton({
  routineKey,
  dayKey,
}: {
  routineKey: string;
  dayKey: string;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      size="sm"
      variant="outline"
      disabled={pending}
      className="shrink-0"
      onClick={() =>
        startTransition(async () => {
          await startRoutineDay(routineKey, dayKey);
        })
      }
    >
      <Play className="size-3.5" />
      Start
    </Button>
  );
}
