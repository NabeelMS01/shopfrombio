// middleware.ts
import { NextResponse, type NextRequest } from 'next/server';
export const config = { matcher: ['/:path*'] };

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  const host = (req.headers.get('host') || '').split(':')[0];
  // TEMP DEBUG
  console.log('[middleware] host=%s path=%s===========', host, path);

  // skip framework/assets/api

  if (path.startsWith('/_next') || path.startsWith('/api') || path.startsWith('/_static') || /\.[\w]+$/.test(path)) {
    return NextResponse.next();
  }

  const root = process.env.APP_ROOT_DOMAIN;
  if (root && host.endsWith(`.${root}`) && host !== root) {
    const sub = host.slice(0, -(root.length + 1));
    const rewrite = url.clone();
    rewrite.pathname = `/${sub}${path}`;
    return NextResponse.rewrite(rewrite);
  }

  if ((host.endsWith('.localhost') && host !== 'localhost') || (host.endsWith('.lvh.me') && host !== 'lvh.me')) {
    const sub = host.split('.')[0];
    const rewrite = url.clone();
    rewrite.pathname = `/${sub}${path}`;
    return NextResponse.rewrite(rewrite);
  }

  return NextResponse.next();
}
