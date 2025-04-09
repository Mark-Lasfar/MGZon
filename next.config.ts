// next.config.ts
import type { NextConfig } from 'next'
import withNextIntl from 'next-intl/plugin'

const nextConfig: NextConfig = {
  // ===== الأساسيات =====
  reactStrictMode: true,
  poweredByHeader: false,
  generateEtags: false,

  // ===== الأمان =====
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

  // ===== الصور =====
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
        pathname: '/**',
      },
    ],
    minimumCacheTTL: 86400,
    formats: ['image/webp'],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;",
  },

  // ===== المسارات =====
  rewrites: async () => [
    { source: '/admin/:path*', destination: '/404' },
    { source: '/wp-admin', destination: '/404' },
    { source: '/.env', destination: '/404' }
  ],

  // ===== الأداء =====
  swcMinify: true,
  compress: true,
  optimizeFonts: true,

  // ===== التخزين المؤقت =====
  caching: {
    handler: 'Cache-Control',
    maxAge: 31536000,
    staleWhileRevalidate: 86400
  }
}

export default withNextIntl(nextConfig)
