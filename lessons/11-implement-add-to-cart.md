# 11-Implement-Add-To-Cart

1. npx shadcn@latest add toast
2. lib/utils.ts

   ```ts
   export const round2 = (num: number) =>
     Math.round((num + Number.EPSILON) * 100) / 100

   export const generateId = () =>
     Array.from({ length: 24 }, () => Math.floor(Math.random() * 10)).join('')
   ```

3. lib/constants.ts

   ```ts
   export const FREE_SHIPPING_MIN_PRICE = Number(
     process.env.FREE_SHIPPING_MIN_PRICE || 35
   )
   ```

4. lib/validator.ts

   ```ts
   // Order Item
   export const OrderItemSchema = z.object({
     clientId: z.string().min(1, 'clientId is required'),
     product: z.string().min(1, 'Product is required'),
     name: z.string().min(1, 'Name is required'),
     slug: z.string().min(1, 'Slug is required'),
     category: z.string().min(1, 'Category is required'),
     quantity: z
       .number()
       .int()
       .nonnegative('Quantity must be a non-negative number'),
     countInStock: z
       .number()
       .int()
       .nonnegative('Quantity must be a non-negative number'),
     image: z.string().min(1, 'Image is required'),
     price: Price('Price'),
     size: z.string().optional(),
     color: z.string().optional(),
   })

   export const CartSchema = z.object({
     items: z
       .array(OrderItemSchema)
       .min(1, 'Order must contain at least one item'),
     itemsPrice: z.number(),

     taxPrice: z.optional(z.number()),
     shippingPrice: z.optional(z.number()),
     totalPrice: z.number(),
     paymentMethod: z.optional(z.string()),
     deliveryDateIndex: z.optional(z.number()),
     expectedDeliveryDate: z.optional(z.date()),
   })
   ```

5. types/index.ts

   ```ts
   import {
     CartSchema,
     OrderItemSchema,
     ProductInputSchema,
   } from '@/lib/validator'
   export type OrderItem = z.infer<typeof OrderItemSchema>
   export type Cart = z.infer<typeof CartSchema>
   ```

6. lib/actions/order.actions.ts

   ```ts
   import { OrderItem } from '@/types'
   import { round2 } from '../utils'
   import { FREE_SHIPPING_MIN_PRICE } from '../constants'

   export const calcDeliveryDateAndPrice = async ({
     items,
   }: {
     deliveryDateIndex?: number
     items: OrderItem[]
   }) => {
     const itemsPrice = round2(
       items.reduce((acc, item) => acc + item.price * item.quantity, 0)
     )

     const shippingPrice = itemsPrice > FREE_SHIPPING_MIN_PRICE ? 0 : 5
     const taxPrice = round2(itemsPrice * 0.15)
     const totalPrice = round2(
       itemsPrice +
         (shippingPrice ? round2(shippingPrice) : 0) +
         (taxPrice ? round2(taxPrice) : 0)
     )
     return {
       itemsPrice,
       shippingPrice,
       taxPrice,
       totalPrice,
     }
   }
   ```

7. hooks/use-cart-store.ts

   ```ts
   import { create } from 'zustand'
   import { persist } from 'zustand/middleware'

   import { Cart, OrderItem } from '@/types'
   import { calcDeliveryDateAndPrice } from '@/lib/actions/order.actions'

   const initialState: Cart = {
     items: [],
     itemsPrice: 0,
     taxPrice: undefined,
     shippingPrice: undefined,
     totalPrice: 0,
     paymentMethod: undefined,
     deliveryDateIndex: undefined,
   }

   interface CartState {
     cart: Cart
     addItem: (item: OrderItem, quantity: number) => Promise<string>
   }

   const useCartStore = create(
     persist<CartState>(
       (set, get) => ({
         cart: initialState,

         addItem: async (item: OrderItem, quantity: number) => {
           const { items } = get().cart
           const existItem = items.find(
             (x) =>
               x.product === item.product &&
               x.color === item.color &&
               x.size === item.size
           )

           if (existItem) {
             if (existItem.countInStock < quantity + existItem.quantity) {
               throw new Error('Not enough items in stock')
             }
           } else {
             if (item.countInStock < item.quantity) {
               throw new Error('Not enough items in stock')
             }
           }

           const updatedCartItems = existItem
             ? items.map((x) =>
                 x.product === item.product &&
                 x.color === item.color &&
                 x.size === item.size
                   ? { ...existItem, quantity: existItem.quantity + quantity }
                   : x
               )
             : [...items, { ...item, quantity }]

           set({
             cart: {
               ...get().cart,
               items: updatedCartItems,
               ...(await calcDeliveryDateAndPrice({
                 items: updatedCartItems,
               })),
             },
           })
           // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
           return updatedCartItems.find(
             (x) =>
               x.product === item.product &&
               x.color === item.color &&
               x.size === item.size
           )?.clientId!
         },
         init: () => set({ cart: initialState }),
       }),
       {
         name: 'cart-store',
       }
     )
   )
   export default useCartStore
   ```

