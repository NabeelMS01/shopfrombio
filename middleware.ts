import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host');

  if (!host) {
    return new Response('No host header', { status: 400 });
  }

  // Define your production domain. In development, it will be localhost:9002.
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:9002';

  // Extract the subdomain.
  // It's a subdomain if the host does not match the app domain.
  const subdomain = host.endsWith(`.${appDomain}`)
    ? host.replace(`.${appDomain}`, '')
    : null;

  // If there's a subdomain, rewrite the path to the dynamic store route.
  // And it's not one of the public assets.
  if (subdomain && !pathname.startsWith('/_next') && !pathname.startsWith('/favicon.ico')) {
      // Don't rewrite for the root of the subdomain, let it pass through.
      if (pathname === '/') {
          url.pathname = `/${subdomain}`;
          return NextResponse.rewrite(url);
      }
      url.pathname = `/${subdomain}${pathname}`;
      return NextResponse.rewrite(url);
  }

  // For all other cases (no subdomain), let the request proceed as normal.
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
