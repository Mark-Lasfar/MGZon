# 06-create-home-cards

1. npx shadcn@latest add card
2. components/shared/home/home-card.tsx

   ```tsx
   import Image from 'next/image'
   import Link from 'next/link'
   import React from 'react'
   import { Card, CardContent, CardFooter } from '@/components/ui/card'

   type CardItem = {
     title: string
     link: { text: string; href: string }
     items: {
       name: string
       items?: string[]
       image: string
       href: string
     }[]
   }

   export function HomeCard({ cards }: { cards: CardItem[] }) {
     return (
       <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 md:gap-4'>
         {cards.map((card) => (
           <Card key={card.title} className='rounded-none flex flex-col'>
             <CardContent className='p-4 flex-1'>
               <h3 className='text-xl font-bold mb-4'>{card.title}</h3>
               <div className='grid grid-cols-2 gap-4'>
                 {card.items.map((item) => (
                   <Link
                     key={item.name}
                     href={item.href}
                     className='flex flex-col'
                   >
                     <Image
                       src={item.image}
                       alt={item.name}
                       className='aspect-square object-scale-down max-w-full h-auto mx-auto'
                       height={120}
                       width={120}
                     />
                     <p className='text-center text-sm whitespace-nowrap overflow-hidden text-ellipsis'>
                       {item.name}
                     </p>
                   </Link>
                 ))}
               </div>
             </CardContent>
             {card.link && (
               <CardFooter>
                 <Link href={card.link.href} className='mt-4 block'>
                   {card.link.text}
                 </Link>
               </CardFooter>
             )}
           </Card>
         ))}
       </div>
     )
   }
   ```

3. lib/actions/product.actions.ts

   ```ts
   'use server'

   import { connectToDatabase } from '@/lib/db'
   import Product from '@/lib/db/models/product.model'

   export async function getAllCategories() {
     await connectToDatabase()
     const categories = await Product.find({ isPublished: true }).distinct(
       'category'
     )
     return categories
   }
   export async function getProductsForCard({
     tag,
     limit = 4,
   }: {
     tag: string
     limit?: number
   }) {
     await connectToDatabase()
     const products = await Product.find(
       { tags: { $in: [tag] }, isPublished: true },
       {
         name: 1,
         href: { $concat: ['/product/', '$slug'] },
         image: { $arrayElemAt: ['$images', 0] },
       }
     )
       .sort({ createdAt: 'desc' })
       .limit(limit)
     return JSON.parse(JSON.stringify(products)) as {
       name: string
       href: string
       image: string
     }[]
   }
   ```

4. app/(home)/page.tsx

   ```tsx
   import { HomeCard } from '@/components/shared/home/home-card'
   import { HomeCarousel } from '@/components/shared/home/home-carousel'
   import { Card, CardContent } from '@/components/ui/card'

   export default async function HomePage() {
     const categories = (await getAllCategories()).slice(0, 4)
     const newArrivals = await getProductsForCard({
       tag: 'new-arrival',
       limit: 4,
     })
     const featureds = await getProductsForCard({
       tag: 'featured',
       limit: 4,
     })
     const bestSellers = await getProductsForCard({
       tag: 'best-seller',
       limit: 4,
     })
     const cards = [
       {
         title: 'Categories to explore',
         link: {
           text: 'See More',
           href: '/search',
         },
         items: categories.map((category) => ({
           name: category,
           image: `/images/${toSlug(category)}.jpg`,
           href: `/search?category=${category}`,
         })),
       },
       {
         title: 'Explore New Arrivals',
         items: newArrivals,
         link: {
           text: 'View All',
           href: '/search?tag=new-arrival',
         },
       },
       {
         title: 'Discover Best Sellers',
         items: bestSellers,
         link: {
           text: 'View All',
           href: '/search?tag=new-arrival',
         },
       },
       {
         title: 'Featured Products',
         items: featureds,
         link: {
           text: 'Shop Now',
           href: '/search?tag=new-arrival',
         },
       },
     ]

     return (
       <>
         <HomeCarousel items={carousels} />
         <div className='md:p-4 md:space-y-4 bg-border'>
           <HomeCard cards={cards} />
         </div>
       </>
     )
   }
   ```

5. commit changes and push to GitHub
6. go to https://nextjs-amazona.vercel.app
