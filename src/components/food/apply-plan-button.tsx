'use client';

import { useTransition } from 'react';
import { Check } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { applyPlanAsTargets } from '@/lib/actions/settings';
import { toast } from 'sonner';

/**
 * Copies the computed plan into the daily targets used by the food log, so the
 * numbers are entered once rather than typed into two places that then drift.
 */
export function ApplyPlanButton({
  targets,
  alreadyApplied,
}: {
  targets: { calories: number; protein: number; carbs: number; fat: number };
  alreadyApplied: boolean;
}) {
  const [pending, startTransition] = useTransition();

  return (
    <Button
      variant={alreadyApplied ? 'outline' : 'default'}
      size="sm"
      disabled={pending}
      onClick={() =>
        startTransition(async () => {
          await applyPlanAsTargets(targets);
          toast.success('Daily targets updated');
        })
      }
    >
      {alreadyApplied ? <Check className="size-4" /> : null}
      {alreadyApplied ? 'Targets match plan' : 'Use as my daily targets'}
    </Button>
  );
}
