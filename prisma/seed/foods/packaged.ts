import type { SeedFood } from '../types';

/**
 * Packaged goods commonly found in Philippine groceries.
 *
 * HONESTY NOTE — why these are ESTIMATE and not LABEL
 * ---------------------------------------------------
 * The brief asked for values taken from publicly published nutrition facts
 * panels, cited per item. Most PH packaged brands do not publish their panels
 * in any retrievable form, and none of the rows below could be verified against
 * a primary source at seed-writing time.
 *
 * Rather than attach an authoritative-looking citation to a number that was not
 * actually read off a panel, every row here is ESTIMATE. The values are typical
 * for the product and serving stated, useful for getting going, and wrong in
 * the details.
 *
 * The nutrition facts panel is printed on the pack in your kitchen. When you
 * next use one of these, correct it in the app — the edit sticks, and the row
 * flips to a LABEL source once you've verified it.
 */

function packaged(
  seedKey: string,
  name: string,
  brand: string,
  servingSize: number,
  servingUnit: string,
  servingLabel: string,
  calories: number,
  proteinG: number,
  carbsG: number,
  fatG: number,
): SeedFood {
  return {
    seedKey,
    name,
    brand,
    category: 'PACKAGED',
    sourceType: 'ESTIMATE',
    source:
      'Typical value for this product. NOT verified against the printed nutrition facts panel — check the pack and correct.',
    isEstimate: true,
    calories,
    proteinG,
    carbsG,
    fatG,
    servingSize,
    servingUnit,
    servingLabel,
  };
}

