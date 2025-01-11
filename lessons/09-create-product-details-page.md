# 09-create-product-details-page

1. npm i react-medium-image-zoom
2. npx shadcn@latest add separator
3. lib/constants.ts

   ```ts
   export const PAGE_SIZE = Number(process.env.PAGE_SIZE || 9)
   ```

4. lib/actions/product.actions.ts

   ```ts
   // GET ONE PRODUCT BY SLUG
   export async function getProductBySlug(slug: string) {
     await connectToDatabase()
     const product = await Product.findOne({ slug, isPublished: true })
     if (!product) throw new Error('Product not found')
     return JSON.parse(JSON.stringify(product)) as IProduct
   }
   // GET RELATED PRODUCTS: PRODUCTS WITH SAME CATEGORY
   export async function getRelatedProductsByCategory({
     category,
     productId,
     limit = PAGE_SIZE,
     page = 1,
   }: {
     category: string
     productId: string
     limit?: number
     page: number
   }) {
     await connectToDatabase()
     const skipAmount = (Number(page) - 1) * limit
     const conditions = {
       isPublished: true,
       category,
       _id: { $ne: productId },
     }
     const products = await Product.find(conditions)
       .sort({ numSales: 'desc' })
       .skip(skipAmount)
       .limit(limit)
     const productsCount = await Product.countDocuments(conditions)
     return {
       data: JSON.parse(JSON.stringify(products)) as IProduct[],
       totalPages: Math.ceil(productsCount / limit),
     }
   }
   ```

5. components/shared/product/product-gallery.tsx

   ```tsx
   'use client'

   import { useState } from 'react'
   import Image from 'next/image'
   import Zoom from 'react-medium-image-zoom'
   import 'react-medium-image-zoom/dist/styles.css'
   export default function ProductGallery({ images }: { images: string[] }) {
     const [selectedImage, setSelectedImage] = useState(0)
     return (
       <div className='flex gap-2'>
         <div className='flex flex-col gap-2 mt-8'>
           {images.map((image, index) => (
             <button
               key={index}
               onClick={() => {
                 setSelectedImage(index)
               }}
               onMouseOver={() => {
                 setSelectedImage(index)
               }}
               className={`bg-white rounded-lg overflow-hidden ${
                 selectedImage === index
                   ? 'ring-2 ring-blue-500'
                   : 'ring-1 ring-gray-300'
               }`}
             >
               <Image
                 src={image}
                 alt={'product image'}
                 width={48}
                 height={48}
               />
             </button>
           ))}
         </div>

         <div className='w-full'>
           <Zoom>
             <div className='relative h-[500px]'>
               <Image
                 src={images[selectedImage]}
                 alt={'product image'}
                 fill
                 sizes='90vw'
                 className='object-contain'
                 priority
               />
             </div>
           </Zoom>
         </div>
       </div>
     )
   }
   ```

6. components/shared/product/select-variant.tsx

   ```tsx
   import { Button } from '@/components/ui/button'
   import { IProduct } from '@/lib/db/models/product.model'
   import Link from 'next/link'

   export default function SelectVariant({
     product,
     size,
     color,
   }: {
     product: IProduct
     color: string
     size: string
   }) {
     const selectedColor = color || product.colors[0]
     const selectedSize = size || product.sizes[0]

     return (
       <>
         {product.colors.length > 0 && (
           <div className='space-x-2 space-y-2'>
             <div>Color:</div>
             {product.colors.map((x: string) => (
               <Button
                 asChild
                 variant='outline'
                 className={
                   selectedColor === x ? 'border-2 border-primary' : 'border-2'
                 }
                 key={x}
               >
                 <Link
                   replace
                   scroll={false}
                   href={`?${new URLSearchParams({
                     color: x,
                     size: selectedSize,
                   })}`}
                   key={x}
                 >
                   <div
                     style={{ backgroundColor: x }}
                     className='h-4 w-4 rounded-full border border-muted-foreground'
                   ></div>
                   {x}
                 </Link>
               </Button>
             ))}
           </div>
         )}
         {product.sizes.length > 0 && (
           <div className='mt-2 space-x-2 space-y-2'>
             <div>Size:</div>
             {product.sizes.map((x: string) => (
               <Button
                 asChild
                 variant='outline'
                 className={
                   selectedSize === x
                     ? 'border-2  border-primary'
                     : 'border-2  '
                 }
                 key={x}
               >
                 <Link
                   replace
                   scroll={false}
                   href={`?${new URLSearchParams({
                     color: selectedColor,
                     size: x,
                   })}`}
                 >
                   {x}
                 </Link>
               </Button>
             ))}
           </div>
         )}
       </>
     )
   }
   ```

