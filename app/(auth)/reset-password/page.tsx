'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { InputPassword } from '@/components/input-password'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form'
import { Loader2 } from 'lucide-react'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { resetPasswordSchema } from '@/lib/zod'
import { resetPassword } from '@/actions/api-actions'
import { toast } from 'sonner'

type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>

export default function ResetPasswordForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()

  const token = searchParams.get('token')
  const email = searchParams.get('email')

  const form = useForm<ResetPasswordFormValues>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: {
      token: token || '',
      email: email || '',
      password: '',
      password_confirmation: ''
    }
  })

  const onSubmit = (values: ResetPasswordFormValues) => {
    startTransition(async () => {
      try {
        const result = await resetPassword(values)
        if (result.success) {
          toast.success('Success', {
            description: result.message
          })
          router.push('/login')
        } else {
          toast.error('Error', {
            description:
              result.message || 'Failed to reset password. Please try again.'
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
      headerTitle='Reset Password'
      headerDescription='Enter your new password to reset your account'
      backButtonLabel='Back to login'
      backButtonHref='/login'
    >
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <FormLabel>New Password</FormLabel>
                <FormControl>
                  <InputPassword
                    {...field}
                    disabled={isPending}
                    placeholder='Enter your new password'
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name='password_confirmation'
            render={({ field }) => (
              <FormItem>
                <FormLabel>Confirm New Password</FormLabel>
                <FormControl>
                  <InputPassword
                    {...field}
                    disabled={isPending}
                    placeholder='Confirm your new password'
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
                Resetting Password...
              </>
            ) : (
              'Reset Password'
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
