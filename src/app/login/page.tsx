import { auth } from '@/auth';
import { APP_ROUTES } from '@/lib/routes/app-routes';
import { LoginForm } from '@/modules/authentication/components/LoginForm';
import { redirect } from 'next/navigation';

export const metadata = { title: 'Sign In — Oaklet Provider Dashboard' };

export default async function LoginPage() {
  const session = await auth();
  if (session) redirect(APP_ROUTES.dashboard);

  return (
    <div className='flex min-h-screen items-center justify-center bg-slate-50 px-4'>
      <div className='w-full max-w-sm'>
        <div className='mb-8 text-center'>
          <div className='mb-3 inline-flex h-12 w-12 items-center justify-center rounded-xl bg-blue-600 text-white text-xl font-bold'>
            O
          </div>
          <h1 className='text-2xl font-semibold text-slate-900'>Oaklet</h1>
          <p className='mt-1 text-sm text-slate-500'>Provider Dashboard</p>
        </div>

        <div className='rounded-xl border border-slate-200 bg-white p-6 shadow-sm'>
          <h2 className='mb-4 text-lg font-semibold text-slate-900'>Sign in to your account</h2>
            <LoginForm />
        </div>

        <p className='mt-4 text-center text-xs text-slate-400'>
          Demo: <span className='font-mono'>dr.smith@example.com</span> / <span className='font-mono'>password123</span>
        </p>
      </div>
    </div>
  );
}
