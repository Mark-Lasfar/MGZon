import { Geist, Geist_Mono } from 'next/font/google'
import '../globals.css'
import ClientProviders from '@/components/shared/client-providers'
import { getDirection } from '@/i18n-config'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { getSetting } from '@/lib/actions/setting.actions'
import { cookies } from 'next/headers'
import React from 'react'

// تحسين تحميل الخطوط مع display: swap
const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
})

export async function generateMetadata() {
  const {
    site: { slogan, name, description, url },
  } = await getSetting()

  return {
    title: {
      template: `%s | ${name}`,
      default: `${name} - ${slogan}`,
    },
    description,
    metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || url),
    openGraph: {
      title: `${name} - ${slogan}`,
      description,
      url: process.env.NEXT_PUBLIC_SITE_URL || url,
      siteName: name,
      images: [
        {
          url: process.env.NEXT_PUBLIC_OG_IMAGE_URL || `${url}/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: `${name} logo`,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${name} - ${slogan}`,
      description,
      images: [process.env.NEXT_PUBLIC_OG_IMAGE_URL || `${url}/og-image.jpg`],
    },
    keywords: ['MGZon', 'online shopping', 'Ibrahim Elasfar', 'ecommerce'],
  }
}

export default async function AppLayout({
  params,
  children,
}: {
  params: { locale: string }
  children: React.ReactNode
}) {
  const setting = await getSetting()
  const currency = cookies().get('currency')?.value || 'USD'
  const { locale } = params

  if (!routing.locales.includes(locale)) {
    notFound()
  }

  const messages = await getMessages()

  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: setting.site.name,
    url: process.env.NEXT_PUBLIC_SITE_URL || setting.site.url,
    logo: process.env.NEXT_PUBLIC_LOGO_URL || `${setting.site.url}/logo.png`,
    sameAs: [
      'https://facebook.com/mgzon',
      'https://twitter.com/mgzon',
    ],
    founder: {
      '@type': 'Person',
      name: 'Ibrahim Elasfar',
      image: process.env.NEXT_PUBLIC_FOUNDER_IMAGE_URL || `${setting.site.url}/founder.jpg`,
      jobTitle: 'Founder & CEO',
      description: 'Ibrahim Elasfar is the founder of MGZon and leads the platform to success.',
    },
    description: setting.site.description,
  }

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="google-site-verification" content={process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE} />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Open Graph Meta Tags */}
        <meta property="og:title" content={`${setting.site.name} - ${setting.site.slogan}`} />
        <meta property="og:description" content={setting.site.description} />
        <meta property="og:url" content={process.env.NEXT_PUBLIC_SITE_URL || setting.site.url} />
        <meta property="og:site_name" content={setting.site.name} />
        <meta property="og:image" content={process.env.NEXT_PUBLIC_OG_IMAGE_URL || `${setting.site.url}/og-image.jpg`} />
        <meta property="og:image:width" content="1200" />
        <meta property="og:image:height" content="630" />
        
        {/* Twitter Meta Tags */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={`${setting.site.name} - ${setting.site.slogan}`} />
        <meta name="twitter:description" content={setting.site.description} />
        <meta name="twitter:image" content={process.env.NEXT_PUBLIC_OG_IMAGE_URL || `${setting.site.url}/og-image.jpg`} />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders setting={{ ...setting, currency }}>
            {children}
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
