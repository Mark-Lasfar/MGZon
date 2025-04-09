'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { submitRating } from '@/lib/actions/rating.actions'
import { toast } from '@/components/ui/use-toast'

export default function RatingSystem() {
  const [rating, setRating] = useState(0)
  const [hover, setHover] = useState(0)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async () => {
    try {
      await submitRating({ rating })
      toast({
        title: 'Thank you for your rating!',
        description: 'Your feedback helps us improve.',
      })
      setSubmitted(true)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to submit rating. Please try again later.',
        variant: 'destructive',
      })
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-center">
        {[...Array(5)].map((_, index) => {
          const ratingValue = index + 1
          return (
            <button
              key={index}
              className="p-2"
              onClick={() => !submitted && setRating(ratingValue)}
              onMouseEnter={() => !submitted && setHover(ratingValue)}
              onMouseLeave={() => !submitted && setHover(0)}
            >
              <svg
                className={`w-8 h-8 ${
                  (hover || rating) >= ratingValue
                    ? 'text-yellow-500'
                    : 'text-gray-300'
                }`}
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
              </svg>
            </button>
          )
        })}
      </div>
      {!submitted && rating > 0 && (
        <Button
          onClick={handleSubmit}
          className="w-full bg-primary hover:bg-primary-dark"
        >
          Submit Rating
        </Button>
      )}
      {submitted && (
        <p className="text-center text-green-600">
          Thank you for your 5-star rating!
        </p>
      )}
      <div className="text-center text-sm text-muted-foreground">
        Over 9 million happy customers rated us 5 stars!
      </div>
    </div>
  )
}
