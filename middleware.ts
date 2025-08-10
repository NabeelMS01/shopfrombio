import { type NextRequest, NextResponse } from 'next/server';

export const config = { matcher: ['/:path*'] };

export default function middleware(req: NextRequest) {
  const url = req.nextUrl;
  const path = url.pathname;
  const host = (req.headers.get('host') || '').split(':')[0];

  // Skip framework/assets/api
  if (
    path.startsWith('/_next') ||
    path.startsWith('/api') ||
    path.startsWith('/_static') ||
    /\.[\w]+$/.test(path)
  ) {
    return NextResponse.next();
  }

  // PROD: *.APP_ROOT_DOMAIN → /[subdomain]
  const root = process.env.APP_ROOT_DOMAIN; // e.g., 'shopfrombio.com'

  console.log(root,'====================root');
  if (root && host.endsWith(`.${root}`) && host !== root) {
    const sub = host.slice(0, -(root.length + 1));
    if (!path.startsWith(`/${sub}`)) {
      return NextResponse.rewrite(new URL(`/${sub}${path}`, req.url));
    }
    return NextResponse.next();
  }

  // DEV: *.localhost / *.lvh.me → /[subdomain]
  const isDevSub = (host.endsWith('.localhost') && host !== 'localhost') ||
                   (host.endsWith('.lvh.me') && host !== 'lvh.me');
  if (isDevSub) {
    const sub = host.split('.')[0];
    if (!path.startsWith(`/${sub}`)) {
      return NextResponse.rewrite(new URL(`/${sub}${path}`, req.url));
    }
  }

  return NextResponse.next();
}
