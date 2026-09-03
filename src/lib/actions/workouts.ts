'use server';

import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { db } from '@/lib/db';
import { currentUserId } from '@/lib/user';
import { toDayStart } from '@/lib/dates';
import { getExercise } from '@/lib/exercises';
import { getRoutineDay, supersetGroupFor } from '@/lib/routines';

export async function startWorkout(formData: FormData) {
  const name = (formData.get('name') as string | null)?.trim() || null;
  const now = new Date();

  const workout = await db.workout.create({
    data: {
      userId: currentUserId(),
      date: toDayStart(now),
      name,
      startedAt: now,
    },
  });

  revalidatePath('/');
  revalidatePath('/history');
  redirect(`/workout/${workout.id}`);
}

export async function addExerciseToWorkout(
  workoutId: string,
  exerciseSlug: string,
) {
  // Reject slugs the package doesn't know, so a typo can't create a row that
  // renders as a blank card forever.
  if (!getExercise(exerciseSlug)) {
    throw new Error(`Unknown exercise: ${exerciseSlug}`);
  }

  const count = await db.workoutExercise.count({ where: { workoutId } });

  await db.workoutExercise.create({
    data: { workoutId, exerciseSlug, position: count },
  });

  revalidatePath(`/workout/${workoutId}`);
}

export async function removeWorkoutExercise(id: string, workoutId: string) {
  await db.workoutExercise.delete({ where: { id } });
  revalidatePath(`/workout/${workoutId}`);
}

export async function addSet(
  workoutExerciseId: string,
  workoutId: string,
  values: {
    reps?: number | null;
    weight?: number | null;
    unit?: string;
    rpe?: number | null;
    durationSec?: number | null;
    distanceM?: number | null;
  },
) {
  const count = await db.exerciseSet.count({ where: { workoutExerciseId } });

  await db.exerciseSet.create({
    data: {
      workoutExerciseId,
      position: count,
      reps: values.reps ?? null,
      weight: values.weight ?? null,
      unit: values.unit ?? 'kg',
      rpe: values.rpe ?? null,
      durationSec: values.durationSec ?? null,
      distanceM: values.distanceM ?? null,
    },
  });

  revalidatePath(`/workout/${workoutId}`);
}

export async function deleteSet(id: string, workoutId: string) {
  await db.exerciseSet.delete({ where: { id } });
  revalidatePath(`/workout/${workoutId}`);
}

export async function finishWorkout(workoutId: string) {
  await db.workout.update({
    where: { id: workoutId },
    data: { finishedAt: new Date() },
  });
  revalidatePath('/');
  revalidatePath('/history');
  revalidatePath(`/workout/${workoutId}`);
}

export async function updateWorkoutNotes(workoutId: string, notes: string) {
  await db.workout.update({
    where: { id: workoutId },
    data: { notes: notes.trim() || null },
  });
  revalidatePath(`/workout/${workoutId}`);
}

export async function deleteWorkout(workoutId: string) {
  await db.workout.delete({ where: { id: workoutId } });
  revalidatePath('/');
  revalidatePath('/history');
  redirect('/history');
}

/**
 * Creates a workout from a routine template day, copying its exercises,
 * superset groups and set/rep prescription in one go.
 *
 * The copy is deliberate: from this point the workout is yours to edit, and
 * later changes to the template never rewrite a session you already logged.
 */
export async function startRoutineDay(routineKey: string, dayKey: string) {
  const found = getRoutineDay(routineKey, dayKey);
  if (!found) throw new Error(`Unknown routine day: ${routineKey}/${dayKey}`);

  const { routine, day } = found;
  const now = new Date();

  const workout = await db.workout.create({
    data: {
      userId: currentUserId(),
      date: toDayStart(now),
      name: `${routine.name} — ${day.name}`,
      routineKey: routine.key,
      routineDayKey: day.key,
      startedAt: now,
      exercises: {
        create: day.exercises
          // Skip anything the package no longer has rather than creating a row
          // that renders as a blank card.
          .filter((e) => getExercise(e.slug))
          .map((e, index) => ({
            exerciseSlug: e.slug,
            position: index,
            supersetGroup: supersetGroupFor(day, e),
            targetSets: e.sets,
            targetReps: e.reps,
          })),
      },
    },
  });

  revalidatePath('/');
  revalidatePath('/history');
  redirect(`/workout/${workout.id}`);
}

/**
 * Cycles an exercise through superset groups: ungrouped -> joins the group
 * above it -> its own new group -> ungrouped.
 */
export async function toggleSuperset(id: string, workoutId: string) {
  const exercise = await db.workoutExercise.findUnique({ where: { id } });
  if (!exercise) return;

  const siblings = await db.workoutExercise.findMany({
    where: { workoutId },
    orderBy: { position: 'asc' },
  });

  const index = siblings.findIndex((e) => e.id === id);
  const previous = index > 0 ? siblings[index - 1] : null;

  let next: number | null;
  if (exercise.supersetGroup !== null) {
    next = null;
  } else if (previous?.supersetGroup != null) {
    next = previous.supersetGroup;
  } else if (previous) {
    const max = Math.max(0, ...siblings.map((e) => e.supersetGroup ?? 0));
    next = max + 1;
    // Pull the exercise above into the new group so a superset always has two.
    await db.workoutExercise.update({
      where: { id: previous.id },
      data: { supersetGroup: next },
    });
  } else {
    // Nothing above it to pair with.
    return;
  }

  await db.workoutExercise.update({ where: { id }, data: { supersetGroup: next } });
  revalidatePath(`/workout/${workoutId}`);
}

export async function reorderExercise(
  id: string,
  workoutId: string,
  direction: 'up' | 'down',
) {
  const siblings = await db.workoutExercise.findMany({
    where: { workoutId },
    orderBy: { position: 'asc' },
  });

  const index = siblings.findIndex((e) => e.id === id);
  const swapWith = direction === 'up' ? index - 1 : index + 1;
  if (index === -1 || swapWith < 0 || swapWith >= siblings.length) return;

  await db.$transaction([
    db.workoutExercise.update({
      where: { id: siblings[index].id },
      data: { position: siblings[swapWith].position },
    }),
    db.workoutExercise.update({
      where: { id: siblings[swapWith].id },
      data: { position: siblings[index].position },
    }),
  ]);

  revalidatePath(`/workout/${workoutId}`);
}
