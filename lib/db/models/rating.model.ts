import { Schema, model } from 'mongoose'

const ratingSchema = new Schema(
  {
    value: {
      type: Number,
      required: true,
      min: 1,
      max: 5,
    },
    userIp: {
      type: String,
    },
  },
  { timestamps: true }
)

const Rating = model('Rating', ratingSchema)
export default Rating
