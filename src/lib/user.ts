import 'server-only';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { auth } from '@/lib/auth';

/**
 * Who is making this request.
 *
 * Every query and mutation scopes on the id returned here, which is what keeps
 * one person's training log out of another's. It replaced a hardcoded "local"
 * constant when the app went multi-user — the schema was built for that from
 * the start, so the change was this file plus its call sites, not a migration.
 */

export async function getSession() {
  return auth.api.getSession({ headers: await headers() });
}

/** The signed-in user's id, or null when signed out. */
export async function getUserId(): Promise<string | null> {
  const session = await getSession();
  return session?.user.id ?? null;
}

/**
 * The signed-in user's id, redirecting to sign-in when there isn't one.
 *
 * Use this in every page and server action that touches user data. Middleware
 * already gates the routes, but this is the check that actually matters:
 * middleware can be bypassed by a direct server-action POST, and this cannot.
 */
export async function requireUserId(): Promise<string> {
  const id = await getUserId();
  if (!id) redirect('/sign-in');
  return id;
}
