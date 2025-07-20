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

  // Get hostname of request (e.g. demo.vercel.pub, localhost:3000)
  const host = req.headers.get('host')!;

  const appDomain = process.env.NEXT_PUBLIC_APP_DOMAIN || 'localhost:9002';

  // Get the pathname of the request (e.g. /, /about, /blog/first-post)
  const path = url.pathname;
  
  // Don't rewrite requests to the root page.
  if (host === appDomain && path === '/') {
    return NextResponse.next();
  }

  // rewrite everything else to `/[subdomain]/[path] domain
  const subdomain = host.replace(`.${appDomain}`, '');
  
  if (subdomain !== host) {
      return NextResponse.rewrite(new URL(`/${subdomain}${path}`, req.url));
  }

  return NextResponse.next();
}