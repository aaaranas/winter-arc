import type { SeedFood } from '../types';

/**
 * Philippine fast-food chains.
 *
 * READ THIS BEFORE TRUSTING THESE NUMBERS
 * ---------------------------------------
 * Jollibee is the ONLY one of the four chains that publishes a machine-readable
 * nutrition document. Every Jollibee row below was transcribed by hand from:
 *
 *   "Nutrition Information for JOLLIBEE USA Standard Menu Items", 01 July 2026
 *   https://jollibee-prod-media.s3.us-west-2.amazonaws.com/20260701_JB_USA_Nutrition_Facts_2026_Mktg_8f037d9d5d.pdf
 *
 * CAVEAT: that document covers the **USA** menu. Philippine portion sizes and
 * formulations differ — PH Chickenjoy is not guaranteed to match US Chickenjoy.
 * These are the best officially-published figures available, not PH-specific
 * ones. Treat them as close, not exact.
 *
 * Chowking, Mang Inasal and Greenwich publish no official consolidated
 * nutrition data that could be found. Rather than dress up numbers from
 * third-party aggregators as authoritative, their rows are ESTIMATE, rounded to
 * the nearest 5 kcal / 1 g, and flagged in the UI. Correct them in-app against
 * an in-store nutrition guide if you want accuracy.
 */

const JB_SOURCE =
  'https://jollibee-prod-media.s3.us-west-2.amazonaws.com/20260701_JB_USA_Nutrition_Facts_2026_Mktg_8f037d9d5d.pdf';

function jollibee(
  seedKey: string,
  name: string,
  servingSize: number,
  calories: number,
  fatG: number,
  carbsG: number,
  proteinG: number,
  servingLabel?: string,
): SeedFood {
  return {
    seedKey,
    name,
    brand: 'Jollibee',
    category: 'FASTFOOD',
    sourceType: 'OFFICIAL',
    source: JB_SOURCE,
    isEstimate: false,
    calories,
    proteinG,
    carbsG,
    fatG,
    servingSize,
    servingUnit: 'g',
    servingLabel,
  };
}

function estimated(
  seedKey: string,
  name: string,
  brand: string,
  servingSize: number,
  calories: number,
  fatG: number,
  carbsG: number,
  proteinG: number,
  servingLabel: string,
): SeedFood {
  return {
    seedKey,
    name,
    brand,
    category: 'FASTFOOD',
    sourceType: 'ESTIMATE',
    source: `No official nutrition data published by ${brand}; rounded estimate.`,
    isEstimate: true,
    calories,
    proteinG,
    carbsG,
    fatG,
    servingSize,
    servingUnit: 'g',
    servingLabel,
  };
}

