import { type NextRequest, NextResponse } from 'next/server';

export const config = {
  matcher: ['/:path*'],
};

export default function middleware(req: NextRequest) {
  const hostName = (req.headers.get('host') || '').split(':')[0];
  const path = req.nextUrl.pathname;

  // PROD: *.shopfrombio.vercel.app → /[subdomain]
  const root = process.env.APP_ROOT_DOMAIN;
  if (root) {
    const isProdSub = hostName.endsWith(`.${root}`) && hostName !== root;
    if (isProdSub) {
      const sub = hostName.slice(0, -(root.length + 1));
      if (!path.startsWith(`/${sub}`)) {
        return NextResponse.rewrite(new URL(`/${sub}${path}`, req.url));
      }
    }
  }

  // DEV: *.localhost / *.lvh.me → /[subdomain]
  const isDevSub = (hostName.endsWith('.localhost') && hostName !== 'localhost')
                || (hostName.endsWith('.lvh.me') && hostName !== 'lvh.me');
  if (isDevSub) {
    const sub = hostName.split('.')[0];
    if (!path.startsWith(`/${sub}`)) {
      return NextResponse.rewrite(new URL(`/${sub}${path}`, req.url));
    }
  }

  return NextResponse.next();
}
