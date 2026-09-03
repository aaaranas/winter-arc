import type { SeedFood } from '../types';

/**
 * Home-cooked Filipino / Cebuano dishes.
 *
 * EVERY ROW HERE IS AN ESTIMATE and is flagged as one in the UI.
 *
 * Home cooking has no fixed recipe: the fat content of humba depends on the cut
 * of liempo, sinigang depends on how much pork went in, lechon depends on which
 * part of the pig you got. Publishing a number like "487 kcal" for these would
 * be false precision dressed up as data.
 *
 * So these are rounded to the nearest 5 kcal and 1 g, sized to a realistic
 * home serving, and meant as a starting point you correct in-app once you know
 * your own portions.
 */

function dish(
  seedKey: string,
  name: string,
  servingSize: number,
  servingLabel: string,
  calories: number,
  proteinG: number,
  carbsG: number,
  fatG: number,
): SeedFood {
  return {
    seedKey,
    name,
    category: 'HOME_COOKED',
    sourceType: 'ESTIMATE',
    source:
      'Rounded estimate for a typical home serving. Varies widely with recipe, cut and portion.',
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

export const homeCookedFoods: SeedFood[] = [
  // ---- pork ----
  dish('lechon-belly', 'Lechon Belly', 100, '1 slice (~100 g)', 400, 20, 0, 35),
  dish('lechon-baboy', 'Lechon Baboy (roast pig, with skin)', 100, '1 serving (~100 g)', 350, 22, 0, 29),
  dish('humba', 'Humba', 200, '1 serving with sauce', 450, 24, 12, 34),
  dish('adobo-pork', 'Pork Adobo', 200, '1 serving with sauce', 420, 25, 6, 33),
  dish('adobo-chicken', 'Chicken Adobo', 200, '1 serving with sauce', 340, 27, 5, 23),
  dish('sinigang-baboy', 'Sinigang na Baboy', 350, '1 bowl with broth', 320, 22, 14, 20),
  dish('tinolang-manok', 'Tinolang Manok', 350, '1 bowl with broth', 240, 25, 10, 11),
  dish('menudo', 'Menudo', 220, '1 serving', 380, 22, 18, 25),
  dish('afritada', 'Afritada', 220, '1 serving', 350, 23, 20, 20),
  dish('caldereta', 'Kaldereta', 220, '1 serving', 420, 25, 16, 29),
  dish('dinuguan', 'Dinuguan', 200, '1 serving', 330, 24, 8, 23),
  dish('crispy-pata', 'Crispy Pata', 150, '1 portion', 550, 28, 2, 48),
  dish('sisig', 'Sisig', 180, '1 sizzling plate', 480, 26, 8, 38),
  dish('tocino', 'Pork Tocino', 100, '1 serving', 280, 18, 14, 17),
  dish('longganisa', 'Longganisa (Cebu, sweet)', 80, '2 pcs', 260, 12, 10, 19),

  // ---- chicken / beef ----
  dish('chicken-inasal-home', 'Chicken Inasal (home-grilled)', 200, '1 leg quarter', 340, 33, 3, 21),
  dish('fried-chicken-home', 'Fried Chicken (home)', 120, '1 pc', 300, 22, 8, 20),
  dish('bistek-tagalog', 'Bistek Tagalog', 200, '1 serving', 330, 26, 10, 20),
  dish('beef-tapa', 'Beef Tapa', 100, '1 serving', 240, 26, 6, 12),
  dish('kare-kare', 'Kare-Kare', 250, '1 serving with sauce', 450, 24, 18, 32),

  // ---- fish and seafood ----
  dish('daing-na-bangus', 'Daing na Bangus (fried)', 150, '1 pc', 330, 25, 2, 25),
  dish('inun-unan', 'Inun-unan (fish stewed in vinegar)', 200, '1 serving', 210, 26, 4, 10),
  dish('kinilaw', 'Kinilaw na Tuna', 150, '1 serving', 170, 24, 5, 6),
  dish('sinugbang-isda', 'Sinugbang Isda (grilled fish)', 200, '1 whole small fish', 250, 34, 0, 12),
  dish('ginataang-isda', 'Ginataang Isda', 250, '1 serving', 330, 24, 8, 23),

  // ---- vegetable dishes ----
  dish('pinakbet', 'Pinakbet', 200, '1 serving', 180, 8, 14, 11),
  dish('laing', 'Laing', 150, '1 serving', 250, 5, 10, 22),
  dish('ginataang-kalabasa', 'Ginataang Kalabasa at Sitaw', 200, '1 serving', 220, 5, 18, 15),
  dish('chopsuey', 'Chopsuey', 250, '1 serving', 200, 12, 16, 10),
  dish('utan-bisaya', 'Utan Bisaya', 300, '1 bowl', 120, 6, 16, 4),
  dish('monggos', 'Ginisang Monggo', 300, '1 bowl', 230, 15, 26, 8),

  // ---- noodles, rice meals, breakfast ----
  dish('pancit-canton-home', 'Pancit Canton (home-cooked)', 250, '1 serving', 420, 16, 55, 15),
  dish('pancit-bihon', 'Pancit Bihon', 250, '1 serving', 380, 13, 58, 11),
  dish('sinangag', 'Sinangag (Garlic Fried Rice)', 200, '1 cup', 290, 5, 50, 8),
  dish('arroz-caldo', 'Arroz Caldo', 350, '1 bowl', 290, 14, 42, 8),
  dish('champorado', 'Champorado', 300, '1 bowl', 330, 6, 62, 7),
  dish('tortang-talong', 'Tortang Talong', 150, '1 pc', 220, 10, 8, 17),
  dish('lumpiang-shanghai', 'Lumpiang Shanghai', 90, '3 pcs', 240, 10, 16, 15),
  dish('lumpiang-sariwa', 'Lumpiang Sariwa', 150, '1 roll', 210, 7, 26, 9),

  // ---- desserts / snacks ----
  dish('halo-halo-home', 'Halo-Halo (home)', 350, '1 tall glass', 330, 7, 58, 8),
  dish('bibingka', 'Bibingka', 120, '1 slice', 280, 6, 42, 10),
  dish('puto', 'Puto', 60, '2 pcs', 160, 3, 32, 2),
  dish('biko', 'Biko', 120, '1 slice', 330, 4, 58, 9),
  dish('turon', 'Turon', 90, '1 pc', 230, 2, 42, 7),
  dish('banana-cue', 'Banana Cue', 100, '1 stick', 220, 1, 48, 4),
  dish('leche-flan', 'Leche Flan', 100, '1 slice', 300, 7, 40, 12),
  dish('buko-pandan', 'Buko Pandan', 150, '1 serving', 250, 3, 32, 13),
];
