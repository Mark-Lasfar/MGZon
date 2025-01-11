'use client'
import { zodResolver } from '@hookform/resolvers/zod'
import { Calendar, Check, StarIcon, User } from 'lucide-react'
import Link from 'next/link'
import { useEffect, useState } from 'react'
import { SubmitHandler, useForm } from 'react-hook-form'
import { useInView } from 'react-intersection-observer'
import { z } from 'zod'
import { useTranslations } from 'next-intl'

import Rating from '@/components/shared/product/rating'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Textarea } from '@/components/ui/textarea'
import { useToast } from '@/hooks/use-toast'
import {
  createUpdateReview,
  getReviewByProductId,
  getReviews,
} from '@/lib/actions/review.actions'
import { ReviewInputSchema } from '@/lib/validator'
import RatingSummary from '@/components/shared/product/rating-summary'
import { IProduct } from '@/lib/db/models/product.model'
import { Separator } from '@/components/ui/separator'
import { IReviewDetails } from '@/types'

const reviewFormDefaultValues = {
  title: '',
  comment: '',
  rating: 0,
}

export default function ReviewList({
  userId,
  product,
}: {
  userId: string | undefined
  product: IProduct
}) {
  const t = useTranslations('Product')
  const [page, setPage] = useState(2)
  const [totalPages, setTotalPages] = useState(0)
  const [reviews, setReviews] = useState<IReviewDetails[]>([])
  const { ref, inView } = useInView({ triggerOnce: true })
  const reload = async () => {
    try {
      const res = await getReviews({ productId: product._id, page: 1 })
      setReviews([...res.data])
      setTotalPages(res.totalPages)
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (err) {
      toast({
        variant: 'destructive',
        description: t('Error in fetching reviews'),
      })
    }
  }

  const loadMoreReviews = async () => {
    if (totalPages !== 0 && page > totalPages) return
    setLoadingReviews(true)
    const res = await getReviews({ productId: product._id, page })
    setLoadingReviews(false)
    setReviews([...reviews, ...res.data])
    setTotalPages(res.totalPages)
    setPage(page + 1)
  }

  const [loadingReviews, setLoadingReviews] = useState(false)
  useEffect(() => {
    const loadReviews = async () => {
      setLoadingReviews(true)
      const res = await getReviews({ productId: product._id, page: 1 })
      setReviews([...res.data])
      setTotalPages(res.totalPages)
      setLoadingReviews(false)
    }

    if (inView) {
      loadReviews()
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inView])

  type CustomerReview = z.infer<typeof ReviewInputSchema>
  const form = useForm<CustomerReview>({
    resolver: zodResolver(ReviewInputSchema),
    defaultValues: reviewFormDefaultValues,
  })
  const [open, setOpen] = useState(false)
  const { toast } = useToast()
  const onSubmit: SubmitHandler<CustomerReview> = async (values) => {
    const res = await createUpdateReview({
      data: { ...values, product: product._id },
      path: `/product/${product.slug}`,
    })
    if (!res.success)
      return toast({
        variant: 'destructive',
        description: res.message,
      })
    setOpen(false)
    reload()
    toast({
      description: res.message,
    })
  }

  const handleOpenForm = async () => {
    form.setValue('product', product._id)
    form.setValue('user', userId!)
    form.setValue('isVerifiedPurchase', true)
    const review = await getReviewByProductId({ productId: product._id })
    if (review) {
      form.setValue('title', review.title)
      form.setValue('comment', review.comment)
      form.setValue('rating', review.rating)
    }
    setOpen(true)
  }
  return (
    <div className='space-y-2'>
      {reviews.length === 0 && <div>{t('No reviews yet')}</div>}

      <div className='grid grid-cols-1 md:grid-cols-4 gap-8'>
        <div className='flex flex-col gap-2'>
          {reviews.length !== 0 && (
            <RatingSummary
              avgRating={product.avgRating}
              numReviews={product.numReviews}
              ratingDistribution={product.ratingDistribution}
            />
          )}
          <Separator className='my-3' />
          <div className='space-y-3'>
            <h3 className='font-bold text-lg lg:text-xl'>
              {t('Review this product')}
            </h3>
            <p className='text-sm'>
              {t('Share your thoughts with other customers')}
            </p>
            {userId ? (
              <Dialog open={open} onOpenChange={setOpen}>
                <Button
                  onClick={handleOpenForm}
                  variant='outline'
                  className=' rounded-full w-full'
                >
                  {t('Write a customer review')}
                </Button>

                <DialogContent className='sm:max-w-[425px]'>
                  <Form {...form}>
                    <form method='post' onSubmit={form.handleSubmit(onSubmit)}>
                      <DialogHeader>
                        <DialogTitle>
                          {t('Write a customer review')}
                        </DialogTitle>
                        <DialogDescription>
                          {t('Share your thoughts with other customers')}
                        </DialogDescription>
                      </DialogHeader>
                      <div className='grid gap-4 py-4'>
                        <div className='flex flex-col gap-5  '>
                          <FormField
                            control={form.control}
                            name='title'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>{t('Title')}</FormLabel>
                                <FormControl>
                                  <Input
                                    placeholder={t('Enter title')}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />

                          <FormField
                            control={form.control}
                            name='comment'
                            render={({ field }) => (
                              <FormItem className='w-full'>
                                <FormLabel>{t('Comment')}</FormLabel>
                                <FormControl>
                                  <Textarea
                                    placeholder={t('Enter comment')}
                                    {...field}
                                  />
                                </FormControl>
                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                        <div>
                          <FormField
                            control={form.control}
                            name='rating'
                            render={({ field }) => (
                              <FormItem>
                                <FormLabel>{t('Rating')}</FormLabel>
                                <Select
                                  onValueChange={field.onChange}
                                  value={field.value.toString()}
                                >
                                  <FormControl>
                                    <SelectTrigger>
                                      <SelectValue
                                        placeholder={t('Select a rating')}
                                      />
                                    </SelectTrigger>
                                  </FormControl>
                                  <SelectContent>
                                    {Array.from({ length: 5 }).map(
                                      (_, index) => (
                                        <SelectItem
                                          key={index}
                                          value={(index + 1).toString()}
                                        >
                                          <div className='flex items-center gap-1'>
                                            {index + 1}{' '}
                                            <StarIcon className='h-4 w-4' />
                                          </div>
                                        </SelectItem>
                                      )
                                    )}
                                  </SelectContent>
                                </Select>

                                <FormMessage />
                              </FormItem>
                            )}
                          />
                        </div>
                      </div>

                      <DialogFooter>
                        <Button
                          type='submit'
                          size='lg'
                          disabled={form.formState.isSubmitting}
                        >
                          {form.formState.isSubmitting
                            ? t('Submitting...')
                            : t('Submit')}
                        </Button>
                      </DialogFooter>
                    </form>
                  </Form>
                </DialogContent>
              </Dialog>
            ) : (
              <div>
                {t('Please')}{' '}
                <Link
                  href={`/sign-in?callbackUrl=/product/${product.slug}`}
                  className='highlight-link'
                >
                  {t('sign in')}
                </Link>{' '}
                {t('to write a review')}
              </div>
            )}
          </div>
        </div>
        <div className='md:col-span-3 flex flex-col gap-3'>
          {reviews.map((review: IReviewDetails) => (
            <Card key={review._id}>
              <CardHeader>
                <div className='flex-between'>
                  <CardTitle>{review.title}</CardTitle>
                  <div className='italic text-sm flex'>
                    <Check className='h-4 w-4' /> {t('Verified Purchase')}
                  </div>
                </div>
                <CardDescription>{review.comment}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className='flex space-x-4 text-sm text-muted-foreground'>
                  <Rating rating={review.rating} />
                  <div className='flex items-center'>
                    <User className='mr-1 h-3 w-3' />
                    {review.user ? review.user.name : t('Deleted User')}
                  </div>
                  <div className='flex items-center'>
                    <Calendar className='mr-1 h-3 w-3' />
                    {review.createdAt.toString().substring(0, 10)}
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
          <div ref={ref}>
            {page <= totalPages && (
              <Button variant={'link'} onClick={loadMoreReviews}>
                {t('See more reviews')}
              </Button>
            )}

            {page < totalPages && loadingReviews && t('Loading')}
          </div>
        </div>
      </div>
    </div>
  )
}