export const packagedFoods: SeedFood[] = [
  // ---- canned fish and meat ----
  packaged('century-tuna-flakes-oil', 'Tuna Flakes in Oil', 'Century Tuna', 180, 'g', '1 can (180 g)', 330, 33, 1, 21),
  packaged('century-tuna-hot-spicy', 'Tuna Hot & Spicy', 'Century Tuna', 180, 'g', '1 can (180 g)', 290, 30, 4, 17),
  packaged('ligo-sardines-tomato', 'Sardines in Tomato Sauce', 'Ligo', 155, 'g', '1 can (155 g)', 230, 22, 5, 13),
  packaged('555-sardines', 'Sardines in Tomato Sauce', '555', 155, 'g', '1 can (155 g)', 225, 21, 5, 13),
  packaged('argentina-corned-beef', 'Corned Beef', 'Argentina', 150, 'g', '1 can (150 g)', 280, 20, 4, 20),
  packaged('purefoods-corned-beef', 'Corned Beef', 'Purefoods', 150, 'g', '1 can (150 g)', 300, 21, 3, 23),
  packaged('spam-classic', 'Spam Classic', 'Spam', 56, 'g', '2 oz (56 g)', 180, 7, 1, 16),
  packaged('cdo-meat-loaf', 'Meat Loaf', 'CDO', 150, 'g', '1 can (150 g)', 300, 12, 18, 20),

  // ---- instant noodles ----
  packaged('luckyme-pancit-canton-original', 'Pancit Canton Original', 'Lucky Me!', 80, 'g', '1 pack (80 g)', 340, 8, 50, 12),
  packaged('luckyme-pancit-canton-chilimansi', 'Pancit Canton Chilimansi', 'Lucky Me!', 80, 'g', '1 pack (80 g)', 345, 8, 50, 13),
  packaged('luckyme-beef-namnam', 'Instant Mami Beef Na Nam', 'Lucky Me!', 55, 'g', '1 pack (55 g)', 240, 6, 35, 8),
  packaged('nissin-cup-noodles-seafood', 'Cup Noodles Seafood', 'Nissin', 60, 'g', '1 cup (60 g)', 270, 6, 38, 11),
  packaged('payless-xtra-big', 'Xtra Big Pancit Canton', 'Payless', 90, 'g', '1 pack (90 g)', 390, 8, 56, 15),

  // ---- dairy and drinks ----
  packaged('alaska-evap', 'Evaporated Filled Milk', 'Alaska', 30, 'ml', '2 tbsp (30 ml)', 40, 1, 3, 2.5),
  packaged('alaska-condensada', 'Condensada', 'Alaska', 40, 'g', '2 tbsp (40 g)', 130, 3, 22, 3),
  packaged('bear-brand-powder', 'Fortified Powdered Milk', 'Bear Brand', 30, 'g', '4 tbsp (30 g)', 140, 6, 17, 5),
  packaged('milo-powder', 'Milo Activ-Go Powder', 'Milo', 24, 'g', '3 tbsp (24 g)', 95, 2, 17, 2),
  packaged('nescafe-3in1-original', '3-in-1 Original Coffee Mix', 'Nescafé', 20, 'g', '1 sachet (20 g)', 90, 1, 15, 2.5),
  packaged('kopiko-black-3in1', 'Black 3-in-1 Coffee Mix', 'Kopiko', 25, 'g', '1 sachet (25 g)', 110, 1, 19, 3),
  packaged('c2-green-tea', 'C2 Green Tea Apple', 'C2', 500, 'ml', '1 bottle (500 ml)', 130, 0, 33, 0),
  packaged('gatorade-blue', 'Gatorade Blue Bolt', 'Gatorade', 500, 'ml', '1 bottle (500 ml)', 130, 0, 33, 0),

  // ---- bread, biscuits, snacks ----
  packaged('gardenia-white-bread', 'Classic White Bread', 'Gardenia', 50, 'g', '2 slices (50 g)', 135, 4, 26, 1.5),
  packaged('gardenia-wheat-bread', 'Wheat Raisin Loaf', 'Gardenia', 50, 'g', '2 slices (50 g)', 140, 4, 27, 2),
  packaged('skyflakes', 'Skyflakes Crackers', 'M.Y. San', 25, 'g', '1 pack (3 pcs)', 120, 2, 18, 4.5),
  packaged('fita', 'Fita Crackers', 'M.Y. San', 25, 'g', '1 pack (4 pcs)', 125, 2, 18, 5),
  packaged('rebisco-crackers', 'Rebisco Crackers', 'Rebisco', 30, 'g', '1 pack', 145, 2, 20, 6),
  packaged('piattos-cheese', 'Piattos Cheese', 'Jack n Jill', 40, 'g', '1 pack (40 g)', 210, 2, 25, 11),
  packaged('nova-multigrain', 'Nova Multigrain Snack', 'Jack n Jill', 40, 'g', '1 pack (40 g)', 200, 3, 24, 10),
  packaged('boy-bawang', 'Cornick Garlic', 'Boy Bawang', 100, 'g', '1 pack (100 g)', 480, 9, 63, 21),
  packaged('oishi-prawn-crackers', 'Prawn Crackers', 'Oishi', 60, 'g', '1 pack (60 g)', 300, 3, 38, 15),

  // ---- spreads, condiments, staples ----
  packaged('ladys-choice-peanut-butter', 'Peanut Butter Creamy', "Lady's Choice", 32, 'g', '2 tbsp (32 g)', 190, 7, 7, 16),
  packaged('ladys-choice-mayo', 'Real Mayonnaise', "Lady's Choice", 15, 'g', '1 tbsp (15 g)', 100, 0, 1, 11),
  packaged('datu-puti-soy', 'Soy Sauce', 'Datu Puti', 15, 'ml', '1 tbsp (15 ml)', 10, 1, 1, 0),
  packaged('ufc-banana-ketchup', 'Banana Catsup', 'UFC', 15, 'g', '1 tbsp (15 g)', 25, 0, 6, 0),
  packaged('mama-sita-oyster', 'Oyster Sauce', 'Mama Sita', 15, 'g', '1 tbsp (15 g)', 20, 0, 4, 0),
  packaged('knorr-sinigang-mix', 'Sinigang sa Sampaloc Mix', 'Knorr', 11, 'g', '1 sachet (11 g)', 30, 1, 6, 0),
  packaged('quaker-oats', 'Quick Cooking Oats', 'Quaker', 40, 'g', '1/2 cup dry (40 g)', 150, 5, 27, 3),
  packaged('nutri-asia-vinegar', 'Cane Vinegar', 'Datu Puti', 15, 'ml', '1 tbsp (15 ml)', 3, 0, 0, 0),
];
