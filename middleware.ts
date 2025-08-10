// middleware.ts
import { type NextRequest, NextResponse } from 'next/server';
export const config = { matcher: ['/:path'] };

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  const host = (req.headers.get('host') || '').split(':')[0];

  // TEMP DEBUG
  console.log('[middleware] host=%s path=%s=====', host, path);

  // skip framework/assets/api
  if (path.startsWith('/_next') || path.startsWith('/api') || path.startsWith('/_static') || /\.[\w]+$/.test(path)) {
    console.log('[middleware] skip assets/api');
    return NextResponse.next();
  }

  // PROD: *.APP_ROOT_DOMAIN → /:sub/:path*
  const root = process.env.APP_ROOT_DOMAIN; // e.g. 'shopfrombio.com'
  if (root && host.endsWith(`.${root}`) && host !== root) {
    const sub = host.slice(0, -(root.length + 1));
    const rewrite = url.clone();
    rewrite.pathname = `/${sub}${path}`;
    console.log('[middleware] prod rewrite', { host, sub, from: path, to: rewrite.pathname });
    return NextResponse.rewrite(rewrite);
  }

  // DEV: *.localhost / *.lvh.me → /:sub/:path*
  const isDev = (host.endsWith('.localhost') && host !== 'localhost') || (host.endsWith('.lvh.me') && host !== 'lvh.me');
  if (isDev) {
    const sub = host.split('.')[0];
    const rewrite = url.clone();
    rewrite.pathname = `/${sub}${path}`;
    console.log('[middleware] dev rewrite', { host, sub, from: path, to: rewrite.pathname });
    return NextResponse.rewrite(rewrite);
  }

  console.log('[middleware] passthrough');
  return NextResponse.next();
}
