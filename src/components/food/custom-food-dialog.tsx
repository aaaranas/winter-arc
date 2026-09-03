'use client';

import { useState, useTransition, type ReactNode } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { createCustomFood, logFood } from '@/lib/actions/food';
import { toast } from 'sonner';

/**
 * Manual entry for anything not in the seed set.
 *
 * The brief called this out as mattering more than dataset completeness, so it
 * is reachable from two places: the empty state of a failed search, and a
 * permanent button at the bottom of the food sheet.
 *
 * Creating a food also logs it straight away — typing macros in and then having
 * to search for what you just typed would be daft.
 */
export function CustomFoodDialog({
  dayKey,
  meal,
  defaultName = '',
  onDone,
  trigger,
}: {
  dayKey: string;
  meal: string;
  defaultName?: string;
  onDone?: () => void;
  trigger?: ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const [pending, startTransition] = useTransition();

  const submit = (formData: FormData) => {
    const name = (formData.get('name') as string)?.trim();
    if (!name) {
      toast.error('Give the food a name.');
      return;
    }

    startTransition(async () => {
      const food = await createCustomFood(formData);
      await logFood(dayKey, food.id, 1, meal);
      toast.success(`Added and logged ${food.name}`);
      setOpen(false);
      onDone?.();
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger ?? <Button variant="outline">Add a custom food</Button>}
      </DialogTrigger>

      <DialogContent className="max-h-[90dvh] overflow-y-auto sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Custom food</DialogTitle>
          <DialogDescription>
            Macros for one serving. It is saved for next time.
          </DialogDescription>
        </DialogHeader>

        <form action={submit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="cf-name">Name</Label>
            <Input
              id="cf-name"
              name="name"
              defaultValue={defaultName}
              placeholder="Tinolang manok, lola's recipe"
              required
              autoComplete="off"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="cf-brand">Brand (optional)</Label>
            <Input id="cf-brand" name="brand" autoComplete="off" />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberField id="cf-serving" name="servingSize" label="Serving" defaultValue="100" />
            <div className="space-y-2">
              <Label htmlFor="cf-unit">Unit</Label>
              <Input id="cf-unit" name="servingUnit" defaultValue="g" />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="cf-serving-label">Serving label (optional)</Label>
            <Input
              id="cf-serving-label"
              name="servingLabel"
              placeholder="1 bowl"
              autoComplete="off"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <NumberField id="cf-cal" name="calories" label="Calories" />
            <NumberField id="cf-pro" name="proteinG" label="Protein (g)" />
            <NumberField id="cf-carb" name="carbsG" label="Carbs (g)" />
            <NumberField id="cf-fat" name="fatG" label="Fat (g)" />
          </div>

          <DialogFooter>
            <Button type="submit" disabled={pending} className="w-full">
              Add and log
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function NumberField({
  id,
  name,
  label,
  defaultValue = '',
}: {
  id: string;
  name: string;
  label: string;
  defaultValue?: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Input
        id={id}
        name={name}
        defaultValue={defaultValue}
        inputMode="decimal"
        placeholder="0"
        className="tabular-nums"
      />
    </div>
  );
}
