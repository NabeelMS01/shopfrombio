import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host');

  if (!host) {
    return new Response('No host header', { status: 400 });
  }
  
  const appDomain = process.env.APP_DOMAIN || 'localhost:9002';
  
  // These are the public routes that should not be rewritten
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/api',
    '/_next',
    '/favicon.ico',
  ];

  // If the pathname starts with a public route, do nothing.
  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  const subdomain = host.endsWith(`.${appDomain}`)
    ? host.replace(`.${appDomain}`, '')
    : null;

  // If a subdomain exists, rewrite to the dynamic store route.
  if (subdomain) {
    url.pathname = `/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
