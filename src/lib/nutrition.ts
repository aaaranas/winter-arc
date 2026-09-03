import type { Macros } from '@/lib/macros';

/**
 * Turns body metrics into a daily macro target, then splits that across meals.
 *
 * The estimate uses Mifflin-St Jeor for BMR, an activity multiplier for TDEE,
 * and a goal adjustment. That is the standard approach and it is still an
 * *estimate* — real expenditure varies by 10% or more between people with
 * identical numbers. Treat the output as a starting point and adjust from what
 * the scale actually does over a few weeks.
 */

export const ACTIVITY_LEVELS = [
  { value: 'sedentary', label: 'Sedentary', hint: 'Desk job, little exercise', multiplier: 1.2 },
  { value: 'light', label: 'Light', hint: 'Training 1–3 days a week', multiplier: 1.375 },
  { value: 'moderate', label: 'Moderate', hint: 'Training 3–5 days a week', multiplier: 1.55 },
  { value: 'active', label: 'Active', hint: 'Training 6–7 days a week', multiplier: 1.725 },
  { value: 'very_active', label: 'Very active', hint: 'Physical job plus training', multiplier: 1.9 },
] as const;

export const GOALS = [
  { value: 'cut', label: 'Cut', hint: 'Lose fat — 20% below maintenance', adjustment: -0.2 },
  { value: 'maintain', label: 'Maintain', hint: 'Hold weight', adjustment: 0 },
  { value: 'bulk', label: 'Bulk', hint: 'Gain muscle — 10% above maintenance', adjustment: 0.1 },
] as const;

export const MEAL_PATTERNS = [
  {
    value: 'OMAD',
    label: 'OMAD',
    hint: 'One meal a day',
    meals: [{ name: 'The meal', share: 1 }],
  },
  {
    value: 'TMAD',
    label: 'TMAD',
    hint: 'Two meals a day',
    meals: [
      { name: 'First meal', share: 0.45 },
      { name: 'Second meal', share: 0.55 },
    ],
  },
  {
    value: 'THREE',
    label: '3 meals',
    hint: 'Breakfast, lunch, dinner',
    meals: [
      { name: 'Breakfast', share: 0.3 },
      { name: 'Lunch', share: 0.375 },
      { name: 'Dinner', share: 0.325 },
    ],
  },
] as const;

export type MetricsInput = {
  weightKg: number | null;
  heightCm: number | null;
  age: number | null;
  sex: string | null;
  activityLevel: string;
  goal: string;
};

export type MacroPlan = {
  bmr: number;
  tdee: number;
  targetCalories: number;
  protein: number;
  carbs: number;
  fat: number;
  /** True when sex was not given and we used a sex-neutral average. */
  sexAssumed: boolean;
  activityLabel: string;
  goalLabel: string;
};

/**
 * Returns null when weight, height or age is missing — we refuse to invent a
 * plan from incomplete inputs rather than quietly substituting defaults.
 */
export function computeMacroPlan(m: MetricsInput): MacroPlan | null {
  const { weightKg, heightCm, age } = m;
  if (!weightKg || !heightCm || !age) return null;
  if (weightKg <= 0 || heightCm <= 0 || age <= 0) return null;

  const base = 10 * weightKg + 6.25 * heightCm - 5 * age;

  // Mifflin-St Jeor's sex constant is +5 for men and -161 for women. With no
  // sex given we take the midpoint (-78) and flag it, so the number is honest
  // about being less precise rather than silently assuming.
  const sexAssumed = m.sex !== 'male' && m.sex !== 'female';
  const sexConstant = m.sex === 'male' ? 5 : m.sex === 'female' ? -161 : -78;
  const bmr = base + sexConstant;

  const activity =
    ACTIVITY_LEVELS.find((a) => a.value === m.activityLevel) ?? ACTIVITY_LEVELS[2];
  const goal = GOALS.find((g) => g.value === m.goal) ?? GOALS[1];

  const tdee = bmr * activity.multiplier;
  const targetCalories = tdee * (1 + goal.adjustment);

  // Protein: higher on a cut, where it protects lean mass in a deficit.
  const proteinPerKg = goal.value === 'cut' ? 2.2 : 1.8;
  const protein = weightKg * proteinPerKg;

  // Fat: 25% of calories, with a floor of 0.8 g/kg for hormone function.
  const fat = Math.max((targetCalories * 0.25) / 9, weightKg * 0.8);

  // Carbs take whatever calories remain.
  const carbs = Math.max(0, (targetCalories - protein * 4 - fat * 9) / 4);

  return {
    bmr: Math.round(bmr),
    tdee: Math.round(tdee),
    targetCalories: Math.round(targetCalories),
    protein: Math.round(protein),
    carbs: Math.round(carbs),
    fat: Math.round(fat),
    sexAssumed,
    activityLabel: activity.label,
    goalLabel: goal.label,
  };
}

