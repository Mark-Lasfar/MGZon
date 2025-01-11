# 12-create-cart-page

1. hooks/use-cart-store.ts

   ```ts
        interface CartState {
        cart: Cart
        addItem: (item: OrderItem, quantity: number) => Promise<string>

        updateItem: (item: OrderItem, quantity: number) => Promise<void>
        removeItem: (item: OrderItem) => void
        }
        ...

        updateItem: async (item: OrderItem, quantity: number) => {
        const { items } = get().cart
        const exist = items.find(
          (x) =>
            x.product === item.product &&
            x.color === item.color &&
            x.size === item.size
        )
        if (!exist) return
        const updatedCartItems = items.map((x) =>
          x.product === item.product &&
          x.color === item.color &&
          x.size === item.size
            ? { ...exist, quantity: quantity }
            : x
        )
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              items: updatedCartItems,
            })),
          },
        })
      },
      removeItem: async (item: OrderItem) => {
        const { items } = get().cart
        const updatedCartItems = items.filter(
          (x) =>
            x.product !== item.product ||
            x.color !== item.color ||
            x.size !== item.size
        )
        set({
          cart: {
            ...get().cart,
            items: updatedCartItems,
            ...(await calcDeliveryDateAndPrice({
              items: updatedCartItems,
            })),
          },
        })
      },
   ```

2. app/(root)/cart/page.tsx

   ```tsx
   'use client'
   import BrowsingHistoryList from '@/components/shared/browsing-history-list'
   import ProductPrice from '@/components/shared/product/product-price'
   import { Button } from '@/components/ui/button'
   import { Card, CardContent, CardHeader } from '@/components/ui/card'
   import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
   } from '@/components/ui/select'
   import useCartStore from '@/hooks/use-cart-store'
   import { APP_NAME, FREE_SHIPPING_MIN_PRICE } from '@/lib/constants'
   import Image from 'next/image'
   import Link from 'next/link'
   import { useRouter } from 'next/navigation'
   import React from 'react'

   export default function CartPage() {
     const {
       cart: { items, itemsPrice },
       updateItem,
       removeItem,
     } = useCartStore()
     const router = useRouter()
     return (
       <div>
         <div className='grid grid-cols-1 md:grid-cols-4  md:gap-4'>
           {items.length === 0 ? (
             <Card className='col-span-4 rounded-none'>
               <CardHeader className='text-3xl  '>
                 Your Shopping Cart is empty
               </CardHeader>
               <CardContent>
                 Continue shopping on <Link href='/'>{APP_NAME}</Link>
               </CardContent>
             </Card>
           ) : (
             <>
               <div className='col-span-3'>
                 <Card className='rounded-none'>
                   <CardHeader className='text-3xl pb-0'>
                     Shopping Cart
                   </CardHeader>
                   <CardContent className='p-4'>
                     <div className='flex justify-end border-b mb-4'>Price</div>

                     {items.map((item) => (
                       <div
                         key={item.clientId}
                         className='flex flex-col md:flex-row justify-between py-4 border-b gap-4'
                       >
                         <Link href={`/product/${item.slug}`}>
                           <div className='relative w-40 h-40'>
                             <Image
                               src={item.image}
                               alt={item.name}
                               fill
                               sizes='20vw'
                               style={{
                                 objectFit: 'contain',
                               }}
                             />
                           </div>
                         </Link>

                         <div className='flex-1 space-y-4'>
                           <Link
                             href={`/product/${item.slug}`}
                             className='text-lg hover:no-underline  '
                           >
                             {item.name}
                           </Link>
                           <div>
                             <p className='text-sm'>
                               <span className='font-bold'>Color: </span>{' '}
                               {item.color}
                             </p>
                             <p className='text-sm'>
                               <span className='font-bold'>Size: </span>{' '}
                               {item.size}
                             </p>
                           </div>
                           <div className='flex gap-2 items-center'>
                             <Select
                               value={item.quantity.toString()}
                               onValueChange={(value) =>
                                 updateItem(item, Number(value))
                               }
                             >
                               <SelectTrigger className='w-auto'>
                                 <SelectValue>
                                   Quantity: {item.quantity}
                                 </SelectValue>
                               </SelectTrigger>
                               <SelectContent position='popper'>
                                 {Array.from({
                                   length: item.countInStock,
                                 }).map((_, i) => (
                                   <SelectItem key={i + 1} value={`${i + 1}`}>
                                     {i + 1}
                                   </SelectItem>
                                 ))}
                               </SelectContent>
                             </Select>
                             <Button
                               variant={'outline'}
                               onClick={() => removeItem(item)}
                             >
                               Delete
                             </Button>
                           </div>
                         </div>
                         <div>
                           <p className='text-right'>
                             {item.quantity > 1 && (
                               <>
                                 {item.quantity} x
                                 <ProductPrice price={item.price} plain />
                                 <br />
                               </>
                             )}

                             <span className='font-bold text-lg'>
                               <ProductPrice
                                 price={item.price * item.quantity}
                                 plain
                               />
                             </span>
                           </p>
                         </div>
                       </div>
                     ))}

                     <div className='flex justify-end text-lg my-2'>
                       Subtotal (
                       {items.reduce((acc, item) => acc + item.quantity, 0)}{' '}
                       Items):{' '}
                       <span className='font-bold ml-1'>
                         <ProductPrice price={itemsPrice} plain />
                       </span>{' '}
                     </div>
                   </CardContent>
                 </Card>
               </div>
               <div>
                 <Card className='rounded-none'>
                   <CardContent className='py-4 space-y-4'>
                     {itemsPrice < FREE_SHIPPING_MIN_PRICE ? (
                       <div className='flex-1'>
                         Add{' '}
                         <span className='text-green-700'>
                           <ProductPrice
                             price={FREE_SHIPPING_MIN_PRICE - itemsPrice}
                             plain
                           />
                         </span>{' '}
                         of eligible items to your order to qualify for FREE
                         Shipping
                       </div>
                     ) : (
                       <div className='flex-1'>
                         <span className='text-green-700'>
                           Your order qualifies for FREE Shipping
                         </span>{' '}
                         Choose this option at checkout
                       </div>
                     )}
                     <div className='text-lg'>
                       Subtotal (
                       {items.reduce((acc, item) => acc + item.quantity, 0)}{' '}
                       items):{' '}
                       <span className='font-bold'>
                         <ProductPrice price={itemsPrice} plain />
                       </span>{' '}
                     </div>
                     <Button
                       onClick={() => router.push('/checkout')}
                       className='rounded-full w-full'
                     >
                       Proceed to Checkout
                     </Button>
                   </CardContent>
                 </Card>
               </div>
             </>
           )}
         </div>
         <BrowsingHistoryList className='mt-10' />
       </div>
     )
   }
   ```

3. commit changes and push to GitHub
4. go to https://nextjs-amazona.vercel.app
