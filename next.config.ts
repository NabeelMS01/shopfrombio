import { config } from 'dotenv';

config({ path: './.env' });

const escapeHost = (host: string) => host.replace(/\./g, '\\.');

const nextConfig = {
  experimental: {
    allowedDevOrigins: [
      // Explicit examples for local dev; adjust as needed
      'http://caseplanet.localhost:3000',
      'http://caseplanet.lvh.me:3000',
    ],
  },
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'utfs.io', port: '', pathname: '/**' },
    ],
  },
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
  async rewrites() {
    const rules: any[] = [];

    // Production wildcard based on APP_ROOT_DOMAIN (e.g., shopfrombio.com)
    const root = process.env.APP_ROOT_DOMAIN;
    if (root) {
      rules.push({
        source: '/:path*',
        has: [
          { type: 'host', value: `(?<subdomain>[^.]+)\.${escapeHost(root)}` },
        ],
        destination: '/:subdomain/:path*',
      });
    }

    // Dev: *.localhost
    rules.push({
      source: '/:path*',
      has: [{ type: 'host', value: '(?<subdomain>[^.]+)\.localhost' }],
      destination: '/:subdomain/:path*',
    });

    // Dev: *.lvh.me
    rules.push({
      source: '/:path*',
      has: [{ type: 'host', value: '(?<subdomain>[^.]+)\.lvh\.me' }],
      destination: '/:subdomain/:path*',
    });

    return rules;
  },
};

export default nextConfig;