7. app/(root)/product/[slug]/page.tsx

   ```tsx
   import { Card, CardContent } from '@/components/ui/card'
   import {
     getProductBySlug,
     getRelatedProductsByCategory,
   } from '@/lib/actions/product.actions'

   import SelectVariant from '@/components/shared/product/select-variant'
   import ProductPrice from '@/components/shared/product/product-price'
   import ProductGallery from '@/components/shared/product/product-gallery'
   import { Separator } from '@/components/ui/separator'
   import ProductSlider from '@/components/shared/product/product-slider'

   export async function generateMetadata(props: {
     params: Promise<{ slug: string }>
   }) {
     const params = await props.params
     const product = await getProductBySlug(params.slug)
     if (!product) {
       return { title: 'Product not found' }
     }
     return {
       title: product.name,
       description: product.description,
     }
   }

   export default async function ProductDetails(props: {
     params: Promise<{ slug: string }>
     searchParams: Promise<{ page: string; color: string; size: string }>
   }) {
     const searchParams = await props.searchParams

     const { page, color, size } = searchParams

     const params = await props.params

     const { slug } = params

     const product = await getProductBySlug(slug)

     const relatedProducts = await getRelatedProductsByCategory({
       category: product.category,
       productId: product._id,
       page: Number(page || '1'),
     })

     return (
       <div>
         <section>
           <div className='grid grid-cols-1 md:grid-cols-5  '>
             <div className='col-span-2'>
               <ProductGallery images={product.images} />
             </div>

             <div className='flex w-full flex-col gap-2 md:p-5 col-span-2'>
               <div className='flex flex-col gap-3'>
                 <p className='p-medium-16 rounded-full bg-grey-500/10   text-grey-500'>
                   Brand {product.brand} {product.category}
                 </p>
                 <h1 className='font-bold text-lg lg:text-xl'>
                   {product.name}
                 </h1>
                 <div className='flex items-center gap-2'>
                   <span>{product.avgRating.toFixed(1)}</span>
                   <Rating rating={product.avgRating} />
                   <span>{product.numReviews} ratings</span>
                 </div>
                 <Separator />
                 <div className='flex flex-col gap-3 sm:flex-row sm:items-center'>
                   <div className='flex gap-3'>
                     <ProductPrice
                       price={product.price}
                       listPrice={product.listPrice}
                       isDeal={product.tags.includes('todays-deal')}
                       forListing={false}
                     />
                   </div>
                 </div>
               </div>
               <div>
                 <SelectVariant
                   product={product}
                   size={size || product.sizes[0]}
                   color={color || product.colors[0]}
                 />
               </div>
               <Separator className='my-2' />
               <div className='flex flex-col gap-2'>
                 <p className='p-bold-20 text-grey-600'>Description:</p>
                 <p className='p-medium-16 lg:p-regular-18'>
                   {product.description}
                 </p>
               </div>
             </div>
             <div>
               <Card>
                 <CardContent className='p-4 flex flex-col  gap-4'>
                   <ProductPrice price={product.price} />

                   {product.countInStock > 0 && product.countInStock <= 3 && (
                     <div className='text-destructive font-bold'>
                       {`Only ${product.countInStock} left in stock - order soon`}
                     </div>
                   )}
                   {product.countInStock !== 0 ? (
                     <div className='text-green-700 text-xl'>In Stock</div>
                   ) : (
                     <div className='text-destructive text-xl'>
                       Out of Stock
                     </div>
                   )}
                 </CardContent>
               </Card>
             </div>
           </div>
         </section>

         <section className='mt-10'>
           <ProductSlider
             products={relatedProducts.data}
             title={`Best Sellers in ${product.category}`}
           />
         </section>
       </div>
     )
   }
   ```

8. app/(root)/layout.tsx

   ```tsx
   import React from 'react'

   import Header from '@/components/shared/header'
   import Footer from '@/components/shared/footer'

   export default async function RootLayout({
     children,
   }: {
     children: React.ReactNode
   }) {
     return (
       <div className='flex flex-col min-h-screen'>
         <Header />
         <main className='flex-1 flex flex-col p-4'>{children}</main>
         <Footer />
       </div>
     )
   }
   ```

9. commit changes and push to GitHub
10. go to https://nextjs-amazona.vercel.app
