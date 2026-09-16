import { NextResponse } from 'next/server';

export function middleware(request) {
  const token = request.cookies.get('token');
  const isAuthPage = request.nextUrl.pathname.startsWith('/admin/login');
  const isAdminPage = request.nextUrl.pathname.startsWith('/admin');

  if (isAdminPage && !isAuthPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: '/admin/:path*',
};
