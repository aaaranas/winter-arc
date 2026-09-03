/** Drop trailing zeros: 62.50 -> "62.5", 60.0 -> "60". */
export function num(value: number, maxDecimals = 1): string {
  return Number(value.toFixed(maxDecimals)).toString();
}

export function grams(value: number): string {
  return `${num(value)}g`;
}

export function kcal(value: number): string {
  return `${Math.round(value)}`;
}

const SOURCE_LABELS: Record<string, string> = {
  OFFICIAL: 'Official',
  LABEL: 'Label',
  REFERENCE: 'Reference',
  ESTIMATE: 'Estimate',
  USER: 'Yours',
};

export function sourceLabel(sourceType: string): string {
  return SOURCE_LABELS[sourceType] ?? sourceType;
}

export const MEAL_TYPES = ['BREAKFAST', 'LUNCH', 'DINNER', 'SNACK'] as const;
export type MealType = (typeof MEAL_TYPES)[number];

export function mealLabel(meal: string): string {
  return meal.charAt(0) + meal.slice(1).toLowerCase();
}
