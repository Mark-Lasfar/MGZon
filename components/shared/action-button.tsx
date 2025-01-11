'use client'
import { useTransition } from 'react'

import { Button } from '@/components/ui/button'
import { useToast } from '@/hooks/use-toast'
import { cn } from '@/lib/utils'

export default function ActionButton({
  caption,
  action,
  className = 'w-full',
  variant = 'default',
  size = 'default',
}: {
  caption: string
  action: () => Promise<{ success: boolean; message: string }>
  className?: string
  variant?: 'default' | 'outline' | 'destructive'
  size?: 'default' | 'sm' | 'lg'
}) {
  const [isPending, startTransition] = useTransition()
  const { toast } = useToast()
  return (
    <Button
      type='button'
      className={cn('rounded-full', className)}
      variant={variant}
      size={size}
      disabled={isPending}
      onClick={() =>
        startTransition(async () => {
          const res = await action()
          toast({
            variant: res.success ? 'default' : 'destructive',
            description: res.message,
          })
        })
      }
    >
      {isPending ? 'processing...' : caption}
    </Button>
  )
}
