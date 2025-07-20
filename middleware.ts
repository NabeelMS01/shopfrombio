import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host');

  if (!host) {
    return new Response('No host header', { status: 400 });
  }

  // Use a more specific domain from environment variables, or a default for local dev
  const appDomain = process.env.APP_DOMAIN || 'localhost:9002';
  
  // Prevent redirect loops for Next.js internal assets
  if (pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Extract the subdomain by removing the app domain
  const subdomain = host.replace(`.${appDomain}`, '');

  // These are the public-facing routes of the main app
  const publicRoutes = ['/', '/login', '/signup'];

  // If the host is just the app domain (no subdomain) and the path is public, do nothing.
  if (host === appDomain && publicRoutes.includes(pathname)) {
    return NextResponse.next();
  }

  // It's a subdomain request, rewrite to the dynamic route
  if (subdomain !== host) {
    url.pathname = `/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }
  
  // All other requests can pass through
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
