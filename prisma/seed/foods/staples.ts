import type { SeedFood } from '../types';

/**
 * Staple crops and market produce common in Cebu / the Philippines.
 *
 * These are REFERENCE values: typical composition for the generic food, per
 * 100 g, of the kind published in food-composition tables (PH FNRI, USDA
 * FoodData Central). They are not brand-specific and not tied to one farm or
 * preparation, so treat them as accurate to normal rounding rather than exact.
 *
 * Cooked vs raw matters a lot here and is stated in every name, because cooked
 * rice is roughly a third the calorie density of raw rice by weight.
 */

function staple(
  seedKey: string,
  name: string,
  calories: number,
  proteinG: number,
  carbsG: number,
  fatG: number,
  servingLabel = 'per 100 g',
): SeedFood {
  return {
    seedKey,
    name,
    category: 'STAPLE',
    sourceType: 'REFERENCE',
    source:
      'Typical food-composition values (PH FNRI / USDA FoodData Central reference ranges).',
    isEstimate: false,
    calories,
    proteinG,
    carbsG,
    fatG,
    servingSize: 100,
    servingUnit: 'g',
    servingLabel,
  };
}

export const stapleFoods: SeedFood[] = [
  // ---- rice and grains ----
  staple('rice-white-cooked', 'White Rice, cooked', 130, 2.7, 28, 0.3),
  staple('rice-brown-cooked', 'Brown Rice, cooked', 123, 2.7, 26, 1),
  staple('rice-red-cooked', 'Red Rice, cooked', 130, 2.8, 27, 0.9),
  staple('rice-glutinous-cooked', 'Malagkit (Glutinous Rice), cooked', 145, 3, 32, 0.3),
  staple('corn-grits-cooked', 'Corn Grits (Mais), cooked', 110, 2.5, 24, 0.5),

  // ---- root crops ----
  staple('kamote-boiled', 'Kamote (Sweet Potato), boiled', 76, 1.4, 18, 0.1),
  staple('cassava-boiled', 'Kamoteng Kahoy (Cassava), boiled', 160, 1.4, 38, 0.3),
  staple('gabi-boiled', 'Gabi (Taro), boiled', 108, 0.5, 26, 0.1),
  staple('ube-boiled', 'Ube (Purple Yam), boiled', 118, 1.5, 28, 0.1),
  staple('potato-boiled', 'Potato, boiled', 87, 1.9, 20, 0.1),

  // ---- bananas and fruit ----
  staple('saba-boiled', 'Saging na Saba, boiled', 120, 1.3, 31, 0.3),
  staple('lakatan', 'Saging na Lakatan', 105, 1.1, 27, 0.3),
  staple('latundan', 'Saging na Latundan', 98, 1.1, 25, 0.3),
  staple('mango-ripe', 'Mangga (Ripe Mango)', 60, 0.8, 15, 0.4),
  staple('papaya-ripe', 'Papaya, ripe', 43, 0.5, 11, 0.3),
  staple('pineapple', 'Pinya (Pineapple)', 50, 0.5, 13, 0.1),
  staple('watermelon', 'Pakwan (Watermelon)', 30, 0.6, 8, 0.2),
  staple('calamansi', 'Calamansi', 30, 0.4, 8, 0.1),

  // ---- vegetables common in Cebu markets ----
  staple('kangkong-raw', 'Kangkong (Water Spinach), raw', 19, 2.6, 3.1, 0.2),
  staple('malunggay-leaves', 'Malunggay (Moringa) Leaves, raw', 64, 9.4, 8.3, 1.4),
  staple('ampalaya', 'Ampalaya (Bitter Gourd), raw', 17, 1, 3.7, 0.2),
  staple('talong', 'Talong (Eggplant), raw', 25, 1, 6, 0.2),
  staple('okra', 'Okra, raw', 33, 1.9, 7, 0.2),
  staple('sitaw', 'Sitaw (String Beans), raw', 47, 2.8, 8, 0.4),
  staple('pechay', 'Pechay (Bok Choy), raw', 13, 1.5, 2.2, 0.2),
  staple('repolyo', 'Repolyo (Cabbage), raw', 25, 1.3, 6, 0.1),
  staple('carrot-raw', 'Carrot, raw', 41, 0.9, 10, 0.2),
  staple('sayote', 'Sayote (Chayote), raw', 19, 0.8, 4.5, 0.1),
  staple('kalabasa', 'Kalabasa (Squash), raw', 26, 1, 6.5, 0.1),
  staple('upo', 'Upo (Bottle Gourd), raw', 14, 0.6, 3.4, 0.02),
  staple('labanos', 'Labanos (Radish), raw', 16, 0.7, 3.4, 0.1),
  staple('monggo-cooked', 'Monggo (Mung Beans), cooked', 105, 7, 19, 0.4),

  // ---- everyday protein staples ----
  staple('egg-chicken', 'Chicken Egg, whole', 143, 12.6, 0.7, 9.5, 'per 100 g (~2 eggs)'),
  staple('chicken-breast-cooked', 'Chicken Breast, skinless, cooked', 165, 31, 0, 3.6),
  staple('chicken-thigh-cooked', 'Chicken Thigh, skinless, cooked', 209, 26, 0, 10.9),
  staple('pork-belly-cooked', 'Pork Belly (Liempo), cooked', 518, 9.3, 0, 53),
  staple('pork-lean-cooked', 'Pork, lean cut, cooked', 242, 27, 0, 14),
  staple('beef-lean-cooked', 'Beef, lean cut, cooked', 250, 26, 0, 15),
  staple('bangus-cooked', 'Bangus (Milkfish), cooked', 162, 20, 0, 8.6),
  staple('tilapia-cooked', 'Tilapia, cooked', 128, 26, 0, 2.7),
  staple('galunggong-cooked', 'Galunggong (Round Scad), cooked', 158, 24, 0, 6.3),
  staple('tuna-fresh-cooked', 'Tuna, fresh, cooked', 184, 30, 0, 6.3),
  staple('shrimp-cooked', 'Hipon (Shrimp), cooked', 99, 24, 0.2, 0.3),
  staple('tofu-firm', 'Tokwa (Firm Tofu)', 144, 15.8, 4.3, 8.7),
];