8. components/shared/product/add-to-cart.tsx

   ```tsx
   /* eslint-disable @typescript-eslint/no-explicit-any */
   'use client'

   import { Button } from '@/components/ui/button'
   import {
     Select,
     SelectContent,
     SelectItem,
     SelectTrigger,
     SelectValue,
   } from '@/components/ui/select'
   import useCartStore from '@/hooks/use-cart-store'
   import { useToast } from '@/hooks/use-toast'
   import { OrderItem } from '@/types'
   import { useRouter } from 'next/navigation'
   import { useState } from 'react'

   export default function AddToCart({
     item,
     minimal = false,
   }: {
     item: OrderItem
     minimal?: boolean
   }) {
     const router = useRouter()
     const { toast } = useToast()

     const { addItem } = useCartStore()

     const [quantity, setQuantity] = useState(1)

     return minimal ? (
       <Button
         className='rounded-full w-auto'
         onClick={() => {
           try {
             addItem(item, 1)
             toast({
               description: 'Added to Cart',
               action: (
                 <Button
                   onClick={() => {
                     router.push('/cart')
                   }}
                 >
                   Go to Cart
                 </Button>
               ),
             })
           } catch (error: any) {
             toast({
               variant: 'destructive',
               description: error.message,
             })
           }
         }}
       >
         Add to Cart
       </Button>
     ) : (
       <div className='w-full space-y-2'>
         <Select
           value={quantity.toString()}
           onValueChange={(i) => setQuantity(Number(i))}
         >
           <SelectTrigger className=''>
             <SelectValue>Quantity: {quantity}</SelectValue>
           </SelectTrigger>
           <SelectContent position='popper'>
             {Array.from({ length: item.countInStock }).map((_, i) => (
               <SelectItem key={i + 1} value={`${i + 1}`}>
                 {i + 1}
               </SelectItem>
             ))}
           </SelectContent>
         </Select>

         <Button
           className='rounded-full w-full'
           type='button'
           onClick={async () => {
             try {
               const itemId = await addItem(item, quantity)
               router.push(`/cart/${itemId}`)
             } catch (error: any) {
               toast({
                 variant: 'destructive',
                 description: error.message,
               })
             }
           }}
         >
           Add to Cart
         </Button>
         <Button
           variant='secondary'
           onClick={() => {
             try {
               addItem(item, quantity)
               router.push(`/checkout`)
             } catch (error: any) {
               toast({
                 variant: 'destructive',
                 description: error.message,
               })
             }
           }}
           className='w-full rounded-full '
         >
           Buy Now
         </Button>
       </div>
     )
   }
   ```

9. hooks/use-is-mounted.ts

   ```ts
   import { useEffect, useState } from 'react'

   function useIsMounted() {
     const [isMounted, setIsMounted] = useState(false)

     useEffect(() => {
       setIsMounted(true)
     }, [])

     return isMounted
   }

   export default useIsMounted
   ```

10. app/(root)/product/[slug]/page.tsx

    ```tsx
    import AddToCart from '@/components/shared/product/add-to-cart'
    import { generateId, round2 } from '@/lib/utils'


      return (

                      {product.countInStock !== 0 && (
                        <div className='flex justify-center items-center'>
                          <AddToCart
                            item={{
                              clientId: generateId(),
                              product: product._id,
                              countInStock: product.countInStock,
                              name: product.name,
                              slug: product.slug,
                              category: product.category,
                              price: round2(product.price),
                              quantity: 1,
                              image: product.images[0],
                              size: size || product.sizes[0],
                              color: color || product.colors[0],
                            }}
                          />
                        </div>
                      )}
      )

    ```

