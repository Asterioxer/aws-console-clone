import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('jwt')?.value;
  const isAuthPage = request.nextUrl.pathname.startsWith('/login');

  if (request.nextUrl.pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!token && !isAuthPage) {
    // Exclude api routes if needed, but since it's a proxy, we want auth there too unless it's /api/auth
    if (!request.nextUrl.pathname.startsWith('/api/auth')) {
      return NextResponse.redirect(new URL('/login', request.url));
    }
  }

  if (token && isAuthPage) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
};
