import { PrismaClient } from '@/generated/prisma/client';
import { PrismaLibSql } from '@prisma/adapter-libsql';

/**
 * Single Prisma client for the app.
 *
 * We use the libSQL adapter for every environment rather than
 * better-sqlite3, because one client handles both cases:
 *
 *   local dev   DATABASE_URL="file:./dev.db"
 *   production  DATABASE_URL="libsql://<db>.turso.io"
 *               DATABASE_AUTH_TOKEN="<token>"
 *
 * That keeps `provider = "sqlite"` and the schema unchanged when you deploy.
 *
 * IMPORTANT for Vercel: a `file:` URL will NOT persist there. Vercel's
 * filesystem is ephemeral and not shared between invocations, so every write
 * is lost on redeploy. Point DATABASE_URL at a hosted libSQL database (Turso)
 * before deploying, or the app will silently lose data.
 */

const url = process.env.DATABASE_URL;

if (!url) {
  throw new Error(
    'DATABASE_URL is not set. Copy .env.example to .env for local development.',
  );
}

if (process.env.NODE_ENV === 'production' && url.startsWith('file:')) {
  console.warn(
    '[db] DATABASE_URL is a local file in production. On a serverless host ' +
      '(Vercel) this storage is ephemeral and writes will be lost. ' +
      'Use a libsql:// URL instead.',
  );
}

function createPrismaClient() {
  const adapter = new PrismaLibSql({
    url: url!,
    authToken: process.env.DATABASE_AUTH_TOKEN,
  });

  return new PrismaClient({ adapter });
}

// Next.js dev server hot-reloads modules, which would otherwise open a new
// connection pool on every edit until the process runs out of handles.
const globalForPrisma = globalThis as unknown as {
  prisma: ReturnType<typeof createPrismaClient> | undefined;
};

export const db = globalForPrisma.prisma ?? createPrismaClient();

if (process.env.NODE_ENV !== 'production') {
  globalForPrisma.prisma = db;
}
