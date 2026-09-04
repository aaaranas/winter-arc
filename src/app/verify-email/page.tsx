import { AuthShell } from '@/components/auth/auth-shell';
import { ResendVerification } from '@/components/auth/resend-verification';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Verify your email' };

export default async function VerifyEmailPage({
  searchParams,
}: PageProps<'/verify-email'>) {
  const { email } = await searchParams;
  const address = typeof email === 'string' ? email : null;

  return (
    <AuthShell
      title="Check your email"
      description={
        address ? (
          <>
            We sent a verification link to{' '}
            <span className="text-foreground">{address}</span>. Open it to finish
            setting up your account.
          </>
        ) : (
          'We sent you a verification link. Open it to finish setting up your account.'
        )
      }
    >
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          You cannot sign in until the address is verified — that is what stops
          someone signing up as an email they do not own.
        </p>

        {address ? <ResendVerification email={address} /> : null}

        <p className="text-center text-sm text-muted-foreground">
          Already verified?{' '}
          <a href="/sign-in" className="text-foreground underline underline-offset-4">
            Sign in
          </a>
        </p>
      </div>
    </AuthShell>
  );
}
