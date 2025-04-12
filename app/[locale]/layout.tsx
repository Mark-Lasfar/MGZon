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
import { Analytics } from '@vercel/analytics/react'
import { SpeedInsights } from '@vercel/speed-insights/next'
import Image from 'next/image'
import Script from 'next/script'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export async function generateMetadata() {
  const setting = await getSetting()
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || setting.site.url

  return {
    title: {
      template: `%s | ${setting.site.name}`,
      default: `${setting.site.name} - ${setting.site.slogan}`,
    },
    description: setting.site.description,
    metadataBase: new URL(baseUrl),
    alternates: { canonical: baseUrl },
    openGraph: {
      title: setting.site.name,
      description: setting.site.description,
      url: baseUrl,
      siteName: setting.site.name,
      images: [
        {
          url: `${baseUrl}/images/og-image.jpg`,
          width: 1200,
          height: 630,
          alt: setting.site.name,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: setting.site.name,
      description: setting.site.description,
      images: [`${baseUrl}/images/og-image.jpg`],
    },
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

  // بيانات المؤسس لإنشاء rich snippets
  const founderData = {
    name: "Ibrahim Elasfar",
    title: "Founder & CEO",
    image: "/images/ibrahim_elasfar.png",
    achievements: [
      { value: "$15M", label: "Q1 2024 Revenue" },
      { value: "300%", label: "YoY Growth" },
      { value: "1M+", label: "Customers" }
    ]
  }

  // بيانات مهيكلة (Structured Data) لتحسين SEO
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": setting.site.name,
    "url": process.env.NEXT_PUBLIC_SITE_URL || setting.site.url,
    "logo": `${process.env.NEXT_PUBLIC_SITE_URL || setting.site.url}/logo.svg`,
    "founder": {
      "@type": "Person",
      "name": founderData.name,
      "jobTitle": founderData.title
    },
    "foundingDate": "2020",
    "address": {
      "@type": "PostalAddress",
      "addressCountry": "US"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "1250",
      "bestRating": "5"
    }
  }

  return (
    <html
      lang={locale}
      dir={getDirection(locale)}
      suppressHydrationWarning
      className={`${geistSans.variable} ${geistMono.variable}`}
    >
      <head>
        {/* علامة إثبات ملكية Google */}
        <meta name="google-site-verification" content="PQo-i3w5jhSFT2MCdZxg0HnFOHDQ-iYMLNg8rYeFtXM" />
        <Script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders setting={{ ...setting, currency }}>
            {/* قسم إشارات الثقة */}
            <div className="bg-gradient-to-r from-blue-50 to-gray-50 py-8 border-b">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-8">
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-white shadow-lg">
                    <Image
                      src={founderData.image}
                      alt={founderData.name}
                      width={128}
                      height={128}
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold text-gray-900">{founderData.name}</h2>
                    <p className="text-lg text-blue-600 mb-4">{founderData.title}</p>
                    <div className="flex flex-wrap justify-center gap-4">
                      {founderData.achievements.map((item, index) => (
                        <div key={index} className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-100">
                          <p className="text-xl font-bold text-gray-900">{item.value}</p>
                          <p className="text-sm text-gray-500">{item.label}</p>
                        </div>
                      ))}
                      <div className="bg-white px-6 py-3 rounded-lg shadow-sm border border-gray-100">
                        <div className="flex items-center justify-center">
                          {[...Array(5)].map((_, i) => (
                            <StarIcon key={i} className="w-5 h-5 text-yellow-400" />
                          ))}
                        </div>
                        <p className="text-sm text-gray-500 mt-1">1,250+ Reviews</p>
                      </div>
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

function StarIcon({ className }: { className?: string }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill="currentColor"
      className={className}
    >
      <path
        fillRule="evenodd"
        d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.007 5.404.433c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.433 2.082-5.006z"
        clipRule="evenodd"
      />
    </svg>
  )
}
