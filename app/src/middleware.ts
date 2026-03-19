import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PUBLIC_PATHS = ['/login', '/api/auth'];
const SESSION_SECONDS = 4 * 60 * 60; // 4 hours of inactivity

const COOKIE_OPTS = {
  httpOnly: true,
  secure: true,
  sameSite: 'lax' as const,
  maxAge: SESSION_SECONDS,
  path: '/',
};

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (PUBLIC_PATHS.some(p => pathname.startsWith(p))) {
    return NextResponse.next();
  }

  const auth = request.cookies.get('tl-auth');
  if (auth?.value === 'ok') {
    const res = NextResponse.next();
    res.cookies.set('tl-auth', 'ok', COOKIE_OPTS);
    return res;
  }

  const loginUrl = new URL('/login', request.url);
  loginUrl.searchParams.set('from', pathname);
  return NextResponse.redirect(loginUrl);
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon\\.ico).*)'],
};
