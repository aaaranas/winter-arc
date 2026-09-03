export type Macros = {
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
};

export const ZERO_MACROS: Macros = {
  calories: 0,
  proteinG: 0,
  carbsG: 0,
  fatG: 0,
};

/** A logged entry contributes its food's macros scaled by quantity. */
export function scale(food: Macros, quantity: number): Macros {
  return {
    calories: food.calories * quantity,
    proteinG: food.proteinG * quantity,
    carbsG: food.carbsG * quantity,
    fatG: food.fatG * quantity,
  };
}

export function sum(items: Macros[]): Macros {
  return items.reduce<Macros>(
    (acc, m) => ({
      calories: acc.calories + m.calories,
      proteinG: acc.proteinG + m.proteinG,
      carbsG: acc.carbsG + m.carbsG,
      fatG: acc.fatG + m.fatG,
    }),
    { ...ZERO_MACROS },
  );
}

/**
 * Percentage of a target, clamped to 0 so a missing target renders as no bar
 * rather than NaN.
 */
export function pctOf(value: number, target: number | null | undefined): number | null {
  if (!target || target <= 0) return null;
  return Math.max(0, (value / target) * 100);
}
