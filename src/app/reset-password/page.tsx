import { AuthShell } from '@/components/auth/auth-shell';
import { ResetPasswordForm } from '@/components/auth/reset-password-form';

export const dynamic = 'force-dynamic';
export const metadata = { title: 'Set a new password' };

export default async function ResetPasswordPage({
  searchParams,
}: PageProps<'/reset-password'>) {
  const { token } = await searchParams;
  return (
    <AuthShell title="Set a new password">
      <ResetPasswordForm token={typeof token === 'string' ? token : null} />
    </AuthShell>
  );
}
