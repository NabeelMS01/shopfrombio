import { type NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: [
    /*
     * Match all paths except for:
     * 1. /api routes
     * 2. /_next (Next.js internals)
     * 3. /_static (inside /public)
     * 4. all root files inside /public (e.g. /favicon.ico)
     */
    '/((?!api/|_next/|_static/|[\\w-]+\\.\\w+).*)',
  ],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  const sessionCookie = req.cookies.get('session');

  // 1. Protect dashboard routes
  if (path.startsWith('/dashboard') && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // 2. Redirect logged-in users from auth pages
  if (sessionCookie && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // 3. Handle subdomains
  const host = req.headers.get('host')!;
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:9002';
  
  // Don't rewrite requests to the root page, login, or signup
  if (host === appDomain && (path === '/' || path === '/login' || path === '/signup' || path.startsWith('/dashboard'))) {
    return NextResponse.next();
  }

  // Check if it's a subdomain
  if (host !== appDomain && host.endsWith(appDomain)) {
      const subdomain = host.replace(`.${appDomain}`, '');
      return NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url));
  }

  return NextResponse.next();
}
