import { config } from 'dotenv';
import { NextConfig } from 'next';

config({ path: './.env' });

const nextConfig:NextConfig = {
  allowedDevOrigins: [
    'http://lvh.me:3000',
    'http://caseplanet.lvh.me:3000',
    'http://localhost:3000',
    'http://caseplanet.localhost:3000',
  ],
  images: {
    remotePatterns: [
      { protocol: 'https', hostname: 'placehold.co', port: '', pathname: '/**' },
      { protocol: 'https', hostname: 'utfs.io', port: '', pathname: '/**' },
    ],
  },
  reactStrictMode: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },
};

export default nextConfig;