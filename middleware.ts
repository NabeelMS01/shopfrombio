import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host');

  if (!host) {
    return new Response('No host header', { status: 400 });
  }

  // Prevent redirect loops for Next.js internal assets
  if (pathname.startsWith('/_next')) {
    return NextResponse.next();
  }

  // Use a more specific domain from environment variables, or a default for local dev
  const appDomain = process.env.APP_DOMAIN || 'localhost:9002';

  // Extract the subdomain by removing the app domain
  const subdomain = host.endsWith(`.${appDomain}`) ? host.replace(`.${appDomain}`, '') : null;
  
  // If a subdomain exists, rewrite to the dynamic store route.
  if (subdomain) {
    url.pathname = `/${subdomain}${pathname}`;
    return NextResponse.rewrite(url);
  }
  
  // Otherwise, it's a request for the main app, so do nothing.
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
