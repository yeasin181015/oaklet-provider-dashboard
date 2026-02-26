'use client';

import { Button } from '@/components/ui/button';
import { APP_ROUTES } from '@/lib/routes/app-routes';
import { LogOut, User } from 'lucide-react';
import { signOut, useSession } from 'next-auth/react';

export function DashboardHeader() {
  const { data: session } = useSession();

  const handleLogout = async () => {
    await signOut({ callbackUrl: APP_ROUTES.auth.login });
  };

  const displayName = session?.user
    ? `Dr. ${session.user.firstName ?? ''} ${session.user.lastName ?? ''}`.trim()
    : 'Provider';

  return (
    <header className='sticky top-0 z-40 border-b border-slate-200 bg-white'>
      <div className='mx-auto flex h-14 max-w-7xl items-center justify-between px-4 sm:px-6'>
        <div className='flex items-center gap-3'>
          <div className='flex h-8 w-8 items-center justify-center rounded-lg bg-blue-600 text-sm font-bold text-white'>O</div>
          <span className='font-semibold text-slate-900'>Oaklet</span>
          <span className='hidden text-slate-300 sm:inline'>|</span>
          <span className='hidden text-sm text-slate-500 sm:inline'>Provider Dashboard</span>
        </div>

        <div className='flex items-center gap-3'>
          <div className='hidden items-center gap-1.5 text-sm text-slate-600 sm:flex'>
            <User className='h-4 w-4' />
            <span>{displayName}</span>
          </div>
          <Button variant='ghost' size='sm' onClick={handleLogout} className='gap-1.5 text-slate-600 hover:text-slate-900'>
            <LogOut className='h-4 w-4' />
            <span className='hidden sm:inline'>Sign out</span>
          </Button>
        </div>
      </div>
    </header>
  );
}
