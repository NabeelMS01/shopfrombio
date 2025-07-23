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

  // Protect dashboard routes
  if (path.startsWith('/dashboard') && !sessionCookie) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  // Redirect logged-in users from auth pages
  if (sessionCookie && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }

  // Handle subdomains
  const host = req.headers.get('host')!;
  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:9002';
  
  // Don't rewrite for the main app's public pages or dashboard
  if (host === appDomain) {
      return NextResponse.next();
  }
  
  const subdomain = host.replace(`.${appDomain}`, '');
  if (subdomain !== host) {
      return NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url));
  }

  return NextResponse.next();
}
