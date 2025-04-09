// app/sitemap.ts
import { getAllProducts } from '@/lib/actions/product.actions'
import { getAllPages } from '@/lib/actions/web-page.actions'
import { getSetting } from '@/lib/actions/setting.actions'
import { getAllCategories } from '@/lib/actions/product.actions'
import { MetadataRoute } from 'next'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://mg-zon.vercel.app'
  const currentDate = new Date()
  const staticPages: MetadataRoute.Sitemap = []
  
  try {
    // 1. Fetching the basic data in parallel
    const [setting, products, pages, categories] = await Promise.all([
      getSetting(),
      getAllProducts({ query: 'all', page: 1, category: 'all', tag: 'all' }),
      getAllPages(),
      getAllCategories()
    ])

    // 2. Static basic pages
    staticPages.push(
      {
        url: baseUrl,
        lastModified: currentDate,
        changeFrequency: 'daily' as const,
        priority: 1.0,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: currentDate,
        changeFrequency: 'weekly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/contact`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.6,
      }
    )

    // 3. Founder page (highlighted)
    staticPages.push({
      url: `${baseUrl}/founder`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.9,
      alternates: {
        languages: {
          en: `${baseUrl}/en/founder`,
          ar: `${baseUrl}/ar/founder`,
        },
      },
    })

    // 4. Products
    const productPages = products.products.map(product => ({
      url: `${baseUrl}/product/${product.slug}`,
      lastModified: new Date(product.updatedAt || currentDate),
      changeFrequency: 'weekly' as const,
      priority: 0.7,
    }))

    // 5. Categories
    const categoryPages = categories.map(category => ({
      url: `${baseUrl}/category/${category}`,
      lastModified: currentDate,
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // 6. Dynamic pages
    const dynamicPages = pages.map(page => ({
      url: `${baseUrl}/page/${page.slug}`,
      lastModified: new Date(page.updatedAt || currentDate),
      changeFrequency: 'weekly' as const,
      priority: 0.6,
    }))

    // 7. Achievement pages (including the $15M revenue achievement)
    const achievementPages: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/achievements/15m-revenue`,
        lastModified: new Date('2024-04-01'),
        changeFrequency: 'yearly',
        priority: 0.9,
        alternates: {
          languages: {
            en: `${baseUrl}/en/achievements/15m-revenue`,
            ar: `${baseUrl}/ar/achievements/15m-revenue`,
          },
        },
      },
      {
        url: `${baseUrl}/achievements`,
        lastModified: currentDate,
        changeFrequency: 'monthly',
        priority: 0.8,
      }
    ]

    // 8. Important policy pages
    const policyPages: MetadataRoute.Sitemap = [
      {
        url: `${baseUrl}/privacy`,
        lastModified: currentDate,
        changeFrequency: 'yearly',
        priority: 0.3,
      },
      {
        url: `${baseUrl}/terms`,
        lastModified: currentDate,
        changeFrequency: 'yearly',
        priority: 0.3,
      }
    ]

    // 9. Merging all pages with the date for each page
    return [
      ...staticPages,
      ...productPages,
      ...categoryPages,
      ...dynamicPages,
      ...achievementPages,
      ...policyPages,
    ]

  } catch (error) {
    console.error('❌ Failed to generate sitemap:', error)
    
    // 10. Fallback in case of failure
    return [
      {
        url: baseUrl,
        lastModified: currentDate,
        priority: 1.0,
      },
      ...staticPages, // Include static pages even if other data fetching fails
    ]
  }
}
