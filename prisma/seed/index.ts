import 'dotenv/config';
import { PrismaClient } from '../../src/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';
import { stapleFoods } from './foods/staples';
import { packagedFoods } from './foods/packaged';
import { homeCookedFoods } from './foods/home-cooked';
import { fastfoodFoods } from './foods/fastfood';
import type { SeedFood } from './types';

const url = process.env.DATABASE_URL;
if (!url) throw new Error('DATABASE_URL is not set. Copy .env.example to .env.');

const prisma = new PrismaClient({
  adapter: new PrismaLibSql({ url, authToken: process.env.DATABASE_AUTH_TOKEN }),
});

const allFoods: SeedFood[] = [
  ...stapleFoods,
  ...packagedFoods,
  ...homeCookedFoods,
  ...fastfoodFoods,
];

async function main() {
  // Upsert on seedKey so re-running the seed corrects values in place instead
  // of duplicating rows — and never clobbers foods you added yourself, which
  // have a null seedKey.
  for (const food of allFoods) {
    const { seedKey, ...data } = food;
    await prisma.foodItem.upsert({
      where: { seedKey },
      create: { ...data, seedKey },
      update: data,
    });
  }

  // One settings row for the hardcoded local user.
  await prisma.settings.upsert({
    where: { userId: 'local' },
    create: { userId: 'local' },
    update: {},
  });

  const byProvenance = allFoods.reduce<Record<string, number>>((acc, f) => {
    acc[f.sourceType] = (acc[f.sourceType] ?? 0) + 1;
    return acc;
  }, {});

  const total = await prisma.foodItem.count();

  console.log(`\nSeeded ${allFoods.length} foods (${total} total in DB).`);
  console.log('\nBy category:');
  for (const c of ['STAPLE', 'PACKAGED', 'HOME_COOKED', 'FASTFOOD'] as const) {
    console.log(`  ${c.padEnd(12)} ${allFoods.filter((f) => f.category === c).length}`);
  }
  console.log('\nBy provenance:');
  for (const [k, v] of Object.entries(byProvenance).sort()) {
    console.log(`  ${k.padEnd(12)} ${v}`);
  }
  const estimates = allFoods.filter((f) => f.isEstimate).length;
  console.log(
    `\n${estimates} of ${allFoods.length} rows are estimates and are flagged as such in the UI.\n`,
  );
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(() => prisma.$disconnect());
