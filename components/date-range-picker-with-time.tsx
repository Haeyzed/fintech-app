'use client';

import React, { useEffect, useState } from 'react';
import { CalendarIcon, ChevronDown } from 'lucide-react';
import {
  endOfMonth,
  endOfWeek,
  endOfYear,
  format,
  isValid,
  parse,
  setHours,
  setMinutes,
  startOfMonth,
  startOfWeek,
  startOfYear,
  subDays,
  subYears
} from 'date-fns';
import { DateRange } from 'react-day-picker';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';

interface DateRangePickerProps {
  onDateRangeChange: (
    startDate: string,
    endDate: string,
    compareStartDate?: string,
    compareEndDate?: string
  ) => void
  className?: string
  enableTime?: boolean
}

export default function DateRangePickerWithTime({
                                          onDateRangeChange,
                                          className,
                                          enableTime = true
                                        }: DateRangePickerProps) {
  const [date, setDate] = useState<DateRange | undefined>(undefined)
  const [compareDate, setCompareDate] = useState<DateRange | undefined>(
    undefined
  )
  const [selectedPreset, setSelectedPreset] = useState<string>('custom')
  const [isCompareEnabled, setIsCompareEnabled] = useState(false)
  const [startTime, setStartTime] = useState<string>('00:00')
  const [endTime, setEndTime] = useState<string>('23:59')
  const [compareStartTime, setCompareStartTime] = useState<string>('00:00')
  const [compareEndTime, setCompareEndTime] = useState<string>('23:59')

  const presets = [
    {
      label: 'Today',
      value: 'today',
      range: { from: new Date(), to: new Date() }
    },
    {
      label: 'Yesterday',
      value: 'yesterday',
      range: { from: subDays(new Date(), 1), to: subDays(new Date(), 1) }
    },
    {
      label: 'Last 7 days',
      value: 'last7days',
      range: { from: subDays(new Date(), 6), to: new Date() }
    },
    {
      label: 'Last 14 days',
      value: 'last14days',
      range: { from: subDays(new Date(), 13), to: new Date() }
    },
    {
      label: 'Last 30 days',
      value: 'last30days',
      range: { from: subDays(new Date(), 29), to: new Date() }
    },
    {
      label: 'This week',
      value: 'thisWeek',
      range: { from: startOfWeek(new Date()), to: endOfWeek(new Date()) }
    },
    {
      label: 'Last week',
      value: 'lastWeek',
      range: {
        from: startOfWeek(subDays(new Date(), 7)),
        to: endOfWeek(subDays(new Date(), 7))
      }
    },
    {
      label: 'This month',
      value: 'thisMonth',
      range: { from: startOfMonth(new Date()), to: endOfMonth(new Date()) }
    },
    {
      label: 'Last month',
      value: 'lastMonth',
      range: {
        from: startOfMonth(subDays(new Date(), 30)),
        to: endOfMonth(subDays(new Date(), 30))
      }
    },
    {
      label: 'This year',
      value: 'thisYear',
      range: { from: startOfYear(new Date()), to: endOfYear(new Date()) }
    },
    {
      label: 'Last year',
      value: 'lastYear',
      range: {
        from: startOfYear(subYears(new Date(), 1)),
        to: endOfYear(subYears(new Date(), 1))
      }
    },
    { label: 'Custom', value: 'custom' }
  ]

  useEffect(() => {
    if (date?.from && date?.to) {
      const formatString = enableTime ? 'yyyy-MM-dd HH:mm:ss' : 'yyyy-MM-dd'
      const fromDate = enableTime
        ? setMinutes(setHours(date.from, parseInt(startTime.split(':')[0])), parseInt(startTime.split(':')[1]))
        : date.from
      const toDate = enableTime
        ? setMinutes(setHours(date.to, parseInt(endTime.split(':')[0])), parseInt(endTime.split(':')[1]))
        : date.to

      onDateRangeChange(
        format(fromDate, formatString),
        format(toDate, formatString),
        compareDate?.from
          ? format(
            enableTime
              ? setMinutes(setHours(compareDate.from, parseInt(compareStartTime.split(':')[0])), parseInt(compareStartTime.split(':')[1]))
              : compareDate.from,
            formatString
          )
          : undefined,
        compareDate?.to
          ? format(
            enableTime
              ? setMinutes(setHours(compareDate.to, parseInt(compareEndTime.split(':')[0])), parseInt(compareEndTime.split(':')[1]))
              : compareDate.to,
            formatString
          )
          : undefined
      )
    }
  }, [date, compareDate, startTime, endTime, compareStartTime, compareEndTime, onDateRangeChange, enableTime])

  const handlePresetChange = (value: string) => {
    setSelectedPreset(value)
    const preset = presets.find(p => p.value === value)
    if (preset && preset.range) {
      setDate(preset.range)
      if (isCompareEnabled) {
        const compareRange = {
          from: subDays(
            preset.range.from,
            preset.range.to.getDate() - preset.range.from.getDate() + 1
          ),
          to: subDays(
            preset.range.to,
            preset.range.to.getDate() - preset.range.from.getDate() + 1
          )
        }
        setCompareDate(compareRange)
      }
    } else {
      setDate(undefined)
      setCompareDate(undefined)
    }
  }

  const handleCompareToggle = (checked: boolean) => {
    setIsCompareEnabled(checked)
    if (checked && date?.from && date?.to) {
      const compareRange = {
        from: subDays(date.from, date.to.getDate() - date.from.getDate() + 1),
        to: subDays(date.to, date.to.getDate() - date.from.getDate() + 1)
      }
      setCompareDate(compareRange)
    } else {
      setCompareDate(undefined)
    }
  }

  const handleDateChange = (
    field: 'from' | 'to',
    value: string,
    isCompare: boolean = false
  ) => {
    const parsedDate = parse(value, 'dd/MM/yyyy', new Date())
    if (isValid(parsedDate)) {
      if (isCompare) {
        setCompareDate(prev => {
          if (!prev)
            return {
              from: field === 'from' ? parsedDate : undefined,
              to: field === 'to' ? parsedDate : undefined
            }
          return { ...prev, [field]: parsedDate }
        })
      } else {
        setDate(prev => {
          if (!prev)
            return {
              from: field === 'from' ? parsedDate : undefined,
              to: field === 'to' ? parsedDate : undefined
            }
          return { ...prev, [field]: parsedDate }
        })
      }
    }
  }

  const handleTimeChange = (
    field: 'start' | 'end',
    value: string,
    isCompare: boolean = false
  ) => {
    if (isCompare) {
      if (field === 'start') {
        setCompareStartTime(value)
      } else {
        setCompareEndTime(value)
      }
    } else {
      if (field === 'start') {
        setStartTime(value)
      } else {
        setEndTime(value)
      }
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
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, 'LLL dd, y')} -{' '}
                  {format(date.to, 'LLL dd, y')}
                  {enableTime && (
                    <>
                      {' '}
                      {startTime} - {endTime}
                    </>
                  )}
                </>
              ) : (
                format(date.from, 'LLL dd, y')
              )
            ) : (
              <span>Pick a date</span>
            )}
            {isCompareEnabled && compareDate?.from && compareDate?.to && (
              <span className='ml-2 text-muted-foreground'>
                vs. {format(compareDate.from, 'LLL dd, y')} -{' '}
                {format(compareDate.to, 'LLL dd, y')}
                {enableTime && (
                  <>
                    {' '}
                    {compareStartTime} - {compareEndTime}
                  </>
                )}
              </span>
            )}
            <ChevronDown className='ml-auto h-4 w-4 opacity-50' />
          </Button>
        </PopoverTrigger>
        <PopoverContent className='w-auto p-0' align='start'>
          <div className='flex flex-col space-y-4 p-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
            <div className='space-y-4'>
              <div className='flex items-center space-x-2'>
                <Switch
                  id='compare-mode'
                  checked={isCompareEnabled}
                  onCheckedChange={handleCompareToggle}
                />
                <Label htmlFor='compare-mode'>Compare</Label>
              </div>
              <div className='grid gap-2'>
                <div className='flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0'>
                  <Input
                    type='text'
                    placeholder='DD/MM/YYYY'
                    value={date?.from ? format(date.from, 'dd/MM/yyyy') : ''}
                    onChange={e => handleDateChange('from', e.target.value)}
                    className='w-full sm:w-[130px]'
                  />
                  <span className='flex items-center justify-center'>-</span>
                  <Input
                    type='text'
                    placeholder='DD/MM/YYYY'
                    value={date?.to ? format(date.to, 'dd/MM/yyyy') : ''}
                    onChange={e => handleDateChange('to', e.target.value)}
                    className='w-full sm:w-[130px]'
                  />
                </div>
                {enableTime && (
                  <div className='flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0'>
                    <Input
                      type='time'
                      value={startTime}
                      onChange={e => handleTimeChange('start', e.target.value)}
                      className='w-full sm:w-[130px]'
                    />
                    <span className='flex items-center justify-center'>-</span>
                    <Input
                      type='time'
                      value={endTime}
                      onChange={e => handleTimeChange('end', e.target.value)}
                      className='w-full sm:w-[130px]'
                    />
                  </div>
                )}
                {isCompareEnabled && (
                  <>
                    <div className='flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0'>
                      <Input
                        type='text'
                        placeholder='DD/MM/YYYY'
                        value={
                          compareDate?.from
                            ? format(compareDate.from, 'dd/MM/yyyy')
                            : ''
                        }
                        onChange={e =>
                          handleDateChange('from', e.target.value, true)
                        }
                        className='w-full sm:w-[130px]'
                      />
                      <span className='flex items-center justify-center'>-</span>
                      <Input
                        type='text'
                        placeholder='DD/MM/YYYY'
                        value={
                          compareDate?.to
                            ? format(compareDate.to, 'dd/MM/yyyy')
                            : ''
                        }
                        onChange={e =>
                          handleDateChange('to', e.target.value, true)
                        }
                        className='w-full sm:w-[130px]'
                      />
                    </div>
                    {enableTime && (
                      <div className='flex flex-col space-y-2 sm:flex-row sm:space-x-2 sm:space-y-0'>
                        <Input
                          type='time'
                          value={compareStartTime}
                          onChange={e => handleTimeChange('start', e.target.value, true)}
                          className='w-full sm:w-[130px]'
                        />
                        <span className='flex items-center justify-center'>-</span>
                        <Input
                          type='time'
                          value={compareEndTime}
                          onChange={e => handleTimeChange('end', e.target.value, true)}
                          className='w-full sm:w-[130px]'
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
              <div className='flex flex-col space-y-2'>
                <Select
                  onValueChange={handlePresetChange}
                  defaultValue={selectedPreset}
                >
                  <SelectTrigger>
                    <SelectValue placeholder='Select a preset' />
                  </SelectTrigger>
                  <SelectContent>
                    {presets.map(preset => (
                      <SelectItem key={preset.value} value={preset.value}>
                        {preset.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className='flex flex-col space-y-4 sm:flex-row sm:space-x-4 sm:space-y-0'>
              <Calendar
                initialFocus
                mode='range'
                defaultMonth={date?.from}
                selected={date}
                onSelect={setDate}
                numberOfMonths={2}
                className='rounded-md border'
              />
              {isCompareEnabled && (
                <Calendar
                  initialFocus
                  mode='range'
                  defaultMonth={compareDate?.from}
                  selected={compareDate}
                  onSelect={setCompareDate}
                  numberOfMonths={2}
                  className='rounded-md border'
                />
              )}
            </div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}