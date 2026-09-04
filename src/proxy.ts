import { NextResponse, type NextRequest } from 'next/server';
import { getSessionCookie } from 'better-auth/cookies';

/**
 * Redirects signed-out visitors to /sign-in before a page renders.
 *
 * Lives in proxy.ts, not middleware.ts: Next 16 deprecated the `middleware`
 * file convention and renamed it to `proxy`, with the exported function renamed
 * to match.
 *
 * This is an OPTIMISTIC check: it only looks for the presence of a session
 * cookie, without validating it against the database, because this runs on
 * every request and a query per navigation would be wasteful.
 *
 * It is therefore not the security boundary. `requireUserId()` in each page and
 * server action is — it resolves the real session and cannot be fooled by a
 * forged cookie, and it also covers server-action POSTs that never pass through
 * a matched route. This just saves a signed-out visitor from a redirect flash.
 */
export function proxy(request: NextRequest) {
  const hasSession = getSessionCookie(request);

  if (!hasSession) {
    const signIn = new URL('/sign-in', request.url);
    // Remember where they were headed so sign-in can return them there.
    const { pathname, search } = request.nextUrl;
    if (pathname !== '/') signIn.searchParams.set('next', `${pathname}${search}`);
    return NextResponse.redirect(signIn);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /**
     * Everything except:
     *   api/auth  — the auth endpoints themselves
     *   sign-in, sign-up, verify-email, forgot-password, reset-password
     *   _next     — build output
     *   static assets, the manifest, the service worker and the icons
     */
    '/((?!api/auth|sign-in|sign-up|verify-email|forgot-password|reset-password|_next/static|_next/image|favicon.ico|manifest.webmanifest|sw.js|icons/|workout-guide/|apple-icon.png).*)',
  ],
};
