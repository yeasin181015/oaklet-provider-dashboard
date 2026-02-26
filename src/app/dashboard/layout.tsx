import { redirect } from 'next/navigation';
import { auth } from '@/auth';
import { APP_ROUTES } from '@/lib/routes/app-routes';
import { DashboardHeader } from '@/components/layout/DashboardHeader';

export default async function DashboardLayout({ children }: { children: React.ReactNode }) {
  const session = await auth();
  if (!session) redirect(APP_ROUTES.auth.login);

  return (
    <div className='min-h-screen bg-slate-50'>
      <DashboardHeader />
      <main className='mx-auto max-w-7xl px-4 py-6 sm:px-6'>
        {children}
      </main>
    </div>
  );
}
