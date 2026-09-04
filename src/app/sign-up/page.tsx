import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/auth/auth-shell';
import { AuthForm } from '@/components/auth/auth-form';
import { getUserId } from '@/lib/user';
import { isEmailConfigured } from '@/lib/mailer';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Sign up' };

export default async function SignUpPage() {
  if (await getUserId()) redirect('/');

  return (
    <AuthShell
      title="Create an account"
      description="Your workouts and macros stay yours — nobody else sees them."
    >
      <AuthForm mode="sign-up" emailEnabled={isEmailConfigured()} />
    </AuthShell>
  );
}
