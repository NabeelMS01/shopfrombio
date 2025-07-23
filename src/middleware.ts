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

// Function to get the main domain from a hostname
function getDomain(host: string) {
    // Split the host by dots
    const parts = host.split('.');
    
    // For local development like 'localhost:9002', return the full host
    if (parts.length <= 1 || parts[parts.length-1] === 'localhost') {
        return host;
    }
    
    // For production domains like 'sub.example.com', return 'example.com'
    // This assumes a standard TLD like .com, .org, etc.
    if (parts.length > 2) {
        return parts.slice(-2).join('.');
    }
    
    return host;
}


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
  const appDomain = getDomain(host);
  
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
