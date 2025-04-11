import type { NextConfig } from 'next';
import withNextIntl from 'next-intl/plugin';

const nextConfig: NextConfig = withNextIntl()({
  experimental: {
    optimizePackageImports: [
      '@radix-ui/react-*',
      '@vercel/analytics',
      '@vercel/speed-insights'
    ]
  },
  headers: async () => [
    {
      source: '/(.*)',
      headers: [
        { key: 'X-Frame-Options', value: 'DENY' },
        { key: 'X-Content-Type-Options', value: 'nosniff' },
        { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
        { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
      ]
    }
  ],
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
      },
      {
        protocol: 'https',
        hostname: 'mg-zon.vercel.app',
      }
    ],
    minimumCacheTTL: 86400,
    formats: ['image/webp'],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },
  redirects: async () => [
    {
      source: '/admin/:path*',
      destination: '/404',
      permanent: false
    },
    {
      source: '/wp-admin',
      destination: '/404',
      permanent: false
    }
  ],
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  compress: true,
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: false,
  }
});

export default nextConfig;
