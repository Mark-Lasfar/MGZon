'use client'

import * as React from 'react'
import { CalendarIcon } from 'lucide-react'
import { DateRange } from 'react-day-picker'

import { cn, formatDateTime } from '@/lib/utils'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { PopoverClose } from '@radix-ui/react-popover'

export function CalendarDateRangePicker({
  defaultDate,
  setDate,
  className,
}: {
  defaultDate?: DateRange
  setDate: React.Dispatch<React.SetStateAction<DateRange | undefined>>
  className?: string
}) {
  const [calendarDate, setCalendarDate] = React.useState<DateRange | undefined>(
    defaultDate
  )

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant={'outline'}
            className={cn(
              'justify-start text-left font-normal',
              !calendarDate && 'text-muted-foreground'
            )}
          >
            <CalendarIcon className='mr-0 h-4 w-4' />
            {calendarDate?.from ? (
              calendarDate.to ? (
                <>
                  {formatDateTime(calendarDate.from).dateOnly} -{' '}
                  {formatDateTime(calendarDate.to).dateOnly}
                </>
              ) : (
                formatDateTime(calendarDate.from).dateOnly
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent
          onCloseAutoFocus={() => setCalendarDate(defaultDate)}
          className='w-auto p-0'
          align='end'
        >
          <Calendar
            mode='range'
            defaultMonth={defaultDate?.from}
            selected={calendarDate}
            onSelect={setCalendarDate}
            numberOfMonths={2}
          />
          <div className='flex gap-4 p-4 pt-0'>
            <PopoverClose asChild>
              <Button onClick={() => setDate(calendarDate)}>Apply</Button>
            </PopoverClose>
            <PopoverClose asChild>
              <Button variant={'outline'}>Cancel</Button>
            </PopoverClose>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}
