import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { match } from '@formatjs/intl-localematcher';
import Negotiator from 'negotiator';
import { locales, defaultLocale } from '@/i18n/config';

function getLocale(request: NextRequest): string {
  const headers: Record<string, string> = {};
  request.headers.forEach((value, key) => {
    headers[key] = value;
  });

  const languages = new Negotiator({ headers }).languages();
  try {
    return match(languages, [...locales], defaultLocale);
  } catch {
    return defaultLocale;
  }
}

import { getToken } from 'next-auth/jwt';

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip internal paths and API routes
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api') ||
    pathname.includes('.') // static files
  ) {
    return;
  }

  // Admin route protection
  const isAdminRoute = pathname.includes('/admin');
  const isLoginRoute = pathname.includes('/admin/login');

  if (isAdminRoute) {
    const token = await getToken({ req: request, secret: process.env.NEXTAUTH_SECRET });
    
    if (!token && !isLoginRoute) {
      // Redirect to login (preserving locale if present, or defaults to /en/admin/login)
      const locale = getLocale(request);
      return NextResponse.redirect(new URL(`/${locale}/admin/login`, request.url));
    }
    
    if (token && isLoginRoute) {
      // Redirect away from login if already authenticated
      const locale = getLocale(request);
      return NextResponse.redirect(new URL(`/${locale}/admin`, request.url));
    }
  }

  // Check if there is any supported locale in the pathname
  const pathnameHasLocale = locales.some(
    (locale) => pathname.startsWith(`/${locale}/`) || pathname === `/${locale}`
  );

  if (pathnameHasLocale) return NextResponse.next();

  // Redirect if there is no locale
  const locale = getLocale(request);
  request.nextUrl.pathname = `/${locale}${pathname}`;
  return NextResponse.redirect(request.nextUrl);
}

export const config = {
  matcher: ['/((?!_next|api|.*\\..*).*)'],
};
