# 04-create-home-page-carousel

1. save banner1.jpg, banner2.jpg and banner3.jpg in /public/images folder
2. data.ts

   ```ts
   const data = {
     carousels: [
       {
         title: 'Most Popular Shoes For Sale',
         buttonCaption: 'Shop Now',
         image: '/images/banner3.jpg',
         url: '/search?category=Shoes',
         isPublished: true,
       },
       {
         title: 'Best Sellers in T-Shirts',
         buttonCaption: 'Shop Now',
         image: '/images/banner1.jpg',
         url: '/search?category=T-Shirts',
         isPublished: true,
       },
       {
         title: 'Best Deals on Wrist Watches',
         buttonCaption: 'See More',
         image: '/images/banner2.jpg',
         url: '/search?category=Wrist Watches',
         isPublished: true,
       },
     ],
   }
   ```

3. npx shadcn@latest add carousel
4. npm i embla-carousel-autoplay
5. components/shared/home/home-carousel.tsx

   ```tsx
   'use client'

   import * as React from 'react'
   import Image from 'next/image'
   import Autoplay from 'embla-carousel-autoplay'
   import {
     Carousel,
     CarouselContent,
     CarouselItem,
     CarouselNext,
     CarouselPrevious,
   } from '@/components/ui/carousel'
   import Link from 'next/link'
   import { Button } from '@/components/ui/button'

   export function HomeCarousel({
     items,
   }: {
     items: {
       image: string
       url: string
       title: string
       buttonCaption: string
     }[]
   }) {
     const plugin = React.useRef(
       Autoplay({ delay: 3000, stopOnInteraction: true })
     )

     return (
       <Carousel
         dir='ltr'
         plugins={[plugin.current]}
         className='w-full mx-auto '
         onMouseEnter={plugin.current.stop}
         onMouseLeave={plugin.current.reset}
       >
         <CarouselContent>
           {items.map((item) => (
             <CarouselItem key={item.title}>
               <Link href={item.url}>
                 <div className='flex aspect-[16/6] items-center justify-center p-6 relative -m-1'>
                   <Image
                     src={item.image}
                     alt={item.title}
                     fill
                     className='object-cover'
                     priority
                   />
                   <div className='absolute w-1/3 left-16 md:left-32 top-1/2 transform -translate-y-1/2'>
                     <h2 className='text-xl md:text-6xl font-bold mb-4 text-primary'>
                       {item.title}
                     </h2>
                     <Button className='hidden md:block'>
                       {item.buttonCaption}
                     </Button>
                   </div>
                 </div>
               </Link>
             </CarouselItem>
           ))}
         </CarouselContent>
         <CarouselPrevious className='left-0 md:left-12' />
         <CarouselNext className='right-0 md:right-12' />
       </Carousel>
     )
   }
   ```

6. app/(home)/page.tsx

   ```tsx
   import { HomeCarousel } from '@/components/shared/home/home-carousel'
   import data from '@/lib/data'

   export default async function Page() {
     return <HomeCarousel items={data.carousels} />
   }
   ```

7. commit changes and push to GitHub
8. go to https://nextjs-amazona.vercel.app
