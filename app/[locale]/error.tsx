'use client'
import React from 'react'

import { Button } from '@/components/ui/button'
import { useTranslations } from 'next-intl'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error
  reset: () => void
}) {
  const t = useTranslations()
  return (
    <div className='flex flex-col items-center justify-center min-h-screen '>
      <div className='p-6 rounded-lg shadow-md w-1/3 text-center'>
        <h1 className='text-3xl font-bold mb-4'>{t('Error.Error')}</h1>
        <p className='text-destructive'>{error.message}</p>
        <Button variant='outline' className='mt-4' onClick={() => reset()}>
          {t('Error.Try again')}
        </Button>
        <Button
          variant='outline'
          className='mt-4 ml-2'
          onClick={() => (window.location.href = '/')}
        >
          {t('Error.Back To Home')}
        </Button>
      </div>
    </div>
  )
}
