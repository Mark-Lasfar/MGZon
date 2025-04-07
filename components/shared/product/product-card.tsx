import Image from 'next/image'
import Link from 'next/link'
import React, { useState } from 'react'

import { Card, CardContent, CardFooter, CardHeader } from '@/components/ui/card'
import { IProduct } from '@/lib/db/models/product.model'

import Rating from './rating'
import { formatNumber, generateId, round2 } from '@/lib/utils'
import ProductPrice from './product-price'
import ImageHover from './image-hover'
import AddToCart from './add-to-cart'

const ProductCard = ({
  product,
  hideBorder = false,
  hideDetails = false,
  hideAddToCart = false,
}: {
  product: IProduct
  hideDetails?: boolean
  hideBorder?: boolean
  hideAddToCart?: boolean
}) => {
  const [imageError, setImageError] = useState(false)

  // دالة معالجة أخطاء الصور
  const handleImageError = () => {
    setImageError(true)
  }

  const ProductImage = () => {
    const mainImage = imageError || !product.images?.[0] 
      ? '/default-product.jpg'
      : product.images[0]

    const hoverImage = imageError || !product.images?.[1] 
      ? mainImage
      : product.images[1]

    return (
      <Link href={`/product/${product.slug}`}>
        <div className='relative h-52'>
          {product.images?.length > 1 ? (
            <ImageHover
              src={mainImage}
              hoverSrc={hoverImage}
              alt={product.name}
              onError={handleImageError}
            />
          ) : (
            <div className='relative h-52'>
              <Image
                src={mainImage}
                alt={product.name}
                fill
                sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
                className='object-contain'
                priority={!!product.tags?.includes('featured')}
                quality={85}
                onError={handleImageError}
                placeholder='blur'
                blurDataURL='data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+P+yHgAFWAJp08sG7wAAAABJRU5ErkJggg=='
              />
            </div>
          )}
        </div>
      </Link>
    )
  }

  const ProductDetails = () => (
    <div className='flex-1 space-y-2'>
      <p className='font-bold'>{product.brand}</p>
      <Link
        href={`/product/${product.slug}`}
        className='overflow-hidden text-ellipsis'
        style={{
          display: '-webkit-box',
          WebkitLineClamp: 2,
          WebkitBoxOrient: 'vertical',
        }}
        title={product.name} // إضافة title لإمكانية الوصول
      >
        {product.name}
      </Link>
      
      <div className='flex gap-2 justify-center'>
        <Rating rating={product.avgRating || 0} />
        <span>({formatNumber(product.numReviews || 0)})</span>
      </div>

      <ProductPrice
        isDeal={product.tags?.includes('todays-deal') || false}
        price={product.price}
        listPrice={product.listPrice}
        forListing
      />
    </div>
  )

  const AddButton = () => (
    <div className='w-full text-center'>
      <AddToCart
        minimal
        item={{
          clientId: generateId(),
          product: product._id,
          size: product.sizes?.[0] || 'standard',
          color: product.colors?.[0] || '#000000',
          countInStock: product.countInStock || 0,
          name: product.name,
          slug: product.slug,
          category: product.category?._id || '',
          price: round2(product.price),
          quantity: 1,
          image: product.images?.[0] || '/default-product.jpg',
        }}
      />
    </div>
  )

  return hideBorder ? (
    <div className='flex flex-col'>
      <ProductImage />
      {!hideDetails && (
        <>
          <div className='p-3 flex-1 text-center'>
            <ProductDetails />
          </div>
          {!hideAddToCart && <AddButton />}
        </>
      )}
    </div>
  ) : (
    <Card className='flex flex-col hover:shadow-lg transition-shadow'>
      <CardHeader className='p-3'>
        <ProductImage />
      </CardHeader>
      {!hideDetails && (
        <>
          <CardContent className='p-3 flex-1 text-center'>
            <ProductDetails />
          </CardContent>
          <CardFooter className='p-3'>
            {!hideAddToCart && <AddButton />}
          </CardFooter>
        </>
      )}
    </Card>
  )
}

export default ProductCard