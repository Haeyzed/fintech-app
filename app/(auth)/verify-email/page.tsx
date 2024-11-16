// verify-email.tsx
'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'
import { CardWrapper } from '@/components/auth/card-wrapper'
import { toast } from 'sonner'
import { verifyEmail } from '@/actions/api-actions'

export default function VerifyEmail() {
    const [isVerifying, setIsVerifying] = useState(true)
    const [verificationSuccess, setVerificationSuccess] = useState(false)
    const router = useRouter()
    const searchParams = useSearchParams()

    useEffect(() => {
        const verifyEmailToken = async () => {
            const verifyUrl = searchParams.get('url')

            if (!verifyUrl) {
                toast.error('Error', { description: 'Invalid verification link' })
                setIsVerifying(false)
                return
            }

            try {
                const decodedUrl = decodeURIComponent(verifyUrl)
                console.log("Decoded URL:", decodedUrl)

                const url = new URL(decodedUrl)
                console.log("Parsed URL:", url)

                const pathParts = url.pathname.split('/')
                console.log("Path parts:", pathParts)

                const id = pathParts[pathParts.length - 2]
                const hash = pathParts[pathParts.length - 1]
                const expires = url.searchParams.get('expires')
                const signature = url.searchParams.get('signature')

                console.log("Extracted ID:", id)
                console.log("Extracted Hash:", hash)
                console.log("Extracted Expires:", expires)
                console.log("Extracted Signature:", signature)

                if (!id || !hash || !expires || !signature) {
                    throw new Error('Missing required parameters')
                }

                const result = await verifyEmail(id, hash, expires, signature)
                console.log("Verification result:", result)
                setVerificationSuccess(true)
                toast.success('Success', {
                    description: result.message || 'Email verified successfully'
                })
            } catch (error) {
                console.error('Verification error:', error)
                toast.error('Error', {
                    description: error.message || 'An unexpected error occurred during verification'
                })
            } finally {
                setIsVerifying(false)
            }
        }

        verifyEmailToken()
    }, [searchParams])

    const handleContinue = () => {
        router.push('/dashboard')
    }

    return (
        <CardWrapper
            headerTitle='Verify Email'
            headerDescription='Confirming your email address'
            backButtonLabel='Back to login'
            backButtonHref='/login'
            enableSocial={false}>
            <div className='flex flex-col items-center justify-center space-y-4'>
                {isVerifying ? (
                    <div className='flex flex-col items-center space-y-4'>
                        <Loader2 className='h-8 w-8 animate-spin text-primary'/>
                        <p className='text-sm text-muted-foreground'>
                            Verifying your email...
                        </p>
                    </div>
                ) : verificationSuccess ? (
                    <>
                        <p className='text-center text-sm text-muted-foreground'>
                            Your email has been successfully verified.
                        </p>
                        <Button onClick={handleContinue} className='w-full'>
                            Continue to Dashboard
                        </Button>
                    </>
                ) : (
                    <p className='text-center text-sm text-muted-foreground'>
                        Email verification failed. Please try again or contact support.
                    </p>
                )}
            </div>
        </CardWrapper>
    )
}