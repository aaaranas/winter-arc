'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireUserId } from '@/lib/user';

/** Empty means "no value", which is different from a value of zero. */
function optionalNumber(formData: FormData, key: string): number | null {
  const raw = (formData.get(key) as string | null)?.trim();
  if (!raw) return null;
  const n = Number(raw);
  return Number.isFinite(n) && n >= 0 ? n : null;
}

function text(formData: FormData, key: string, fallback: string): string {
  return ((formData.get(key) as string | null) || fallback).trim();
}

export async function updateSettings(formData: FormData) {
  const userId = await requireUserId();

  const data = {
    calorieTarget: optionalNumber(formData, 'calorieTarget'),
    proteinTarget: optionalNumber(formData, 'proteinTarget'),
    carbsTarget: optionalNumber(formData, 'carbsTarget'),
    fatTarget: optionalNumber(formData, 'fatTarget'),
    weightUnit: text(formData, 'weightUnit', 'kg'),
    restTimerSec: optionalNumber(formData, 'restTimerSec') ?? 120,
  };

  await db.settings.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

  revalidatePath('/settings');
  revalidatePath('/food');
  revalidatePath('/plan');
}

/** Body metrics and preferences that drive the macro plan. */
export async function updateBodyMetrics(formData: FormData) {
  const userId = await requireUserId();

  const sexRaw = (formData.get('sex') as string | null)?.trim();

  const data = {
    heightCm: optionalNumber(formData, 'heightCm'),
    // weightKg deliberately absent: it is owned by the weight card, which keeps
    // history. Reading it from this form would blank the stored value whenever
    // the metrics form is saved.
    age: optionalNumber(formData, 'age'),
    sex: sexRaw === 'male' || sexRaw === 'female' ? sexRaw : null,
    activityLevel: text(formData, 'activityLevel', 'moderate'),
    goal: text(formData, 'goal', 'maintain'),
    mealPattern: text(formData, 'mealPattern', 'THREE'),
  };

  await db.settings.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

  revalidatePath('/plan');
  revalidatePath('/settings');
  revalidatePath('/food');
}

/**
 * Copies a computed macro plan into the daily targets, so the food log's
 * progress bars line up with the plan instead of being typed in twice.
 */
export async function applyPlanAsTargets(targets: {
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
}) {
  const userId = await requireUserId();

  const data = {
    calorieTarget: targets.calories,
    proteinTarget: targets.protein,
    carbsTarget: targets.carbs,
    fatTarget: targets.fat,
  };

  await db.settings.upsert({
    where: { userId },
    create: { userId, ...data },
    update: data,
  });

  revalidatePath('/plan');
  revalidatePath('/food');
  revalidatePath('/settings');
  revalidatePath('/');
}

export async function setActiveRoutine(routineKey: string | null) {
  const userId = await requireUserId();

  await db.settings.upsert({
    where: { userId },
    create: { userId, activeRoutineKey: routineKey },
    update: { activeRoutineKey: routineKey },
  });

  revalidatePath('/routines');
  revalidatePath('/');
}
