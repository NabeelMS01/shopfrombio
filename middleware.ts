import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const url = request.nextUrl.clone();
  const { pathname } = request.nextUrl;
  const host = request.headers.get('host');

  // Ensure host is not null. In a real-world scenario, you might want to 
  // handle this more gracefully, but for this context, it's a safeguard.
  if (!host) {
    return new Response('No host header', { status: 400 });
  }

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:9002';
  
  // Prevent redirect loops
  if (pathname.startsWith(`/_next`)) {
    return NextResponse.next();
  }

  const subdomain = host.replace(`.${appDomain}`, '');
  
  // It's a subdomain request
  if (subdomain !== host) {
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