11. app/(root)/cart/[itemId]/cart-add-item.tsx

    ```tsx
    'use client'
    import ProductPrice from '@/components/shared/product/product-price'
    import { buttonVariants } from '@/components/ui/button'
    import { Card, CardContent } from '@/components/ui/card'
    import { cn } from '@/lib/utils'
    import { CheckCircle2Icon } from 'lucide-react'
    import Image from 'next/image'
    import Link from 'next/link'
    import { notFound } from 'next/navigation'
    import useCartStore from '@/hooks/use-cart-store'
    import { FREE_SHIPPING_MIN_PRICE } from '@/lib/constants'
    import BrowsingHistoryList from '@/components/shared/browsing-history-list'

    export default function CartAddItem({ itemId }: { itemId: string }) {
      const {
        cart: { items, itemsPrice },
      } = useCartStore()
      const item = items.find((x) => x.clientId === itemId)

      if (!item) return notFound()
      return (
        <div>
          <div className='grid grid-cols-1 md:grid-cols-2 md:gap-4'>
            <Card className='w-full rounded-none'>
              <CardContent className='flex h-full items-center justify-center  gap-3 py-4'>
                <Link href={`/product/${item.slug}`}>
                  <Image
                    src={item.image}
                    alt={item.name}
                    width={80}
                    height={80}
                    style={{
                      maxWidth: '100%',
                      height: 'auto',
                    }}
                  />
                </Link>
                <div>
                  <h3 className='text-xl font-bold flex gap-2 my-2'>
                    <CheckCircle2Icon className='h-6 w-6 text-green-700' />
                    Added to cart
                  </h3>
                  <p className='text-sm'>
                    <span className='font-bold'> Color: </span>{' '}
                    {item.color ?? '-'}
                  </p>
                  <p className='text-sm'>
                    <span className='font-bold'> Size: </span>{' '}
                    {item.size ?? '-'}
                  </p>
                </div>
              </CardContent>
            </Card>
            <Card className='w-full rounded-none'>
              <CardContent className='p-4 h-full'>
                <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
                  <div className='flex justify-center items-center'>
                    {itemsPrice < FREE_SHIPPING_MIN_PRICE ? (
                      <div className='text-center '>
                        Add
                        <span className='text-green-700'>
                          <ProductPrice
                            price={FREE_SHIPPING_MIN_PRICE - itemsPrice}
                            plain
                          />
                        </span> of eligible items to your order to qualify for FREE
                        Shipping
                      </div>
                    ) : (
                      <div className='flex items-center'>
                        <div>
                          <span className='text-green-700'>
                            Your order qualifies for FREE Shipping.
                          </span>{' '}
                          Choose this option at checkout.
                        </div>
                      </div>
                    )}
                  </div>
                  <div className='lg:border-l lg:border-muted lg:pl-3 flex flex-col items-center gap-3  '>
                    <div className='flex gap-3'>
                      <span className='text-lg font-bold'>Cart Subtotal:</span>
                      <ProductPrice className='text-2xl' price={itemsPrice} />
                    </div>
                    <Link
                      href='/checkout'
                      className={cn(buttonVariants(), 'rounded-full w-full')}
                    >
                      Proceed to checkout (
                      {items.reduce((a, c) => a + c.quantity, 0)} items)
                    </Link>
                    <Link
                      href='/cart'
                      className={cn(
                        buttonVariants({ variant: 'outline' }),
                        'rounded-full w-full'
                      )}
                    >
                      Go to Cart
                    </Link>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          <BrowsingHistoryList />
        </div>
      )
    }
    ```

12. app/(root)/cart/[itemId]/page.tsx

    ```tsx
    import CartAddItem from './cart-add-item'

    export default async function CartAddItemPage(props: {
      params: Promise<{ itemId: string }>
    }) {
      const { itemId } = await props.params

      return <CartAddItem itemId={itemId} />
    }
    ```

13. components/shared/header/cart-button.tsx

    ```tsx
    'use client'

    import { ShoppingCartIcon } from 'lucide-react'
    import Link from 'next/link'
    import useIsMounted from '@/hooks/use-is-mounted'
    import { cn } from '@/lib/utils'
    import useCartStore from '@/hooks/use-cart-store'

    export default function CartButton() {
      const isMounted = useIsMounted()
      const {
        cart: { items },
      } = useCartStore()
      const cartItemsCount = items.reduce((a, c) => a + c.quantity, 0)
      return (
        <Link href='/cart' className='px-1 header-button'>
          <div className='flex items-end text-xs relative'>
            <ShoppingCartIcon className='h-8 w-8' />

            {isMounted && (
              <span
                className={cn(
                  `bg-black  px-1 rounded-full text-primary text-base font-bold absolute right-[30px] top-[-4px] z-10`,
                  cartItemsCount >= 10 && 'text-sm px-0 p-[1px]'
                )}
              >
                {cartItemsCount}
              </span>
            )}
            <span className='font-bold'>Cart</span>
          </div>
        </Link>
      )
    }
    ```

14. components/shared/header/menu.tsx

    ```tsx
    import Link from 'next/link'
    import CartButton from './cart-button'

    export default function Menu() {
      return (
        <div className='flex justify-end'>
          <nav className='flex gap-3 w-full'>
            <CartButton />
          </nav>
        </div>
      )
    }
    ```

15. components/shared/product/product-card.tsx

    ```tsx
    const AddButton = () => (
      <div className='w-full text-center'>
        <AddToCart
          minimal
          item={{
            clientId: generateId(),
            product: product._id,
            size: product.sizes[0],
            color: product.colors[0],
            countInStock: product.countInStock,
            name: product.name,
            slug: product.slug,
            category: product.category,
            price: round2(product.price),
            quantity: 1,
            image: product.images[0],
          }}
        />
      </div>
    )
    ```

16. commit changes and push to GitHub
17. go to https://nextjs-amazona.vercel.app