export const fastfoodFoods: SeedFood[] = [
  // ---- Jollibee: OFFICIAL, transcribed from the PDF above ----
  jollibee('jb-chickenjoy-drumstick', 'Chickenjoy Drumstick', 85, 220, 14, 3, 20, '1 pc'),
  jollibee('jb-chickenjoy-thigh', 'Chickenjoy Thigh', 125, 380, 28, 5, 27, '1 pc'),
  jollibee('jb-spicy-chickenjoy-drumstick', 'Spicy Chickenjoy Drumstick', 85, 240, 14, 10, 16, '1 pc'),
  jollibee('jb-spicy-chickenjoy-thigh', 'Spicy Chickenjoy Thigh', 126, 350, 21, 15, 23, '1 pc'),
  jollibee('jb-chicken-tender', 'Chicken Tender', 57, 140, 6, 9, 11, '1 pc'),
  jollibee('jb-chicken-nuggets-5', 'Chicken Nuggets (5 pcs)', 95, 256, 13, 16, 18, '5 pcs'),
  jollibee('jb-chicken-sandwich', 'Chicken Sandwich Original', 249, 609, 33, 46, 33, '1 sandwich'),
  jollibee('jb-spaghetti', 'Jolly Spaghetti', 411, 610, 23, 76, 23, '1 plate'),
  jollibee('jb-palabok', 'Palabok Fiesta', 351, 410, 15, 49, 20, '1 plate'),
  jollibee('jb-burgersteak-2pc-rice', 'Burger Steak (2 pcs) with Rice', 422, 570, 28, 56, 24, '2 pcs + rice'),
  jollibee('jb-yumburger', 'Yumburger', 118, 360, 21, 30, 13, '1 burger'),
  jollibee('jb-yumburger-cheese', 'Yumburger with Cheese', 132, 410, 25, 30, 16, '1 burger'),
  jollibee('jb-fries-regular', 'Jolly Crispy Fries (Regular)', 113, 340, 18, 41, 4, 'regular'),
  jollibee('jb-fries-large', 'Jolly Crispy Fries (Large)', 170, 510, 27, 62, 6, 'large'),
  jollibee('jb-steamed-rice', 'Steamed Rice', 198, 190, 0, 44, 4, '1 cup'),
  jollibee('jb-adobo-rice', 'Adobo Rice', 227, 230, 4.5, 54, 8, '1 cup'),
  jollibee('jb-garlic-rice', 'Garlic Rice', 233, 237, 1, 52, 5, '1 cup'),
  jollibee('jb-mashed-potato', 'Mashed Potato with Gravy (Regular)', 170, 170, 4.5, 33, 3, 'regular'),
  jollibee('jb-coleslaw', 'Coleslaw', 149, 211, 15, 19, 2, '1 serving'),
  jollibee('jb-gravy-small', 'Gravy (Small)', 77, 25, 0, 5, 1, 'small cup'),
  jollibee('jb-peach-mango-pie', 'Peach Mango Pie', 94, 270, 11, 40, 3, '1 pie'),
  jollibee('jb-ube-pie', 'Ube Pie', 97, 310, 15, 45, 4, '1 pie'),

  // ---- Mang Inasal: ESTIMATE, no official data published ----
  estimated('mi-paa-large', 'Chicken Inasal Paa (Large)', 'Mang Inasal', 250, 340, 22, 2, 32, '1 leg quarter'),
  estimated('mi-pecho', 'Chicken Inasal Pecho', 'Mang Inasal', 260, 350, 20, 2, 38, '1 breast part'),
  estimated('mi-rice', 'Plain Rice', 'Mang Inasal', 200, 260, 1, 57, 5, '1 cup'),
  estimated('mi-palabok', 'Palabok', 'Mang Inasal', 300, 400, 16, 50, 14, '1 serving'),
  estimated('mi-halo-halo', 'Halo-Halo (Regular)', 'Mang Inasal', 350, 300, 8, 52, 6, 'regular'),

  // ---- Chowking: ESTIMATE, no official data published ----
  estimated('ck-chao-fan-beef', 'Beef Chao Fan', 'Chowking', 350, 560, 16, 85, 20, '1 serving'),
  estimated('ck-siomai-rice', 'Pork Siomai with Rice', 'Chowking', 330, 550, 18, 78, 20, '4 pcs + rice'),
  estimated('ck-lauriat-chicken', 'Chicken Lauriat', 'Chowking', 450, 800, 32, 95, 32, '1 lauriat'),
  estimated('ck-halo-halo', 'Halo-Halo (Regular)', 'Chowking', 350, 320, 9, 55, 7, 'regular'),
  estimated('ck-wonton-noodles', 'Wonton Noodle Soup', 'Chowking', 400, 380, 10, 52, 18, '1 bowl'),

  // ---- Greenwich: ESTIMATE, no official data published ----
  estimated('gw-hawaiian-slice', 'Hawaiian Overload Pizza (1 slice)', 'Greenwich', 95, 230, 8, 28, 10, '1 slice'),
  estimated('gw-pepperoni-slice', 'Pepperoni Pizza (1 slice)', 'Greenwich', 95, 250, 10, 28, 11, '1 slice'),
  estimated('gw-lasagna', 'Lasagna Supreme', 'Greenwich', 280, 420, 18, 44, 20, '1 serving'),
  estimated('gw-baked-mac', 'Baked Macaroni', 'Greenwich', 260, 390, 15, 47, 17, '1 serving'),
  estimated('gw-cheesy-bread', 'Cheesy Bread Sticks', 'Greenwich', 120, 350, 14, 46, 10, '1 order'),
];
