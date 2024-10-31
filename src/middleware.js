// src/middleware.js (or /middleware.js at the root of the project)

import { NextResponse } from 'next/server';

export function middleware(request) {
  const { pathname } = request.nextUrl;

  // List of routes that require authentication
  const protectedRoutes = ['/upload'];

  if (protectedRoutes.includes(pathname)) {
    const isWalletConnected = request.cookies.get('walletConnected');

    if (!isWalletConnected) {
      const loginUrl = new URL('/', request.url);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/upload'],
};
