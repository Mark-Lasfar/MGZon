import { IReviewInput } from '@/types'
import { Document, Model, model, models, Schema } from 'mongoose'

export interface IReview extends Document, IReviewInput {
  _id: string
  createdAt: Date
  updatedAt: Date
}
const reviewSchema = new Schema<IReview>(
  {
    user: {
      type: Schema.Types.ObjectId as unknown as typeof String,
      ref: 'User',
    },
    isVerifiedPurchase: {
      type: Boolean,
      required: true,
      default: false,
    },
    product: {
      type: Schema.Types.ObjectId as unknown as typeof String,
      ref: 'Product',
    },
    rating: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    title: {
      type: String,
      required: true,
    },
    comment: {
      type: String,
      required: true,
    },
  },
  {
    timestamps: true,
  }
)

const Review =
  (models.Review as Model<IReview>) || model<IReview>('Review', reviewSchema)

export default Review
