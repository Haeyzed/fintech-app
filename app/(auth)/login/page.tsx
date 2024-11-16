'use client'

import { useTransition } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
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
import { signInSchema } from '@/lib/zod'
import { login } from '@/actions/auth'
import { toast } from 'sonner'

type SignInFormValues = z.infer<typeof signInSchema>

export default function LoginForm() {
  const [isPending, startTransition] = useTransition()
  const router = useRouter()
  const searchParams = useSearchParams()
  const callbackUrl = searchParams.get('callbackUrl')

  const form = useForm<SignInFormValues>({
    resolver: zodResolver(signInSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit = (values: SignInFormValues) => {
    startTransition(async () => {
      try {
        const result = await login(values, callbackUrl)
        if (result.success) {
          toast.success('Success', {
            description: result.message
          })
          if (result.url) {
            router.push(result.url)
          } else {
            router.push('/dashboard')
          }
          router.refresh()
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
      headerTitle='Login'
      headerDescription='Enter your credentials to access your account'
      backButtonLabel='Don&#39;t have an account? Sign up'
      backButtonHref='/signup'
      enableSocial
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
          <FormField
            control={form.control}
            name='password'
            render={({ field }) => (
              <FormItem>
                <div className='flex items-center'>
                  <FormLabel>Password</FormLabel>
                  <Link
                    href={'/forgot-password'}
                    className='ml-auto inline-block text-sm text-blue-600 hover:underline'
                  >
                    Forgot your password?
                  </Link>
                </div>
                <FormControl>
                  <InputPassword
                    {...field}
                    disabled={isPending}
                    placeholder='Enter your password'
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
                Logging in...
              </>
            ) : (
              'Log in'
            )}
          </Button>
        </form>
      </Form>
    </CardWrapper>
  )
}
