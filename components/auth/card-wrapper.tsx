import React, { useState } from 'react'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle
} from '@/components/ui/card'
import { Social } from '@/components/auth/social'
import { BackButton } from '@/components/auth/back-button'

interface CardWrapperProps {
  children: React.ReactNode
  headerTitle: string
  headerDescription: string
  backButtonLabel: string
  backButtonHref: string
  enableSocial: boolean
}

export const CardWrapper: React.FC<CardWrapperProps> = ({
  children,
  headerTitle,
  headerDescription,
  backButtonLabel,
  backButtonHref,
  enableSocial
}) => {
  const [loading, setLoading] = useState(false)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const handleSocialLogin = (provider: string) => {
    setLoading(true)
    // Add social index logic here (e.g., API call or redirect)
    setTimeout(() => setLoading(false), 1000)
  }

  return (
    <Card className='w-[350px]'>
      <CardHeader>
        <CardTitle>{headerTitle}</CardTitle>
        <CardDescription>{headerDescription}</CardDescription>
      </CardHeader>
      <CardContent>{children}</CardContent>
      <CardFooter className='flex flex-col items-center gap-2'>
        {enableSocial && (
          <Social onSocialLogin={handleSocialLogin} loading={loading} />
        )}
        <BackButton label={backButtonLabel} href={backButtonHref} />
      </CardFooter>
    </Card>
  )
}
