import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import ClientProviders from '@/components/shared/client-providers'
import { getDirection } from '@/i18n-config'
import { NextIntlClientProvider } from 'next-intl'
import { getMessages } from 'next-intl/server'
import { routing } from '@/i18n/routing'
import { notFound } from 'next/navigation'
import { getSetting } from '@/lib/actions/setting.actions'
import { cookies } from 'next/headers'
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Image from 'next/image'
import React from 'react'

// Font Configuration
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
  const setting = await getSetting()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://mg-zon.vercel.app'

  return {
    title: {
      template: `%s | ${setting.site.name}`,
      default: `${setting.site.name} - ${setting.site.slogan}`,
    },
    description: setting.site.description,
    metadataBase: new URL(baseUrl),
    openGraph: {
      title: `${setting.site.name} - ${setting.site.slogan}`,
      description: setting.site.description,
      url: baseUrl,
      siteName: setting.site.name,
      images: [{
        url: `${baseUrl}/og-image.jpg`,
        width: 1200,
        height: 630,
        alt: setting.site.name,
      }],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${setting.site.name} - ${setting.site.slogan}`,
      description: setting.site.description,
      images: [`${baseUrl}/og-image.jpg`],
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_VERIFICATION_CODE,
    }
  }
}

export default async function RootLayout({
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

  // Founder Data
  const founderData = {
    name: "Ibrahim Elasfar",
    title: "Founder & CEO",
    image: "/images/ibrahim_elasfar.jpg",
    achievements: [
      { value: "$15M", label: "Q1 2024 Revenue" },
      { value: "300%", label: "YoY Growth" },
      { value: "1M+", label: "Customers" }
    ]
  }

  // Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: setting.site.name,
    url: process.env.NEXT_PUBLIC_SITE_URL || "https://mg-zon.vercel.app",
    logo: `${process.env.NEXT_PUBLIC_SITE_URL || "https://mg-zon.vercel.app"}/logo.svg`,
    founder: {
      "@type": "Person",
      name: founderData.name,
      jobTitle: founderData.title,
      description: "Serial entrepreneur who scaled MGZon to $15M revenue in Q1 2024",
      image: `${process.env.NEXT_PUBLIC_SITE_URL || "https://mg-zon.vercel.app"}${founderData.image}`,
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen bg-background antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders setting={{ ...setting, currency }}>
            
            {/* Founder Section */}
            <div className="founder-banner bg-white shadow-sm">
              <div className="container mx-auto px-4 py-8">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-500">
                    <Image
                      src={founderData.image}
                      alt={`${founderData.name}, ${founderData.title}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="flex-1 text-center md:text-left">
                    <h2 className="text-3xl font-bold">{founderData.name}</h2>
                    <p className="text-xl text-gray-600 mb-4">{founderData.title}</p>
                    <div className="grid grid-cols-3 gap-4 max-w-2xl">
                      {founderData.achievements.map((item, index) => (
                        <div key={index} className="bg-gray-50 p-4 rounded-lg border border-gray-200">
                          <div className="text-2xl font-bold text-blue-600">{item.value}</div>
                          <div className="text-sm text-gray-500">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {children}
            <Analytics />
            <SpeedInsights />
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
