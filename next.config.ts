// next.config.ts
import type { NextConfig } from 'next';
import withNextIntl from 'next-intl/plugin';

const securityHeaders = [
  // منع التضمين في iframes (حماية من Clickjacking)
  {
    key: 'X-Frame-Options',
    value: 'DENY',
  },
  // منع تخمين نوع المحتوى (حماية من MIME Sniffing)
  {
    key: 'X-Content-Type-Options',
    value: 'nosniff'
  },
  // سياسة أمان محتوى صارمة
  {
    key: 'Content-Security-Policy',
    value: `
      default-src 'self';
      script-src 'self' 'unsafe-inline' 'unsafe-eval' *.vercel-analytics.com;
      style-src 'self' 'unsafe-inline';
      img-src 'self' data: utfs.io;
      font-src 'self';
      connect-src 'self' *.vercel-analytics.com;
      form-action 'self';
      frame-ancestors 'none';
      base-uri 'self';
    `.replace(/\s+/g, ' ')
  },
  // إجبار HTTPS (HSTS)
  {
    key: 'Strict-Transport-Security',
    value: 'max-age=63072000; includeSubDomains; preload'
  },
  // منع التتبع
  {
    key: 'Permissions-Policy',
    value: 'camera=(), microphone=(), geolocation=(), interest-cohort=()'
  }
];

const nextConfig: NextConfig = {
  ...withNextIntl()({
    // ===== إعدادات الصور الآمنة =====
    images: {
      remotePatterns: [
        {
          protocol: 'https',
          hostname: 'utfs.io',
          port: '',
        },
      ],
      minimumCacheTTL: 86400,
      formats: ['image/webp'],
      dangerouslyAllowSVG: false,
    },

    // ===== تعزيزات الأمان =====
    headers: async () => [
      {
        source: '/:path*',
        headers: securityHeaders,
      },
      {
        source: '/admin/:path*',
        headers: [
          { key: 'X-Robots-Tag', value: 'noindex, nofollow' },
          ...securityHeaders
        ],
      },
    ],

    // ===== إعدادات التطوير =====
    poweredByHeader: false,
    reactStrictMode: true,
    productionBrowserSourceMaps: false,
    swcMinify: true,
    compress: true,

    // ===== حماية API =====
    async rewrites() {
      return [
        {
          source: '/api/admin/:path*',
          destination: '/404',
        }
      ]
    },

    // ===== Rate Limiting =====
    async redirects() {
      return [
        {
          source: '/wp-admin',
          destination: '/404',
          permanent: true,
        },
        {
          source: '/.env',
          destination: '/404',
          permanent: true,
        }
      ]
    }
  }),

  // ===== إعدادات خاصة بـ TypeScript =====
  typescript: {
    ignoreBuildErrors: false,
    tsconfigPath: './tsconfig.json',
  },

  // ===== إعدادات ESM =====
  experimental: {
    esmExternals: true,
    serverComponentsExternalPackages: ['mongoose'],
  }
};

export default nextConfig;
