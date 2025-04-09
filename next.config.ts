import type { NextConfig } from 'next'
import withNextIntl from 'next-intl/plugin'

const securityHeaders = [
  { key: 'X-Frame-Options', value: 'DENY' },
  { key: 'X-Content-Type-Options', value: 'nosniff' },
  { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
  { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
  { key: 'Strict-Transport-Security', value: 'max-age=63072000; includeSubDomains; preload' }
]

const nextConfig: NextConfig = withNextIntl()({
  // Security Headers
  headers: async () => [
    {
      source: '/(.*)',
      headers: securityHeaders
    }
  ],

  // Image Optimization
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io'
      },
      {
        protocol: 'https',
        hostname: 'mg-zon.vercel.app'
      }
    ],
    minimumCacheTTL: 86400,
    formats: ['image/webp'],
    dangerouslyAllowSVG: false,
    contentSecurityPolicy: "default-src 'self'; script-src 'none'; sandbox;"
  },

  // Routing
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

  // Performance
  output: 'standalone',
  poweredByHeader: false,
  reactStrictMode: true,
  swcMinify: true,
  productionBrowserSourceMaps: false,
  compress: true,

  // Build Settings
  eslint: {
    ignoreDuringBuilds: true
  },
  typescript: {
    ignoreBuildErrors: false
  },

  // API Routing
  rewrites: async () => [
    {
      source: '/api/:path*',
      destination: `${process.env.API_BASE_URL || 'https://mg-zon.vercel.app'}/api/:path*`
    }
  ],

  // Internationalization
  i18n: {
    locales: ['en', 'ar'],
    defaultLocale: 'en',
    localeDetection: true
  },

  // Webpack Optimizations
  webpack: (config) => {
    config.resolve.fallback = { fs: false, net: false, tls: false }
    return config
  }
})

export default nextConfig
