# 30-admin-orders

## update next.config.ts

```ts
const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'utfs.io',
        port: '',
      },
    ],
  },
}
```

## update tailwind.config.ts

```ts
import { withUt } from 'uploadthing/tw'

const config: Config = withUt({})

export default config
```

## update app/admin/products/product-form.tsx

```tsx
{/* copilot prompt: add delete button as shadcn Button with TrashIcon from lucide-react to remove the image from images array */}
                      {images.map((image: string) => (
                        <Card key={image} className='relative '>
                          <Image
                            src={image}
                            alt='product image'
                            className='w-36 h-36 object-cover object-center rounded-sm'
                            width={100}
                            height={100}
                          />
                          <Button
                            variant={'destructive'}
                            className='absolute top-1 right-1'
                            type='button'
                            size='icon'
                            onClick={() => {
                              form.setValue(
                                'images',
                                images.filter((img) => img !== image)
                              )
                            }}
                          >
                            <Trash />
                          </Button>
                        </Card>
```

## update lib/actions/order.actions.ts

```ts
// DELETE
export async function deleteOrder(id: string) {
  try {
    await connectToDatabase()
    const res = await Order.findByIdAndDelete(id)
    if (!res) throw new Error('Order not found')
    revalidatePath('/admin/orders')
    return {
      success: true,
      message: 'Order deleted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}

// GET ALL ORDERS

export async function getAllOrders({
  limit,
  page,
}: {
  limit?: number
  page: number
}) {
  limit = limit || PAGE_SIZE
  await connectToDatabase()
  const skipAmount = (Number(page) - 1) * limit
  const orders = await Order.find()
    .populate('user', 'name')
    .sort({ createdAt: 'desc' })
    .skip(skipAmount)
    .limit(limit)
  const ordersCount = await Order.countDocuments()
  return {
    data: JSON.parse(JSON.stringify(orders)) as IOrderList[],
    totalPages: Math.ceil(ordersCount / limit),
  }
}
```

## create app/admin/orders/page.tsx

```ts
import { Metadata } from 'next'
import Link from 'next/link'

import { auth } from '@/auth'
import DeleteDialog from '@/components/shared/delete-dialog'
import Pagination from '@/components/shared/pagination'
import { Button } from '@/components/ui/button'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { deleteOrder, getAllOrders } from '@/lib/actions/order.actions'
import { formatDateTime, formatId } from '@/lib/utils'
import { IOrderList } from '@/types'
import ProductPrice from '@/components/shared/product/product-price'

export const metadata: Metadata = {
  title: 'Admin Orders',
}
export default async function OrdersPage(props: {
  searchParams: Promise<{ page: string }>
}) {
  const searchParams = await props.searchParams

  const { page = '1' } = searchParams

  const session = await auth()
  if (session?.user.role !== 'Admin')
    throw new Error('Admin permission required')

  const orders = await getAllOrders({
    page: Number(page),
  })
  return (
    <div className='space-y-2'>
      <h1 className='h1-bold'>Orders</h1>
      <div className='overflow-x-auto'>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Id</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Buyer</TableHead>
              <TableHead>Total</TableHead>
              <TableHead>Paid</TableHead>
              <TableHead>Delivered</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {orders.data.map((order: IOrderList) => (
              <TableRow key={order._id}>
                <TableCell>{formatId(order._id)}</TableCell>
                <TableCell>
                  {formatDateTime(order.createdAt!).dateTime}
                </TableCell>
                <TableCell>
                  {order.user ? order.user.name : 'Deleted User'}
                </TableCell>
                <TableCell>
                  {' '}
                  <ProductPrice price={order.totalPrice} plain />
                </TableCell>
                <TableCell>
                  {order.isPaid && order.paidAt
                    ? formatDateTime(order.paidAt).dateTime
                    : 'No'}
                </TableCell>
                <TableCell>
                  {order.isDelivered && order.deliveredAt
                    ? formatDateTime(order.deliveredAt).dateTime
                    : 'No'}
                </TableCell>
                <TableCell className='flex gap-1'>
                  <Button asChild variant='outline' size='sm'>
                    <Link href={`/admin/orders/${order._id}`}>Details</Link>
                  </Button>
                  <DeleteDialog id={order._id} action={deleteOrder} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {orders.totalPages > 1 && (
          <Pagination page={page} totalPages={orders.totalPages!} />
        )}
      </div>
    </div>
  )
}
```

## update components/shared/pagination.tsx

```ts
import { ChevronLeft, ChevronRight } from 'lucide-react'
-    <div className='flex gap-2'>
    <div className='flex items-center gap-2'>
-        className='w-28'
        className='w-24'
-        Previous
        <ChevronLeft /> Previous
      Page {page} of {totalPages}
-        className='w-28'
        className='w-24'
-        Next
        Next <ChevronRight />
```

## update app/admin/products/product-list.tsx

```ts
-/* eslint-disable @typescript-eslint/no-non-null-asserted-optional-chain */
import { ChevronLeft, ChevronRight } from 'lucide-react'
-          {data?.totalPages! > 1 && (
-            <div className='flex gap-2'>
          {(data?.totalPages ?? 0) > 1 && (
            <div className='flex items-center gap-2'>
                className='w-24'
-                Previous
                <ChevronLeft /> Previous
              Page {page} of {data?.totalPages}
-                disabled={Number(page) >= data?.totalPages!}
                disabled={Number(page) >= (data?.totalPages ?? 0)}
                className='w-24'
-                Next
                Next <ChevronRight />
```

## update app/(root)/account/manage/name/profile-form.tsx

```ts
-      // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
-      name: session?.user?.name!,
      name: session?.user?.name ?? '',
```

## update app/(root)/account/orders/page.tsx

```ts
-          // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
-          <Pagination page={page} totalPages={orders?.totalPages!} />
          <Pagination page={page} totalPages={orders.totalPages} />
```

## update app/(root)/search/page.tsx

```ts
-          {data!.totalPages! > 1 && (
-            <Pagination page={page} totalPages={data!.totalPages} />
          {data.totalPages > 1 && (
            <Pagination page={page} totalPages={data.totalPages} />
```

## update hooks/use-cart-store.ts

```ts
-        // eslint-disable-next-line @typescript-eslint/no-non-null-asserted-optional-chain
-        return updatedCartItems.find(
        const foundItem = updatedCartItems.find(
-        )?.clientId!
        )
        if (!foundItem) {
          throw new Error('Item not found in cart')
        }
        return foundItem.clientId
```

## npm run build

## commit changes and push to GitHub

## go to https://nextjs-amazona.vercel.app
