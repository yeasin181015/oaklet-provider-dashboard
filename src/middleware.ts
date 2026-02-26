import { auth } from '@/auth';
import { NextResponse } from 'next/server';
import { APP_ROUTES } from '@/lib/routes/app-routes';

const PUBLIC_PATHS = [APP_ROUTES.auth.login, '/api/auth'];

export default auth((req) => {
  const { pathname } = req.nextUrl;

  const isPublic = PUBLIC_PATHS.some((p) => pathname.startsWith(p));
  const isApiRoute = pathname.startsWith('/api/');
  const isAuthenticated = !!req.auth;

  // Allow public paths and internal API routes
  if (isPublic || isApiRoute) return NextResponse.next();

  // Redirect unauthenticated users to login
  if (!isAuthenticated) {
    const loginUrl = new URL(APP_ROUTES.auth.login, req.nextUrl.origin);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // Redirect authenticated users away from root to dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL(APP_ROUTES.dashboard, req.nextUrl.origin));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
