'use client';

import { useState, useTransition } from 'react';
import { Plus, Trash2, Trophy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { addSet, deleteSet } from '@/lib/actions/workouts';
import { setFieldsFor, type ExerciseType } from '@/lib/exercises';
import { formatDuration } from '@/lib/dates';
import { num } from '@/lib/format';
import { useRestTimer } from '@/stores/rest-timer';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';

type SetRow = {
  id: string;
  position: number;
  reps: number | null;
  weight: number | null;
  unit: string;
  rpe: number | null;
  durationSec: number | null;
  distanceM: number | null;
};

/** Epley, mirroring the server so the client can spot a PR immediately. */
function estimate1Rm(weight: number | null, reps: number | null): number | null {
  if (!weight || weight <= 0 || !reps || reps <= 0) return null;
  return weight * (1 + reps / 30);
}

/**
 * Add-sets-on-the-fly logger.
 *
 * Which inputs appear is driven by the exercise type, so a plank asks for time
 * and a run asks for distance instead of showing reps x weight for everything.
 *
 * New rows prefill from the previous set, because the common case mid-workout
 * is "same again".
 */
export function SetLogger({
  workoutExerciseId,
  workoutId,
  exerciseName,
  exerciseType,
  sets,
  defaultUnit,
  restTimerSec,
  /** False for every exercise in a superset except the last — you do not rest
      inside a superset, only after finishing the round. */
  restAfterSet,
  targetSets,
  targetReps,
  prSetIds,
  /** Best e1RM / reps / duration logged for this exercise before today's sets. */
  currentBest,
}: {
  workoutExerciseId: string;
  workoutId: string;
  exerciseName: string;
  exerciseType: ExerciseType;
  sets: SetRow[];
  defaultUnit: string;
  restTimerSec: number;
  restAfterSet: boolean;
  targetSets: number | null;
  targetReps: string | null;
  prSetIds: string[];
  currentBest: { e1rm: number | null; reps: number | null; durationSec: number | null } | null;
}) {
  const fields = setFieldsFor(exerciseType);
  const last = sets[sets.length - 1];
  const [pending, startTransition] = useTransition();
  const startRest = useRestTimer((s) => s.start);

  const [reps, setReps] = useState(last?.reps?.toString() ?? '');
  const [weight, setWeight] = useState(last?.weight?.toString() ?? '');
  const [duration, setDuration] = useState(last?.durationSec?.toString() ?? '');
  const [distance, setDistance] = useState(last?.distanceM?.toString() ?? '');
  const [rpe, setRpe] = useState('');

  const parse = (v: string) => {
    const n = Number(v);
    return v.trim() !== '' && Number.isFinite(n) ? n : null;
  };

  const submit = () => {
    const payload = {
      reps: fields.reps ? parse(reps) : null,
      weight: fields.weight ? parse(weight) : null,
      durationSec: fields.duration ? parse(duration) : null,
      distanceM: fields.distance ? parse(distance) : null,
      rpe: parse(rpe),
      unit: defaultUnit,
    };

    const hasValue =
      payload.reps !== null ||
      payload.weight !== null ||
      payload.durationSec !== null ||
      payload.distanceM !== null;

    if (!hasValue) {
      toast.error('Enter at least one value for the set.');
      return;
    }

    // Work out whether this beats the record before writing, so the celebration
    // is immediate rather than waiting for the page to revalidate.
    const isPr = beatsBest(payload, currentBest);

    startTransition(async () => {
      await addSet(workoutExerciseId, workoutId, payload);
      setRpe('');

      if (isPr) {
        toast.success(`New PR — ${exerciseName}`, {
          description: describeValues(payload, defaultUnit),
        });
      }

      if (restAfterSet && restTimerSec > 0) {
        startRest(restTimerSec, `${exerciseName} · set ${sets.length + 1}`);
      }
    });
  };

  const prSet = new Set(prSetIds);

  return (
    <div className="space-y-3">
      {targetSets ? (
        <p className="text-xs text-muted-foreground">
          Target: {targetSets} × {targetReps ?? '—'}
          {sets.length > 0 ? ` · ${sets.length} logged` : ''}
        </p>
      ) : null}

      {sets.length > 0 ? (
        <ol className="space-y-1">
          {sets.map((set, i) => (
            <li
              key={set.id}
              className="flex items-center gap-3 rounded-md px-2 py-1.5 text-sm hover:bg-accent/40"
            >
              <span className="w-5 text-xs tabular-nums text-muted-foreground">
                {i + 1}
              </span>
              <span className="flex-1 tabular-nums">{describeSet(set)}</span>

              {prSet.has(set.id) ? (
                <span
                  title="Personal record for this exercise"
                  className="flex items-center gap-1 rounded-full border border-foreground/25 px-1.5 py-0.5 text-[10px] font-medium"
                >
                  <Trophy className="size-3" />
                  PR
                </span>
              ) : null}

              {set.rpe !== null ? (
                <span className="text-xs text-muted-foreground">RPE {num(set.rpe)}</span>
              ) : null}

              <Button
                variant="ghost"
                size="icon"
                aria-label={`Delete set ${i + 1}`}
                className="size-7 text-muted-foreground hover:text-destructive"
                onClick={() =>
                  startTransition(async () => {
                    await deleteSet(set.id, workoutId);
                  })
                }
              >
                <Trash2 className="size-3.5" />
              </Button>
            </li>
          ))}
        </ol>
      ) : null}

      <div className="flex flex-wrap items-end gap-2">
        {fields.weight ? (
          <Field label={defaultUnit} value={weight} onChange={setWeight} placeholder="0" />
        ) : null}
        {fields.reps ? (
          <Field label="reps" value={reps} onChange={setReps} placeholder="0" />
        ) : null}
        {fields.duration ? (
          <Field label="secs" value={duration} onChange={setDuration} placeholder="0" />
        ) : null}
        {fields.distance ? (
          <Field label="metres" value={distance} onChange={setDistance} placeholder="0" />
        ) : null}
        <Field label="RPE" value={rpe} onChange={setRpe} placeholder="–" />

        <Button
          size="sm"
          variant="secondary"
          onClick={submit}
          disabled={pending}
          className={cn('ml-auto')}
        >
          <Plus className="size-4" />
          Add set
        </Button>
      </div>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <label className="space-y-1">
      <span className="block text-[11px] text-muted-foreground">{label}</span>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        // decimal keypad on phones, which is the whole point of this app
        inputMode="decimal"
        className="h-9 w-16 text-center tabular-nums"
      />
    </label>
  );
}

type SetValues = {
  reps: number | null;
  weight: number | null;
  durationSec: number | null;
  distanceM: number | null;
};

function beatsBest(
  values: SetValues,
  best: { e1rm: number | null; reps: number | null; durationSec: number | null } | null,
): boolean {
  const e1rm = estimate1Rm(values.weight, values.reps);

  if (e1rm !== null) return e1rm > (best?.e1rm ?? 0);
  if (values.reps !== null) return values.reps > (best?.reps ?? 0);
  if (values.durationSec !== null) return values.durationSec > (best?.durationSec ?? 0);
  return false;
}

function describeValues(values: SetValues, unit: string): string {
  const parts: string[] = [];
  if (values.weight !== null) parts.push(`${num(values.weight)} ${unit}`);
  if (values.reps !== null) parts.push(`× ${values.reps}`);
  if (values.durationSec !== null) parts.push(formatDuration(values.durationSec));
  if (values.distanceM !== null) parts.push(`${num(values.distanceM)} m`);
  return parts.join('  ');
}

function describeSet(set: SetRow): string {
  const parts: string[] = [];
  if (set.weight !== null) parts.push(`${num(set.weight)} ${set.unit}`);
  if (set.reps !== null) parts.push(`× ${set.reps}`);
  if (set.durationSec !== null) parts.push(formatDuration(set.durationSec));
  if (set.distanceM !== null) parts.push(`${num(set.distanceM)} m`);
  return parts.join('  ') || '—';
}
