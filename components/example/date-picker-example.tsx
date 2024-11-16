import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  datePickerWithTimeSchema,
  DatePickerWithTimeValues,
  dateRangePickerWithTimeSchema,
  DateRangePickerWithTimeValues
} from '@/schemas/date-picker-schemas';
// import DatePickerWithTime from './date-picker-with-time';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import DatePickerWithTime from '@/components/date-picker-with-time';

export default function DatePickerExample() {
  const singleDateForm = useForm<DatePickerWithTimeValues>({
    resolver: zodResolver(datePickerWithTimeSchema),
    defaultValues: {
      dateTime: '',
    },
  });

  const dateRangeForm = useForm<DateRangePickerWithTimeValues>({
    resolver: zodResolver(dateRangePickerWithTimeSchema),
    defaultValues: {
      startDateTime: '',
      endDateTime: '',
      compareStartDateTime: '',
      compareEndDateTime: '',
    },
  });

  const onSingleDateSubmit = (values: DatePickerWithTimeValues) => {
    console.log(values);
  };

  const onDateRangeSubmit = (values: DateRangePickerWithTimeValues) => {
    console.log(values);
  };

  return (
    <div className="space-y-8">
      <Form {...singleDateForm}>
        <form onSubmit={singleDateForm.handleSubmit(onSingleDateSubmit)} className="space-y-4">
          <FormField
            control={singleDateForm.control}
            name="dateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Select Date and Time</FormLabel>
                <FormControl>
                  <DatePickerWithTime
                    onDateTimeChange={field.onChange}
                    enableTime={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit Single Date</Button>
        </form>
      </Form>

      <Form {...dateRangeForm}>
        <form onSubmit={dateRangeForm.handleSubmit(onDateRangeSubmit)} className="space-y-4">
          <FormField
            control={dateRangeForm.control}
            name="startDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Start Date and Time</FormLabel>
                <FormControl>
                  <DatePickerWithTime
                    onDateTimeChange={field.onChange}
                    enableTime={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={dateRangeForm.control}
            name="endDateTime"
            render={({ field }) => (
              <FormItem>
                <FormLabel>End Date and Time</FormLabel>
                <FormControl>
                  <DatePickerWithTime
                    onDateTimeChange={field.onChange}
                    enableTime={true}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type="submit">Submit Date Range</Button>
        </form>
      </Form>
    </div>
  );
}