'use client';

import { useTransition } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { updateBodyMetrics } from '@/lib/actions/settings';
import { ACTIVITY_LEVELS, GOALS, MEAL_PATTERNS } from '@/lib/nutrition';
import { toast } from 'sonner';

export function BodyMetricsForm({
  defaults,
}: {
  defaults: {
    heightCm: number | null;
    weightKg: number | null;
    age: number | null;
    sex: string | null;
    activityLevel: string;
    goal: string;
    mealPattern: string;
  };
}) {
  const [pending, startTransition] = useTransition();

  return (
    <form
      action={(formData) =>
        startTransition(async () => {
          await updateBodyMetrics(formData);
          toast.success('Plan updated');
        })
      }
      className="space-y-5"
    >
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        <Field
          id="heightCm"
          label="Height"
          unit="cm"
          defaultValue={defaults.heightCm}
          placeholder="170"
        />
        <Field
          id="weightKg"
          label="Weight"
          unit="kg"
          defaultValue={defaults.weightKg}
          placeholder="70"
        />
        <Field id="age" label="Age" unit="yrs" defaultValue={defaults.age} placeholder="30" />

        <div className="space-y-2">
          <Label htmlFor="sex">Sex</Label>
          <Select name="sex" defaultValue={defaults.sex ?? 'unspecified'}>
            <SelectTrigger id="sex" className="w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="male">Male</SelectItem>
              <SelectItem value="female">Female</SelectItem>
              <SelectItem value="unspecified">Prefer not to say</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <p className="text-xs text-muted-foreground">
        Sex is used only by the BMR equation, which has different constants for
        men and women. Leave it unset and a midpoint is used — the plan still
        works, it is just less precise.
      </p>

      <div className="grid gap-3 sm:grid-cols-3">
        <Choice
          id="activityLevel"
          label="Activity"
          defaultValue={defaults.activityLevel}
          options={ACTIVITY_LEVELS.map((a) => ({
            value: a.value,
            label: a.label,
            hint: a.hint,
          }))}
        />
        <Choice
          id="goal"
          label="Goal"
          defaultValue={defaults.goal}
          options={GOALS.map((g) => ({ value: g.value, label: g.label, hint: g.hint }))}
        />
        <Choice
          id="mealPattern"
          label="Meals per day"
          defaultValue={defaults.mealPattern}
          options={MEAL_PATTERNS.map((m) => ({
            value: m.value,
            label: m.label,
            hint: m.hint,
          }))}
        />
      </div>

      <Button type="submit" disabled={pending}>
        Save and recalculate
      </Button>
    </form>
  );
}

function Field({
  id,
  label,
  unit,
  defaultValue,
  placeholder,
}: {
  id: string;
  label: string;
  unit: string;
  defaultValue: number | null;
  placeholder: string;
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>
        {label} <span className="text-muted-foreground">({unit})</span>
      </Label>
      <Input
        id={id}
        name={id}
        defaultValue={defaultValue ?? ''}
        placeholder={placeholder}
        inputMode="decimal"
        className="tabular-nums"
      />
    </div>
  );
}

function Choice({
  id,
  label,
  defaultValue,
  options,
}: {
  id: string;
  label: string;
  defaultValue: string;
  options: { value: string; label: string; hint: string }[];
}) {
  return (
    <div className="space-y-2">
      <Label htmlFor={id}>{label}</Label>
      <Select name={id} defaultValue={defaultValue}>
        <SelectTrigger id={id} className="w-full">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {options.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              <span className="flex flex-col items-start">
                <span>{option.label}</span>
                <span className="text-xs text-muted-foreground">{option.hint}</span>
              </span>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
