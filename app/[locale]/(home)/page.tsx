import { getTranslations } from '@/lib/utils/getTranslations'
import { getSetting } from '@/lib/utils/getSetting'
import { getProductsByTag } from '@/lib/utils/getProducts'
import { getAllCategories } from '@/lib/utils/getCategories'
import { getProductsForCard } from '@/lib/utils/getProductsForCard'
import { toSlug } from '@/lib/utils/toSlug'
import HomeCarousel from '@/components/HomeCarousel'
import HomeCard from '@/components/HomeCard'
import ProductSlider from '@/components/ProductSlider'
import Card from '@/components/Card'
import CardContent from '@/components/CardContent'
import BrowsingHistoryList from '@/components/BrowsingHistoryList'

export default async function HomePage() {
  // Get translations for the Home page
  const t = await getTranslations('Home')
  // Get carousel items from the settings
  const { carousels } = await getSetting()
  // Fetch products by tags for Today's Deals and Best Selling Products
  const todaysDeals = await getProductsByTag({ tag: 'todays-deal' })
  const bestSellingProducts = await getProductsByTag({ tag: 'best-seller' })
  
  // Fetch categories and limit to 4
  const categories = (await getAllCategories()).slice(0, 4)
  
  // Fetch products for New Arrivals, Featured, and Best Sellers
  const newArrivals = await getProductsForCard({
    tag: 'new-arrival',
  })
  const featureds = await getProductsForCard({
    tag: 'featured',
  })
  const bestSellers = await getProductsForCard({
    tag: 'best-seller',
  })

  // Create cards for rendering
  const cards = [
    {
      title: t('Categories to explore'),
      link: {
        text: t('See More'),
        href: '/search',
      },
      items: categories.map((category) => ({
        name: category,
        // Check if the image is a local file or an external URL
        image: category.images && category.images[0]?.startsWith('http')
          ? category.images[0] // Use the external URL if available
          : `/images/${toSlug(category.name)}.jpg`, // Use the local path if the image is stored locally
        href: `/search?category=${category}`,
      })),
    },
    {
      title: t('Explore New Arrivals'),
      items: newArrivals,
      link: {
        text: t('View All'),
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: t('Discover Best Sellers'),
      items: bestSellers,
      link: {
        text: t('View All'),
        href: '/search?tag=new-arrival',
      },
    },
    {
      title: t('Featured Products'),
      items: featureds,
      link: {
        text: t('Shop Now'),
        href: '/search?tag=new-arrival',
      },
    },
  ]

  return (
    <>
      <HomeCarousel items={carousels} />
      <div className='md:p-4 md:space-y-4 bg-border'>
        <HomeCard cards={cards} />
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            <ProductSlider title={t("Today's Deals")} products={todaysDeals} />
          </CardContent>
        </Card>
        <Card className='w-full rounded-none'>
          <CardContent className='p-4 items-center gap-3'>
            <ProductSlider
              title={t('Best Selling Products')}
              products={bestSellingProducts}
              hideDetails
            />
          </CardContent>
        </Card>
      </div>

      <div className='p-4 bg-background'>
        <BrowsingHistoryList />
      </div>
    </>
  )
}
