# 10-create-browsing-history

1. npm i zustand
2. hooks/use-browsing-history.ts

   ```ts
   import { create } from 'zustand'
   import { persist } from 'zustand/middleware'
   type BrowsingHistory = {
     products: { id: string; category: string }[]
   }
   const initialState: BrowsingHistory = {
     products: [],
   }

   export const browsingHistoryStore = create<BrowsingHistory>()(
     persist(() => initialState, {
       name: 'browsingHistoryStore',
     })
   )

   export default function useBrowsingHistory() {
     const { products } = browsingHistoryStore()
     return {
       products,
       addItem: (product: { id: string; category: string }) => {
         const index = products.findIndex((p) => p.id === product.id)
         if (index !== -1) products.splice(index, 1) // Remove duplicate if it exists
         products.unshift(product) // Add id to the start

         if (products.length > 10) products.pop() // Remove excess items if length exceeds 10

         browsingHistoryStore.setState({
           products,
         })
       },

       clear: () => {
         browsingHistoryStore.setState({
           products: [],
         })
       },
     }
   }
   ```

3. components/shared/browsing-history-list.tsx

   ```tsx
   'use client'
   import useBrowsingHistory from '@/hooks/use-browsing-history'
   import React, { useEffect } from 'react'
   import ProductSlider from './product/product-slider'
   import { Separator } from '../ui/separator'
   import { cn } from '@/lib/utils'

   export default function BrowsingHistoryList({
     className,
   }: {
     className?: string
   }) {
     const { products } = useBrowsingHistory()
     return (
       products.length !== 0 && (
         <div className='bg-background'>
           <Separator className={cn('mb-4', className)} />
           <ProductList
             title={"Related to items that you've viewed"}
             type='related'
           />
           <Separator className='mb-4' />
           <ProductList
             title={'Your browsing history'}
             hideDetails
             type='history'
           />
         </div>
       )
     )
   }

   function ProductList({
     title,
     type = 'history',
     hideDetails = false,
   }: {
     title: string
     type: 'history' | 'related'
     hideDetails?: boolean
   }) {
     const { products } = useBrowsingHistory()
     const [data, setData] = React.useState([])
     useEffect(() => {
       const fetchProducts = async () => {
         const res = await fetch(
           `/api/products/browsing-history?type=${type}&categories=${products
             .map((product) => product.category)
             .join(',')}&ids=${products.map((product) => product.id).join(',')}`
         )
         const data = await res.json()
         setData(data)
       }
       fetchProducts()
     }, [products, type])

     return (
       data.length > 0 && (
         <ProductSlider
           title={title}
           products={data}
           hideDetails={hideDetails}
         />
       )
     )
   }
   ```

4. app/api/products/browsing-history/route.ts

   ```ts
   import { NextRequest, NextResponse } from 'next/server'

   import Product from '@/lib/db/models/product.model'
   import { connectToDatabase } from '@/lib/db'

   export const GET = async (request: NextRequest) => {
     const listType = request.nextUrl.searchParams.get('type') || 'history'
     const productIdsParam = request.nextUrl.searchParams.get('ids')
     const categoriesParam = request.nextUrl.searchParams.get('categories')

     if (!productIdsParam || !categoriesParam) {
       return NextResponse.json([])
     }

     const productIds = productIdsParam.split(',')
     const categories = categoriesParam.split(',')
     const filter =
       listType === 'history'
         ? {
             _id: { $in: productIds },
           }
         : { category: { $in: categories }, _id: { $nin: productIds } }

     await connectToDatabase()
     const products = await Product.find(filter)
     if (listType === 'history')
       return NextResponse.json(
         products.sort(
           (a, b) =>
             productIds.indexOf(a._id.toString()) -
             productIds.indexOf(b._id.toString())
         )
       )
     return NextResponse.json(products)
   }
   ```

5. app/(home)/page.tsx

   ```tsx
   <div className='p-4 bg-background'>
     <BrowsingHistoryList />
   </div>
   ```

6. app/(root)/product/[slug]/page.tsx

   ```tsx
   <section>
     <BrowsingHistoryList className='mt-10' />
   </section>
   ```

7. components/shared/product/add-to-browsing-history.tsx

   ```ts
   'use client'
   import useBrowsingHistory from '@/hooks/use-browsing-history'
   import { useEffect } from 'react'

   export default function AddToBrowsingHistory({
     id,
     category,
   }: {
     id: string
     category: string
   }) {
     const { addItem } = useBrowsingHistory()
     useEffect(() => {
       console.log('addItem({ id, category })')
       addItem({ id, category })
       // eslint-disable-next-line react-hooks/exhaustive-deps
     }, [])
     return null
   }
   ```

8. commit changes and push to GitHub
9. go to https://nextjs-amazona.vercel.app
