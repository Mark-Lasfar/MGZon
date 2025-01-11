import { notFound } from 'next/navigation'
import React from 'react'

import { auth } from '@/auth'
import { getOrderById } from '@/lib/actions/order.actions'
import OrderDetailsForm from '@/components/shared/order/order-details-form'
import Link from 'next/link'
import { formatId } from '@/lib/utils'

export async function generateMetadata(props: {
  params: Promise<{ id: string }>
}) {
  const params = await props.params

  return {
    title: `Order ${formatId(params.id)}`,
  }
}

export default async function OrderDetailsPage(props: {
  params: Promise<{
    id: string
  }>
}) {
  const params = await props.params

  const { id } = params

  const order = await getOrderById(id)
  if (!order) notFound()

  const session = await auth()

  return (
    <>
      <div className='flex gap-2'>
        <Link href='/account'>Your Account</Link>
        <span>›</span>
        <Link href='/account/orders'>Your Orders</Link>
        <span>›</span>
        <span>Order {formatId(order._id)}</span>
      </div>
      <h1 className='h1-bold py-4'>Order {formatId(order._id)}</h1>
      <OrderDetailsForm
        order={order}
        isAdmin={session?.user?.role === 'Admin' || false}
      />
    </>
  )
}
