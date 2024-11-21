import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const accessToken = request.cookies.get('access_token');

  if (pathname === '/signin' && accessToken) {
    return NextResponse.redirect(new URL('/', request.url));
  }

  if (pathname === '/lobby' && !accessToken) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }

  if (pathname.startsWith('/game') && !accessToken) {
    return NextResponse.redirect(new URL('/signin', request.url));
  }
}

export const config = {
  matcher: ['/signin', '/lobby', '/game/:roomId*'],
};
