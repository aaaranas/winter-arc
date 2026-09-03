/**
 * Shape of one seeded food.
 *
 * `sourceType` is the honesty contract of this dataset. It is surfaced in the
 * UI so a rounded guess is never mistaken for a label reading:
 *
 *   OFFICIAL  — transcribed from the publisher's own nutrition PDF/page.
 *               `source` is the exact document URL.
 *   LABEL     — read off a product's nutrition facts panel.
 *   REFERENCE — typical composition value for a generic food (rice, kamote),
 *               from food-composition-table ranges. Accurate to normal rounding,
 *               but not tied to one brand or preparation.
 *   ESTIMATE  — inherently variable (home cooking, chains that publish nothing).
 *               Deliberately rounded. Never presented as precise.
 *   USER      — entered by hand in the app.
 */
export type SourceType = 'OFFICIAL' | 'LABEL' | 'REFERENCE' | 'ESTIMATE' | 'USER';

export type Category =
  | 'STAPLE'
  | 'PACKAGED'
  | 'HOME_COOKED'
  | 'FASTFOOD'
  | 'CUSTOM';

export type SeedFood = {
  /** Stable key so re-seeding upserts instead of duplicating. */
  seedKey: string;
  name: string;
  brand?: string;
  category: Category;
  sourceType: SourceType;
  /** URL or citation. Required for OFFICIAL and LABEL. */
  source?: string;
  isEstimate: boolean;
  calories: number;
  proteinG: number;
  carbsG: number;
  fatG: number;
  servingSize: number;
  servingUnit: string;
  servingLabel?: string;
};
