import type { Metadata, Viewport } from 'next';
import { Geist, Geist_Mono } from 'next/font/google';
import Link from 'next/link';
import { Dumbbell, Settings } from 'lucide-react';
import './globals.css';
import { ThemeProvider } from '@/components/theme-provider';
import { AppNav } from '@/components/layout/app-nav';
import { AppSidebar } from '@/components/layout/app-sidebar';
import { ThemeToggle } from '@/components/layout/theme-toggle';
import { Button } from '@/components/ui/button';
import { Toaster } from '@/components/ui/sonner';
import { SignOutButton } from '@/components/auth/sign-out-button';
import { getSession } from '@/lib/user';
import { Logo } from '@/components/layout/logo';

const geistSans = Geist({ variable: '--font-geist-sans', subsets: ['latin'] });
const geistMono = Geist_Mono({ variable: '--font-geist-mono', subsets: ['latin'] });

export const metadata: Metadata = {
  title: { default: 'Winter Arc', template: '%s · Winter Arc' },
  description: 'Workout and macro tracking.',
  manifest: '/manifest.webmanifest',
  applicationName: 'Winter Arc',
  appleWebApp: {
    capable: true,
    title: 'Winter Arc',
    statusBarStyle: 'black-translucent',
  },
  icons: {
    icon: [{ url: '/icons/icon-192.png', sizes: '192x192', type: 'image/png' }],
    apple: [{ url: '/icons/icon-192.png' }],
  },
};

export const viewport: Viewport = {
  // Matches the neutral palette so the phone chrome blends with the app.
  themeColor: [
    { media: '(prefers-color-scheme: light)', color: '#ffffff' },
    { media: '(prefers-color-scheme: dark)', color: '#0a0a0a' },
  ],
  width: 'device-width',
  initialScale: 1,
  viewportFit: 'cover',
};

export default async function RootLayout({ children }: LayoutProps<'/'>) {
  // Signed-out screens (sign-in, sign-up, verification, password reset) render
  // their own centred shell, so the app chrome must not wrap them.
  const session = await getSession();
  const user = session?.user ?? null;

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full">
        <ThemeProvider
          attribute="class"
          defaultTheme="dark"
          enableSystem={false}
          disableTransitionOnChange
        >
          {!user ? (
            children
          ) : (
          <div className="flex min-h-dvh">
            <AppSidebar userName={user.name || user.email} />

            <div className="flex min-w-0 flex-1 flex-col">
              {/* Phone/tablet header. The sidebar carries the branding and the
                  theme toggle from lg up, so this hides there. */}
              <header className="flex items-center justify-between gap-2 px-5 pt-5 pb-1 lg:hidden">
                <Link href="/" aria-label="Winter Arc — home">
                  <Logo />
                </Link>
                <div className="flex items-center gap-0.5">
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                  >
                    <Link href="/exercises" aria-label="Exercises">
                      <Dumbbell className="size-4" />
                    </Link>
                  </Button>
                  <Button
                    asChild
                    variant="ghost"
                    size="icon"
                    className="text-muted-foreground"
                  >
                    <Link href="/settings" aria-label="Settings">
                      <Settings className="size-4" />
                    </Link>
                  </Button>
                  <ThemeToggle />
                  <SignOutButton compact />
                </div>
              </header>

              {/* pb clears the fixed bottom bar on phones. */}
              <main className="mx-auto w-full max-w-3xl flex-1 px-5 pb-28 lg:px-10 lg:pt-4 lg:pb-16 xl:max-w-4xl">
                {children}
              </main>
            </div>
          </div>
          )}

          {user ? <AppNav /> : null}
          <Toaster position="top-center" />
        </ThemeProvider>
      </body>
    </html>
  );
}
