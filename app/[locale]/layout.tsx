import { Geist, Geist_Mono } from 'next/font/google';
import './globals.css';
import ClientProviders from '@/components/shared/client-providers';
import { getDirection } from '@/i18n-config';
import { NextIntlClientProvider } from 'next-intl';
import { getMessages } from 'next-intl/server';
import { routing } from '@/i18n/routing';
import { notFound } from 'next/navigation';
import { getSetting } from '@/lib/actions/setting.actions';
import { cookies } from 'next/headers';
import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/next';
import Image from 'next/image';

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
  display: 'swap',
});

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
  display: 'swap',
});

export async function generateMetadata() {
  const setting = await getSetting();
  const baseUrl = 'https://mg-zon.vercel.app';

  return {
    title: {
      template: `%s | ${setting.site.name}`,
      default: `${setting.site.name} - ${setting.site.slogan}`,
    },
    description: setting.site.description,
    metadataBase: new URL(baseUrl),
    alternates: {
      canonical: baseUrl,
    },
    openGraph: {
      title: `${setting.site.name} - ${setting.site.slogan}`,
      description: setting.site.description,
      url: baseUrl,
      siteName: setting.site.name,
      images: [
        {
          url: `${baseUrl}/og-image.jpg`,
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
      images: [`${baseUrl}/og-image.jpg`],
    },
    robots: {
      index: true,
      follow: true,
      nocache: false,
      googleBot: {
        index: true,
        follow: true,
        noimageindex: false,
      },
    },
  };
}

export default async function RootLayout({
  params,
  children,
}: {
  params: { locale: string };
  children: React.ReactNode;
}) {
  const setting = await getSetting();
  const currency = cookies().get('currency')?.value || 'USD';
  const { locale } = params;

  if (!routing.locales.includes(locale)) {
    notFound();
  }

  const messages = await getMessages();

  // Founder Data with $15M Revenue Highlight
  const founderData = {
    name: "Ibrahim Elasfar",
    title: "Founder & CEO",
    image: "/images/ibrahim_elasfar.jpg",
    achievements: [
      { 
        value: "$15M", 
        label: "Q1 2024 Revenue",
        description: "Achieved in first quarter of 2024" 
      },
      { 
        value: "300%", 
        label: "YoY Growth",
        description: "Year-over-year growth rate" 
      },
      { 
        value: "1M+", 
        label: "Customers",
        description: "Active customer base" 
      }
    ]
  };

  // Structured Data for SEO
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
      description: "Led company to $15M revenue in Q1 2024",
      image: "https://mg-zon.vercel.app/images/ibrahim_elasfar.jpg",
      alumniOf: setting.site.name,
      award: "Forbes Middle East Top Entrepreneurs 2024"
    },
    description: setting.site.description,
  };

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
        <meta name="google-site-verification" content="PQo-i3w5jhSFT2MCdZxg0HnFOHDQ-iYMLNg8rYeFtXM" />        
        {/* Favicon */}
        <link rel="icon" href="/favicon.ico" sizes="any" />
        <link rel="icon" href="/icon.svg" type="image/svg+xml" />
        <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
        
        {/* Structured Data */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen bg-background text-foreground">
        <NextIntlClientProvider locale={locale} messages={messages}>
          <ClientProviders setting={{ ...setting, currency }}>
            
            {/* Founder Section with $15M Revenue */}
            <header className="founder-section bg-gradient-to-r from-primary/5 to-secondary/5 py-8 border-b">
              <div className="container mx-auto px-4">
                <div className="flex flex-col md:flex-row items-center gap-6 md:gap-10">
                  <div className="relative w-40 h-40 rounded-full overflow-hidden border-4 border-yellow-500 shadow-lg">
                    <Image
                      src={founderData.image}
                      alt={`${founderData.name}, ${founderData.title}`}
                      fill
                      className="object-cover"
                      priority
                    />
                  </div>
                  <div className="text-center md:text-left">
                    <h1 className="text-3xl font-bold">{founderData.name}</h1>
                    <p className="text-lg text-muted-foreground mb-4">{founderData.title}</p>
                    <div className="grid grid-cols-3 gap-4 max-w-2xl">
                      {founderData.achievements.map((item, index) => (
                        <div key={index} className="bg-background p-3 rounded-lg border shadow-sm">
                          <div className="text-2xl font-bold text-primary">{item.value}</div>
                          <div className="text-sm text-muted-foreground">{item.label}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </header>

            {/* Main Content */}
            <main className="container mx-auto px-4 py-8">
              {children}
            </main>

            <Analytics />
            <SpeedInsights />
          </ClientProviders>
        </NextIntlClientProvider>
      </body>
    </html>
  );
}
