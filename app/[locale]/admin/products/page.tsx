import { Metadata } from 'next'
import ProductList from './product-list'

export const metadata: Metadata = {
  title: 'Admin Products',
}

export default async function AdminProduct() {
  return <ProductList />
}
