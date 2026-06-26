import { NextResponse, type NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const publicPaths = ['/', '/login', '/auth/callback'];
  const isPublicPath = publicPaths.includes(request.nextUrl.pathname);

  if (!isPublicPath) {
    const url = new URL('/login', request.url);
    url.searchParams.set('redirected_from', request.nextUrl.pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};