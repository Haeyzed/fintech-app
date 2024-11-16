'use client'

import React, { useState, useEffect } from 'react'
import { CalendarIcon, Clock } from 'lucide-react'
import { format, parse, isValid, setHours, setMinutes } from 'date-fns'

import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'

interface DatePickerWithTimeProps {
  onDateTimeChange: (dateTime: string) => void
  className?: string
  enableTime?: boolean
}

export default function DatePickerWithTime({
                                             onDateTimeChange,
                                             className,
                                             enableTime = true
                                           }: DatePickerWithTimeProps) {
  const [date, setDate] = useState<Date | undefined>(undefined)
  const [time, setTime] = useState<string>('00:00')

  useEffect(() => {
    if (date) {
      const formatString = enableTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'
      const dateTime = enableTime
        ? setMinutes(setHours(date, parseInt(time.split(':')[0])), parseInt(time.split(':')[1]))
        : date

      onDateTimeChange(format(dateTime, formatString))
    }
  }, [date, time, onDateTimeChange, enableTime])

  const handleDateChange = (newDate: Date | undefined) => {
    setDate(newDate)
  }

  const handleTimeChange = (newTime: string) => {
    setTime(newTime)
  }

  const handleInputChange = (value: string) => {
    const parsedDate = parse(value, 'dd/MM/yyyy', new Date())
    if (isValid(parsedDate)) {
      setDate(parsedDate)
    }
  }

  return (
    <div className={cn('grid gap-2', className)}>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            id='date'
            variant='outline'
            className={cn(
              'w-full justify-start bg-card text-left font-normal',
              !date && 'text-foreground'
            )}
          >
            <CalendarIcon className='mr-2 h-4 w-4' />
            {date ? (
              <>
                {format(date, 'LLL dd, y')}
                {enableTime && (
                  <>
                    {' '}
                    <Clock className='ml-2 h-4 w-4 inline' /> {time}
                  </>
                )}
              </>
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <div className='flex flex-col space-y-4 p-4'>
            <div className='space-y-2'>
              <div className='flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0'>
                <Input
                  type='text'
                  placeholder='DD/MM/YYYY'
                  value={date ? format(date, 'dd/MM/yyyy') : ''}
                  onChange={e => handleInputChange(e.target.value)}
                  className='w-full sm:w-[130px]'
                />
                {enableTime && (
                  <Input
                    type='time'
                    value={time}
                    onChange={e => handleTimeChange(e.target.value)}
                    className='w-full sm:w-[130px]'
                  />
                )}
              </div>
            </div>
            <Calendar
              mode='single'
              selected={date}
              onSelect={handleDateChange}
              initialFocus
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}