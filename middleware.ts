import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host');

  if (!host) {
    return new Response('No host header', { status: 400 });
  }
  
  // This is your production domain.
  // In development, it will be localhost:9002.
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:9002';

  // These are the public routes that should not be rewritten.
  // We check if the pathname starts with any of these.
  const publicRoutes = [
    '/',
    '/login',
    '/signup',
    '/api',
    '/_next',
    '/favicon.ico',
    // Add other public assets or routes here if needed
  ];

  if (publicRoutes.some(route => pathname.startsWith(route))) {
    return NextResponse.next();
  }

  // Determine the subdomain by removing the app domain from the host.
  const subdomain = host.endsWith(`.${appDomain}`)
    ? host.replace(`.${appDomain}`, '')
    : null;

  // If a subdomain exists, rewrite the path to the dynamic store route.
  if (subdomain && subdomain !== 'www') {
    url.pathname = `/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }

  // For any other case, let the request proceed.
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
