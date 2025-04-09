'use server'

import { connectToDatabase } from '../db'
import Rating from '../db/models/rating.model'
import { formatError } from '../utils'

export async function submitRating({ rating }: { rating: number }) {
  try {
    await connectToDatabase()
    
    await Rating.create({
      value: rating,
      date: new Date(),
    })

    return {
      success: true,
      message: 'Rating submitted successfully',
    }
  } catch (error) {
    return { success: false, message: formatError(error) }
  }
}