export type MealTarget = {
  name: string;
  share: number;
  calories: number;
  protein: number;
  carbs: number;
  fat: number;
};

export function splitIntoMeals(plan: MacroPlan, pattern: string): MealTarget[] {
  const config =
    MEAL_PATTERNS.find((p) => p.value === pattern) ?? MEAL_PATTERNS[2];

  return config.meals.map((meal) => ({
    name: meal.name,
    share: meal.share,
    calories: Math.round(plan.targetCalories * meal.share),
    protein: Math.round(plan.protein * meal.share),
    carbs: Math.round(plan.carbs * meal.share),
    fat: Math.round(plan.fat * meal.share),
  }));
}

export function mealPatternLabel(pattern: string): string {
  return MEAL_PATTERNS.find((p) => p.value === pattern)?.label ?? pattern;
}

// ------------------------------------------------------------------ suggestions

export type SuggestibleFood = {
  id: string;
  name: string;
  brand: string | null;
  category: string;
  isEstimate: boolean;
  sourceType: string;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  servingSize: number;
  servingUnit: string;
  servingLabel: string | null;
};

export type SuggestedItem = {
  food: SuggestibleFood;
  servings: number;
};

export type MealSuggestion = {
  target: MealTarget;
  items: SuggestedItem[];
  totals: Macros;
};

/**
 * Builds a plausible meal from the foods actually in your database.
 *
 * The approach is deliberately simple and readable rather than a solver: anchor
 * the meal on a protein-dense food, add a carb staple, add a vegetable, then
 * scale the servings to land near the meal's protein and calorie targets.
 *
 * It suggests combinations, not prescriptions — the point is to show what
 * hitting the target could look like with food you actually eat.
 */
export function suggestMeal(
  target: MealTarget,
  foods: SuggestibleFood[],
  seed: number,
): MealSuggestion {
  const proteinDense = foods.filter(
    (f) => f.calories > 0 && f.proteinG / Math.max(f.calories, 1) > 0.07 && f.proteinG >= 8,
  );
  const carbStaples = foods.filter(
    (f) => f.category === 'STAPLE' && f.carbsG >= 15 && f.proteinG < 8,
  );
  const vegetables = foods.filter(
    (f) => f.category === 'STAPLE' && f.calories <= 60 && f.carbsG < 15,
  );

  const items: SuggestedItem[] = [];

  const pick = <T,>(pool: T[], offset: number): T | null =>
    pool.length ? pool[(seed + offset) % pool.length] : null;

  const protein = pick(proteinDense, 0);
  if (protein) {
    // Enough servings to cover ~70% of the meal's protein, capped so the
    // suggestion stays a realistic portion.
    const need = target.protein * 0.7;
    const servings = clampServings(need / Math.max(protein.proteinG, 1));
    items.push({ food: protein, servings });
  }

  const carb = pick(carbStaples, 1);
  if (carb) {
    const consumed = sumItems(items);
    const remainingCarbs = Math.max(0, target.carbs - consumed.carbsG);
    const servings = clampServings(remainingCarbs / Math.max(carb.carbsG, 1));
    if (servings > 0) items.push({ food: carb, servings });
  }

  const veg = pick(vegetables, 2);
  if (veg) items.push({ food: veg, servings: 1.5 });

  return { target, items, totals: sumItems(items) };
}

function clampServings(raw: number): number {
  if (!Number.isFinite(raw) || raw <= 0) return 0;
  // Round to the nearest half serving, and keep portions believable.
  return Math.min(4, Math.max(0.5, Math.round(raw * 2) / 2));
}

function sumItems(items: SuggestedItem[]): Macros {
  return items.reduce<Macros>(
    (acc, { food, servings }) => ({
      calories: acc.calories + food.calories * servings,
      proteinG: acc.proteinG + food.proteinG * servings,
      carbsG: acc.carbsG + food.carbsG * servings,
      fatG: acc.fatG + food.fatG * servings,
    }),
    { calories: 0, proteinG: 0, carbsG: 0, fatG: 0 },
  );
}
