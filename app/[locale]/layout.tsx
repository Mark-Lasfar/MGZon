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

// الخطوط - Fonts
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

// Metadata الأساسية
export async function generateMetadata() {
  const setting = await getSetting()
  const baseUrl = 'https://mg-zon.vercel.app' // استخدام رابط مباشر بدلًا من متغير البيئة

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
      images: [
        {
          url: `${baseUrl}/og-image.jpg`, // استخدام مسار مباشر
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
      title: `${setting.site.name} - ${setting.site.slogan}`,
      description: setting.site.description,
      images: [`${baseUrl}/og-image.jpg`], // استخدام مسار مباشر
    },
    keywords: ['MGZon', 'E-commerce', setting.site.name, 'Online Shopping'],
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

  // إنجازات المؤسس - Founder Achievements
  const founderData = {
    name: "Ibrahim Elasfar",
    title: "Founder & CEO",
    image: "/ibrahim_elasfar.jpg", // مسار مباشر من مجلد public
    achievements: [
      { value: "$15M", label: "Q1 2024 Revenue" },
      { value: "300%", label: "YoY Growth" },
      { value: "1M+", label: "Customers" }
    ]
  }

  // البيانات المنظمة - Structured Data
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: setting.site.name,
    url: "https://mg-zon.vercel.app",
    logo: {
      "@type": "ImageObject",
      url: "https://mg-zon.vercel.app/logo.svg",
      width: 512,
      height: 512,
    },
    founder: {
      "@type": "Person",
      name: founderData.name,
      jobTitle: founderData.title,
      description: `Founder who led ${setting.site.name} to $15M revenue in Q1 2024`,
      image: "https://mg-zon.vercel.app/ibrahim_elasfar.jpg",
      alumniOf: setting.site.name,
      award: "Forbes Middle East Top Entrepreneurs 2024"
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
        <meta charSet="utf-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <meta name="theme-color" content="#ffffff" />
        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* بيانات المؤسس - Founder Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen bg-white antialiased">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders setting={{ ...setting, currency }}>
            
            {/* قسم المؤسس - Founder Section */}
            <div className="founder-section bg-gray-50 py-8 border-b">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-6">
                  
                  {/* صورة المؤسس - Founder Image */}
                  <div className="relative w-32 h-32 rounded-full overflow-hidden border-4 border-yellow-500">
                    <Image
                      src={founderData.image}
                      alt={`${founderData.name}, ${founderData.title}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  
                  {/* معلومات المؤسس - Founder Info */}
                  <div className="text-center md:text-left">
                    <h2 className="text-2xl font-bold">{founderData.name}</h2>
                    <p className="text-gray-600">{founderData.title}</p>
                    
                    {/* الإنجازات - Achievements */}
                    <div className="flex flex-wrap gap-4 mt-4 justify-center md:justify-start">
                      {founderData.achievements.map((item, index) => (
                        <div key={index} className="bg-white px-4 py-2 rounded-lg shadow-sm border">
                          <div className="font-bold text-blue-600">{item.value}</div>
                          <div className="text-sm text-gray-500">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* المحتوى الرئيسي - Main Content */}
            {children}

            <Analytics />
            <SpeedInsights />
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  )
}
