import { redirect } from 'next/navigation';
import { AuthShell } from '@/components/auth/auth-shell';
import { AuthForm } from '@/components/auth/auth-form';
import { getUserId } from '@/lib/user';
import { isEmailConfigured } from '@/lib/mailer';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Sign in' };

export default async function SignInPage() {
  if (await getUserId()) redirect('/');

  return (
    <AuthShell title="Sign in" description="Log your training and macros.">
      <AuthForm mode="sign-in" emailEnabled={isEmailConfigured()} />
    </AuthShell>
  );
}
