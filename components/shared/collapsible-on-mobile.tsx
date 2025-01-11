'use client'
import React, { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '../ui/collapsible'
import useDeviceType from '@/hooks/use-device-type'
import { Button } from '../ui/button'

export default function CollapsibleOnMobile({
  title,
  children,
}: {
  title: string
  children: React.ReactNode
}) {
  const searchParams = useSearchParams()

  const deviceType = useDeviceType()
  const [open, setOpen] = useState(false)
  useEffect(() => {
    if (deviceType === 'mobile') setOpen(false)
    else if (deviceType === 'desktop') setOpen(true)
  }, [deviceType, searchParams])
  if (deviceType === 'unknown') return null
  return (
    <Collapsible open={open}>
      <CollapsibleTrigger asChild>
        {deviceType === 'mobile' && (
          <Button
            onClick={() => setOpen(!open)}
            variant={'outline'}
            className='w-full'
          >
            {title}
          </Button>
        )}
      </CollapsibleTrigger>
      <CollapsibleContent>{children}</CollapsibleContent>
    </Collapsible>
  )
}
