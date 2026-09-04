import 'server-only';

/**
 * Outbound email, used for account verification and password resets.
 *
 * Deliberately pluggable, because email is the one part of auth that cannot be
 * made to work from code alone — it needs a sending service and, for real
 * delivery to other people, a domain you control.
 *
 * Behaviour:
 *   RESEND_API_KEY set    -> sends through Resend
 *   RESEND_API_KEY unset  -> logs the link to the server console instead
 *
 * The console fallback is not a placeholder to be forgotten: it means signup
 * works end to end while you are still deciding on a domain. You paste the
 * logged link into the browser to verify. Only you can see the server log, so
 * it is safe locally — but it means nobody else can verify their account until
 * a real key is configured.
 */

export type SendEmailArgs = {
  to: string;
  subject: string;
  /** Plain-text body. Kept simple on purpose — these are transactional notes. */
  text: string;
};

export function isEmailConfigured(): boolean {
  return Boolean(process.env.RESEND_API_KEY && process.env.EMAIL_FROM);
}

export async function sendEmail({ to, subject, text }: SendEmailArgs): Promise<void> {
  const apiKey = process.env.RESEND_API_KEY;
  const from = process.env.EMAIL_FROM;

  if (!apiKey || !from) {
    // No provider configured. Log rather than throw, so signup still completes
    // and the flow can be finished by hand.
    console.warn(
      `\n[mailer] No RESEND_API_KEY/EMAIL_FROM set — email not sent.\n` +
        `[mailer] To:      ${to}\n` +
        `[mailer] Subject: ${subject}\n` +
        `[mailer] Body:\n${text}\n`,
    );
    return;
  }

  const response = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ from, to, subject, text }),
  });

  if (!response.ok) {
    const detail = await response.text().catch(() => '');
    // Surface the failure rather than silently dropping it — a verification
    // email that never arrives looks identical to a broken signup.
    throw new Error(
      `Failed to send email (${response.status}): ${detail.slice(0, 300)}`,
    );
  }
}
