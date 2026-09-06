import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { nextCookies } from 'better-auth/next-js';
import { db } from '@/lib/db';
import { sendEmail } from '@/lib/mailer';

/**
 * Email + password authentication, backed by the app's own Postgres.
 *
 * No third-party identity provider: accounts, sessions and password hashes all
 * live in tables alongside the workout data. Better Auth handles the hashing
 * (scrypt) and session cookies; we only supply storage and how to send mail.
 *
 * EMAIL VERIFICATION IS CURRENTLY OFF. Winter Arc is deployed on a .vercel.app
 * subdomain, which cannot be verified as a sending domain with any email
 * provider — so verification emails would never reach anyone but the account
 * that owns the Resend key, and every friend's signup would dead-end.
 *
 * The trade-off accepted: someone can sign up with an address they do not own.
 * For a known circle of friends that is tolerable; for a public app it is not.
 *
 * To turn it back on once you own a domain:
 *   1. Verify the domain with Resend, set RESEND_API_KEY and EMAIL_FROM.
 *   2. Set requireEmailVerification and sendOnSignUp to true below.
 *   3. In src/components/auth/auth-form.tsx, send new signups to
 *      /verify-email instead of straight into the app.
 * The /verify-email route and the resend button are kept for exactly that.
 */

function appUrl(): string {
  return (
    process.env.BETTER_AUTH_URL ??
    (process.env.VERCEL_PROJECT_PRODUCTION_URL
      ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
      : 'http://localhost:3000')
  );
}

export const auth = betterAuth({
  database: prismaAdapter(db, { provider: 'postgresql' }),

  baseURL: appUrl(),

  emailAndPassword: {
    enabled: true,
    // See the note above before changing this.
    requireEmailVerification: false,
    // Straight into the app after signing up — there is nothing to wait for.
    autoSignIn: true,
    minPasswordLength: 8,
    sendResetPassword: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Reset your Winter Arc password',
        text: [
          'Someone asked to reset the password for this Winter Arc account.',
          '',
          'Open this link to set a new one:',
          url,
          '',
          'If that was not you, ignore this email and nothing will change.',
        ].join('\n'),
      });
    },
  },

  emailVerification: {
    // Off with verification: sending mail that cannot be delivered would just
    // slow signup down and fill the log with undeliverable links.
    sendOnSignUp: false,
    autoSignInAfterVerification: true,
    sendVerificationEmail: async ({ user, url }) => {
      await sendEmail({
        to: user.email,
        subject: 'Verify your Winter Arc account',
        text: [
          `Welcome to Winter Arc.`,
          '',
          'Confirm this email address to finish setting up your account:',
          url,
          '',
          'If you did not sign up, you can ignore this email.',
        ].join('\n'),
      });
    },
  },

  /**
   * Rate limiting, stored in the database.
   *
   * Better Auth enables this in production by default, but its default storage
   * is in-memory — useless on Vercel, where each serverless invocation may be a
   * fresh instance, so a counter never accumulates and a brute-force attempt
   * walks straight through. `database` makes the counter shared and real.
   *
   * The custom rules matter more than the global one. The global limit exists
   * to stop a runaway client; the per-path limits are what actually protect a
   * semi-public URL: guessing a friend's password, or mass-creating accounts
   * because signup needs no email verification.
   *
   * Windows are in seconds.
   */
  rateLimit: {
    enabled: true,
    storage: 'database',
    window: 60,
    max: 120,
    customRules: {
      // Password guessing. Five attempts a minute is generous for a human and
      // hopeless for a script.
      '/sign-in/email': { window: 60, max: 5 },
      // Account creation. Verification is off, so this is the only thing
      // standing between a stranger and an unbounded number of accounts.
      '/sign-up/email': { window: 3600, max: 3 },
      // Reset mail costs money to send and is a spam vector.
      '/request-password-reset': { window: 3600, max: 3 },
      '/forget-password': { window: 3600, max: 3 },
    },
  },

  session: {
    // Long sessions: this is a training log opened mid-workout, and being
    // signed out at the squat rack is a genuinely bad experience.
    expiresIn: 60 * 60 * 24 * 60, // 60 days
    updateAge: 60 * 60 * 24, // refresh the expiry at most once a day
  },

  // Must stay last: lets server actions set the session cookie.
  plugins: [nextCookies()],
});

export type Session = typeof auth.$Infer.Session;
