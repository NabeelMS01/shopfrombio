import { type NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/:path*'],
};

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;

  // Normalize hostname (ignore port)
  const rawHost = req.headers.get('host') || '';
  const hostName = rawHost.split(':')[0];

  // DEV subdomain support: *.localhost and *.lvh.me
  const isDevSubdomain = (hostName.endsWith('.localhost') && hostName !== 'localhost') ||
                         (hostName.endsWith('.lvh.me') && hostName !== 'lvh.me');

  if (isDevSubdomain) {
    const sub = hostName.split('.')[0];

    // Skip framework/assets/api
    if (
      path.startsWith('/_next') ||
      path.startsWith('/api') ||
      path.startsWith('/_static') ||
      /\.[\w]+$/.test(path)
    ) {
      return NextResponse.next();
    }

    // Already routed under /{sub}
    if (path === `/${sub}` || path.startsWith(`/${sub}/`)) {
      return NextResponse.next();
    }

    // Rewrite to /{sub}{path}
    return NextResponse.rewrite(new URL(`/${sub}${path}`, req.url));
  }

  return NextResponse.next();
}
