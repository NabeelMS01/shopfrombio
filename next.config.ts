import type { NextConfig } from "next"
import { config as loadEnv } from "dotenv"

// Optional: Next already loads .env.* files, but if you need a custom path:
loadEnv({ path: "./.env" })

const escapeHost = (host: string) => host.replace(/\./g, "\\.")

const nextConfig: NextConfig = {
  // Move out of `experimental` — must be top-level.
  // Use hostnames (supports wildcards), not protocol/port.
  allowedDevOrigins: [
    "lvh.me",
    "localhost",
    "127.0.0.1",
    "*.localhost",
    "*.lvh.me",
    "caseplanet.localhost",
    'http://caseplanet.lvh.me:3000',
    'http://caseplanet.localhost:3000',
  ],

  images: {
    remotePatterns: [
      { protocol: "https", hostname: "placehold.co", port: "", pathname: "/**" },
      { protocol: "https", hostname: "utfs.io", port: "", pathname: "/**" },
    ],
  },

  reactStrictMode: false,
  typescript: { ignoreBuildErrors: true },
  eslint: { ignoreDuringBuilds: true },

  async rewrites() {
    const rules: any[] = []

    // Production wildcard based on APP_ROOT_DOMAIN (e.g., shopfrombio.com)
    const root = process.env.APP_ROOT_DOMAIN
    if (root) {
      rules.push({
        source: "/:path*",
        has: [{ type: "host", value: `(?<subdomain>[^.]+)\\.${escapeHost(root)}` }],
        destination: "/:subdomain/:path*",
      })
    }

    // Dev: *.localhost (allow any port)
    rules.push({
      source: "/:path*",
      has: [{ type: "host", value: "(?<subdomain>[^.]+)\\.localhost(:\\d+)?" }],
      destination: "/:subdomain/:path*",
    })

    // Dev: *.lvh.me (allow any port)
    rules.push({
      source: "/:path*",
      has: [{ type: "host", value: "(?<subdomain>[^.]+)\\.lvh\\.me(:\\d+)?" }],
      destination: "/:subdomain/:path*",
    })

    return rules
  },
}

export default nextConfig