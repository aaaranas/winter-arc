import type { Prisma } from '@/generated/prisma/client';

/**
 * Which foods a given user may see.
 *
 * The 166 seeded reference foods have `userId = null` and belong to everyone;
 * anything a user creates belongs only to them. Copying the catalogue per
 * signup was the alternative, and it would waste rows and let each copy drift
 * as corrections are made.
 *
 * Every FoodItem read goes through this so a friend's custom "Lola's adobo"
 * never shows up in someone else's search.
 */
export function visibleFoods(userId: string): Prisma.FoodItemWhereInput {
  return {
    archived: false,
    OR: [{ userId: null }, { userId }],
  };
}
