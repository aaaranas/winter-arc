'use client';

import { createAuthClient } from 'better-auth/react';

/**
 * Browser-side auth. Talks to /api/auth/* — no base URL needed because the
 * client and server are the same origin.
 */
export const authClient = createAuthClient();

export const { signIn, signUp, signOut, useSession } = authClient;
