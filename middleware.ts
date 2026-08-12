import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const isDemoUnlocked = req.cookies.has('demo_unlocked');
  const isDemoLoginRoute = req.nextUrl.pathname.startsWith('/demo-login');

  if (!isDemoUnlocked && !isDemoLoginRoute) {
    return NextResponse.redirect(new URL('/demo-login', req.url));
  }

  if (isDemoUnlocked && isDemoLoginRoute) {
    return NextResponse.redirect(new URL('/', req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
