'use server';

import { revalidatePath } from 'next/cache';
import { db } from '@/lib/db';
import { requireUserId } from '@/lib/user';
import { fromDayKey } from '@/lib/dates';

/** Get or create the DailyLog for a day. */
async function getOrCreateDailyLog(dayKey: string) {
  const userId = await requireUserId();
  const date = fromDayKey(dayKey);

  return db.dailyLog.upsert({
    where: { userId_date: { userId, date } },
    create: { userId, date },
    update: {},
  });
}

export async function logFood(
  dayKey: string,
  foodItemId: string,
  quantity: number,
  mealType: string,
) {
  const log = await getOrCreateDailyLog(dayKey);

  await db.logEntry.create({
    data: {
      dailyLogId: log.id,
      foodItemId,
      quantity: quantity > 0 ? quantity : 1,
      mealType,
    },
  });

  revalidatePath('/food');
  revalidatePath(`/food/${dayKey}`);
}

export async function updateLogEntry(
  id: string,
  dayKey: string,
  quantity: number,
) {
  await db.logEntry.update({
    where: { id },
    data: { quantity: quantity > 0 ? quantity : 1 },
  });
  revalidatePath(`/food/${dayKey}`);
  revalidatePath('/food');
}

export async function deleteLogEntry(id: string, dayKey: string) {
  await db.logEntry.delete({ where: { id } });
  revalidatePath(`/food/${dayKey}`);
  revalidatePath('/food');
}

/**
 * Custom food entry. Anything created here is USER-sourced and is never an
 * estimate from our side — you typed it, so it's as good as what you typed.
 */
export async function createCustomFood(formData: FormData) {
  const name = (formData.get('name') as string).trim();
  const brand = (formData.get('brand') as string | null)?.trim() || null;

  const numeric = (key: string) => {
    const raw = formData.get(key);
    const n = Number(raw);
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };

  const food = await db.foodItem.create({
    data: {
      userId: await requireUserId(),
      name,
      brand,
      category: 'CUSTOM',
      sourceType: 'USER',
      source: null,
      isEstimate: false,
      calories: numeric('calories'),
      proteinG: numeric('proteinG'),
      carbsG: numeric('carbsG'),
      fatG: numeric('fatG'),
      servingSize: numeric('servingSize') || 100,
      servingUnit: ((formData.get('servingUnit') as string) || 'g').trim(),
      servingLabel:
        (formData.get('servingLabel') as string | null)?.trim() || null,
    },
  });

  revalidatePath('/food');
  return food;
}

/**
 * Correct a seeded food in place. Used to fix the estimated rows against a real
 * nutrition panel — which flips its provenance to LABEL, since you've now read
 * it off the pack.
 */
export async function updateFood(id: string, formData: FormData) {
  const numeric = (key: string) => {
    const n = Number(formData.get(key));
    return Number.isFinite(n) && n >= 0 ? n : 0;
  };

  await db.foodItem.update({
    where: { id },
    data: {
      name: (formData.get('name') as string).trim(),
      brand: (formData.get('brand') as string | null)?.trim() || null,
      calories: numeric('calories'),
      proteinG: numeric('proteinG'),
      carbsG: numeric('carbsG'),
      fatG: numeric('fatG'),
      servingSize: numeric('servingSize') || 100,
      servingUnit: ((formData.get('servingUnit') as string) || 'g').trim(),
      sourceType: 'LABEL',
      isEstimate: false,
      source: 'Corrected by hand against the product nutrition panel.',
    },
  });

  revalidatePath('/food');
}

export async function archiveFood(id: string) {
  await db.foodItem.update({ where: { id }, data: { archived: true } });
  revalidatePath('/food');
}
