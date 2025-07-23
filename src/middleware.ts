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

  // Check for session cookie
  const sessionCookie = req.cookies.get('session');

  // If user is logged in, redirect from login/signup to dashboard.
  if (sessionCookie && (path === '/login' || path === '/signup')) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  
  // If user is NOT logged in and trying to access dashboard, redirect to login.
  if (!sessionCookie && path.startsWith('/dashboard')) {
      return NextResponse.redirect(new URL('/login', req.url));
  }

  // Get hostname of request (e.g. demo.vercel.pub, localhost:3000)
  const host = req.headers.get('host')!;

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:9002';

  // Don't rewrite requests to the root page, login, or signup on the main domain
  if (host === appDomain && (path === '/' || path === '/login' || path === '/signup')) {
    return NextResponse.next();
  }

  // rewrite everything else to `/[subdomain]/[path] domain
  const subdomain = host.replace(`.${appDomain}`, '');
  
  if (subdomain !== host) {
      return NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url));
  }

  return NextResponse.next();
}
