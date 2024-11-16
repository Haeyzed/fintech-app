'use client'

import { useTransition } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { forgotPasswordSchema } from '@/lib/zod'
import { Loader2 } from 'lucide-react'
import { toast } from 'sonner'
import { forgotPassword } from '@/actions/api-actions'

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>

export default function ForgotPasswordForm() {
  const [isPending, startTransition] = useTransition()

  const form = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: ''
    }
  })

  const onSubmit = (values: ForgotPasswordFormValues) => {
    startTransition(async () => {
      try {
        const result = await forgotPassword(values)
        if (result.success) {
          toast.success('Success', {
            description: result.message
          })
          form.reset()
        } else {
          toast.error('Error', {
            description: result.message
          })
        }
      } catch (error) {
        console.error(error)
        toast.error('Error', {
          description: 'An unexpected error occurred'
        })
      }
    })
  }

  return (
    <CardWrapper
      headerTitle='Forgot Password'
      headerDescription='Enter your email to receive a password reset link'
      backButtonLabel='Back to login'
      backButtonHref='/login'
      enableSocial={false}
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-2'>
          <FormField
            control={form.control}
            name='email'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    {...field}
                    disabled={isPending}
                    placeholder='Enter your email'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <Button type='submit' disabled={isPending} className='w-full'>
            {isPending ? (
              <>
                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                Sending reset link...
              </>
            ) : (
              'Send Reset Link'
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
