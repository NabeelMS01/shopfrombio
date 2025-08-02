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
  const appDomain = process.env.APP_DOMAIN || 'localhost:9002';
  
  // Don't rewrite requests for the main app domain, dashboard, or auth pages.
  // This check is important to prevent rewrite loops and incorrect path handling.
  if (host === appDomain || path.startsWith('/dashboard') || path === '/login' || path === '/signup') {
    return NextResponse.next();
  }

  // Check if it's a subdomain and rewrite
  // This ensures that `mystore.localhost:9002` becomes `/mystore`
  if (host.endsWith(appDomain)) {
      const subdomain = host.replace(`.${appDomain}`, '');
      return NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url));
  }

  return NextResponse.next();
}
