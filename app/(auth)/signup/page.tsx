'use client'

import React, { useTransition } from 'react'
import { useRouter } from 'next/navigation'
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
import { signUpSchema } from '@/lib/zod'
import { toast } from 'sonner'
import { signup } from '@/actions/api-actions'
import { PhoneInput } from '@/components/phone-input'
import Image from 'next/image'
import {
    ComboboxItem,
    ResponsiveCombobox
} from '@/components/responsive-combobox'

type SignUpFormValues = z.infer<typeof signUpSchema>

const roles: ComboboxItem[] = [
    { value: 'admin', label: 'Admin' },
    { value: 'user', label: 'User' }
]

export default function SignUpForm() {
    const [isPending, startTransition] = useTransition()
    const router = useRouter()

    const form = useForm<SignUpFormValues>({
        resolver: zodResolver(signUpSchema),
        defaultValues: {
            name: '',
            email: '',
            username: '',
            phone: '',
            role: '',
            password: '',
            password_confirmation: ''
        }
    })

    const onSubmit = (values: SignUpFormValues) => {
        startTransition(async () => {
            try {
                const formData = new FormData()
                Object.entries(values).forEach(([key, value]) => {
                    if (value instanceof File) {
                        formData.append(key, value)
                    } else if (typeof value === 'string') {
                        formData.append(key, value)
                    }
                })

                const result = await signup(formData)
                if (result.success) {
                    toast.success('Success', {
                        description: result.message
                    })
                    router.push('/login')
                } else {
                    toast.error('Error', {
                        description: result.message
                    })
                }
            } catch (error) {
                console.error(error)
                toast.error('Error', {
                    description: error.message || 'An unexpected error occurred'
                })
            }
        })
    }

    return (
        <CardWrapper
            headerTitle='Sign Up'
            headerDescription='Enter your credentials to create an account'
            backButtonLabel='Already have an account? Log in'
            backButtonHref='/login'
            enableSocial
        >
            <Form {...form}>
                <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField
                            control={form.control}
                            name='name'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Name</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder='Enter your name'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
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
                                            type='email'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='username'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Username</FormLabel>
                                    <FormControl>
                                        <Input
                                            {...field}
                                            disabled={isPending}
                                            placeholder='Enter your username'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name='phone'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Phone</FormLabel>
                                    <FormControl>
                                        <PhoneInput
                                            {...field}
                                            disabled={isPending}
                                            placeholder='Enter your phone'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name='role'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Role</FormLabel>
                                <FormControl>
                                    <ResponsiveCombobox
                                        items={roles}
                                        placeholder='Select a role'
                                        value={field.value}
                                        onChange={value => field.onChange(value)}
                                    />
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
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
                        <FormField
                            control={form.control}
                            name='password_confirmation'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm Password</FormLabel>
                                    <FormControl>
                                        <InputPassword
                                            {...field}
                                            disabled={isPending}
                                            placeholder='Confirm your password'
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                    </div>
                    <FormField
                        control={form.control}
                        name='profile_image'
                        render={({ field: { value, onChange, ...field } }) => (
                            <FormItem>
                                <FormLabel>Profile Image</FormLabel>
                                <FormControl>
                                    <div className='flex items-center space-x-4'>
                                        {value && (
                                            <Image
                                                src={URL.createObjectURL(value)}
                                                alt='Profile preview'
                                                width={64}
                                                height={64}
                                                className='rounded-full object-cover'
                                            />
                                        )}
                                        <Input
                                            type='file'
                                            accept='image/jpeg,image/png'
                                            onChange={e => {
                                                const file = e.target.files?.[0]
                                                if (file) onChange(file)
                                            }}
                                            {...field}
                                            disabled={isPending}
                                            className='flex-1'
                                        />
                                    </div>
                                </FormControl>
                                <FormMessage />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' disabled={isPending} className='w-full'>
                        {isPending ? (
                            <>
                                <Loader2 className='mr-2 h-4 w-4 animate-spin' />
                                Signing up...
                            </>
                        ) : (
                            'Sign up'
                        )}
                    </Button>
                </form>
            </Form>
        </CardWrapper>
    )
}