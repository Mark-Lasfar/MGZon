'use server'

import mongoose from 'mongoose'
import { revalidatePath } from 'next/cache'
import { z } from 'zod'

import { auth } from '@/auth'

import { connectToDatabase } from '../db'
import Product from '../db/models/product.model'
import Review, { IReview } from '../db/models/review.model'
import { formatError } from '../utils'
import { ReviewInputSchema } from '../validator'
import { IReviewDetails } from '@/types'
import { getSetting } from './setting.actions'

export async function createUpdateReview({
  data,
  path,
}: {
  data: z.infer<typeof ReviewInputSchema>
  path: string
}) {
  try {
    const session = await auth()
    if (!session) {
      throw new Error('User is not authenticated')
    }

    const review = ReviewInputSchema.parse({
      ...data,
      user: session?.user?.id,
    })

    await connectToDatabase()
    const existReview = await Review.findOne({
      product: review.product,
      user: review.user,
    })

    if (existReview) {
      existReview.comment = review.comment
      existReview.rating = review.rating
      existReview.title = review.title
      await existReview.save()
      await updateProductReview(review.product)
      revalidatePath(path)
      return {
        success: true,
        message: 'Review updated successfully',
        // data: JSON.parse(JSON.stringify(existReview)),
      }
    } else {
      await Review.create(review)
      await updateProductReview(review.product)
      revalidatePath(path)
      return {
        success: true,
        message: 'Review created successfully',
        // data: JSON.parse(JSON.stringify(newReview)),
      }
    }
  } catch (error) {
    return {
      success: false,
      message: formatError(error),
    }
  }
}

const updateProductReview = async (productId: string) => {
  // Calculate the new average rating, number of reviews, and rating distribution
  const result = await Review.aggregate([
    { $match: { product: new mongoose.Types.ObjectId(productId) } },
    {
      $group: {
        _id: '$rating',
        count: { $sum: 1 },
      },
    },
  ])
  // Calculate the total number of reviews and average rating
  const totalReviews = result.reduce((sum, { count }) => sum + count, 0)
  const avgRating =
    result.reduce((sum, { _id, count }) => sum + _id * count, 0) / totalReviews

  // Convert aggregation result to a map for easier lookup
  const ratingMap = result.reduce((map, { _id, count }) => {
    map[_id] = count
    return map
  }, {})
  // Ensure all ratings 1-5 are represented, with missing ones set to count: 0
  const ratingDistribution = []
  for (let i = 1; i <= 5; i++) {
    ratingDistribution.push({ rating: i, count: ratingMap[i] || 0 })
  }
  // Update product fields with calculated values
  await Product.findByIdAndUpdate(productId, {
    avgRating: avgRating.toFixed(1),
    numReviews: totalReviews,
    ratingDistribution,
  })
}

export async function getReviews({
  productId,
  limit,
  page,
}: {
  productId: string
  limit?: number
  page: number
}) {
  const {
    common: { pageSize },
  } = await getSetting()
  limit = limit || pageSize
  await connectToDatabase()
  const skipAmount = (page - 1) * limit
  const reviews = await Review.find({ product: productId })
    .populate('user', 'name')
    .sort({
      createdAt: 'desc',
    })
    .skip(skipAmount)
    .limit(limit)
  const reviewsCount = await Review.countDocuments({ product: productId })
  return {
    data: JSON.parse(JSON.stringify(reviews)) as IReviewDetails[],
    totalPages: reviewsCount === 0 ? 1 : Math.ceil(reviewsCount / limit),
  }
}
export const getReviewByProductId = async ({
  productId,
}: {
  productId: string
}) => {
  await connectToDatabase()
  const session = await auth()
  if (!session) {
    throw new Error('User is not authenticated')
  }
  const review = await Review.findOne({
    product: productId,
    user: session?.user?.id,
  })
  return review ? (JSON.parse(JSON.stringify(review)) as IReview) : null
}
