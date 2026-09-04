import { auth } from '@/lib/auth';
import { toNextJsHandler } from 'better-auth/next-js';

/**
 * Better Auth's endpoints: sign-up, sign-in, sign-out, email verification and
 * password reset all live under /api/auth/*.
 */
export const { GET, POST } = toNextJsHandler(auth.handler);
