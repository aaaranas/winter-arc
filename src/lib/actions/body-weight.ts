'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireUserId } from '@/lib/user';
import { fromDayKey, todayKey } from '@/lib/dates';

/**
 * Records today's weight, or corrects it if already logged.
 *
 * Upserts on (userId, date) so stepping on the scale twice in a day fixes the
 * reading rather than adding a second one and skewing the trend.
 */
export async function logBodyWeight(formData: FormData) {
  const userId = await requireUserId();

  const raw = (formData.get('weightKg') as string | null)?.trim();
  const weightKg = Number(raw);
  if (!raw || !Number.isFinite(weightKg) || weightKg <= 0) return;

  const dayKey = ((formData.get('date') as string | null) || todayKey()).trim();
  if (!/^\d{4}-\d{2}-\d{2}$/.test(dayKey)) return;

  const date = fromDayKey(dayKey);
  const note = (formData.get('note') as string | null)?.trim() || null;

  await db.bodyWeightEntry.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date, weightKg, note },
    update: { weightKg, note },
  });

  // Keep Settings.weightKg as the latest reading so the plan's fallback (used
  // when there is no history yet) stays truthful.
  await db.settings.upsert({
    where: { userId },
    create: { userId, weightKg },
    update: { weightKg },
  });

  revalidatePath('/plan');
  revalidatePath('/');
}

export async function deleteBodyWeightEntry(id: string) {
  const userId = await requireUserId();
  // Scoped delete: without the userId clause an id from another account would
  // delete their reading.
  await db.bodyWeightEntry.deleteMany({ where: { id, userId } });
  revalidatePath('/plan');
}
