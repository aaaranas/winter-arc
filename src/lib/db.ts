import { PrismaClient } from '@/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';

/**
 * Single Prisma client for the app, backed by Prisma Postgres.
 *
 *   local dev   DATABASE_URL="postgres://...@db.prisma.io:5432/postgres?sslmode=require"
 *   production  the POOLED endpoint (pooled.db.prisma.io), set in Vercel
 *
 * Why @prisma/adapter-pg rather than the @prisma/adapter-ppg serverless driver:
 * Next.js server components run on Vercel's Node.js runtime, not the edge, and
 * Prisma's guidance is to prefer adapter-pg there. Serverless concurrency is
 * handled by pointing production at Prisma Postgres's pooled endpoint rather
 * than by swapping drivers — a pool in front of the database, instead of a
 * different client in front of the pool.
 *
 * The client is created LAZILY, on the first query rather than on import.
 * `next build` loads every page module to collect its config, so validating the
 * connection at import time made the whole build fail with
 * "Failed to collect page data for /plan" when DATABASE_URL was absent. Every
 * page that touches the database is `force-dynamic`, so the build genuinely
 * does not need one — only requests do.
 */

function createPrismaClient() {
  const connectionString = process.env.DATABASE_URL;

  if (!connectionString) {
    throw new Error(
      'DATABASE_URL is not set. Copy .env.example to .env for local development, ' +
        'or set it in your host’s environment variables for production.',
    );
  }

  return new PrismaClient({
    adapter: new PrismaPg({ connectionString }),
  });
}

// Next.js dev server hot-reloads modules, which would otherwise open a new
// connection pool on every edit until the process runs out of handles.
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

function getClient(): PrismaClient {
  if (!globalForPrisma.prisma) {
    globalForPrisma.prisma = createPrismaClient();
  }
  return globalForPrisma.prisma;
}

/**
 * Behaves exactly like a PrismaClient, but defers construction until the first
 * property access — `db.workout.findMany(...)`, say. Importing this module does
 * nothing, which is what keeps the build database-free.
 */
export const db: PrismaClient = new Proxy({} as PrismaClient, {
  get(_target, property, receiver) {
    const client = getClient();
    const value = Reflect.get(client, property, receiver);
    // Methods like $transaction must stay bound to the real client.
    return typeof value === 'function' ? value.bind(client) : value;
  },
});
