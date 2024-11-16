import React from 'react'
import { FcGoogle } from 'react-icons/fc'
import { FaFacebook, FaGithub, FaTwitter } from 'react-icons/fa'
import { Button } from '@/components/ui/button'

interface SocialProps {
  onSocialLogin: (provider: string) => void
  loading?: boolean
}

export const Social = ({ onSocialLogin, loading = false }: SocialProps) => {
  return (
    <div className='flex w-full flex-col items-center gap-2'>
      <p className='text-center text-sm text-gray-600'>Or login with</p>
      <div className='flex gap-x-2'>
        <Button
          variant='outline'
          size='icon'
          onClick={() => onSocialLogin('google')}
          disabled={loading}
        >
          <FcGoogle className='h-5 w-5' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => onSocialLogin('facebook')}
          disabled={loading}
        >
          <FaFacebook className='h-5 w-5 text-blue-600' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => onSocialLogin('twitter')}
          disabled={loading}
        >
          <FaTwitter className='h-5 w-5 text-blue-400' />
        </Button>
        <Button
          variant='outline'
          size='icon'
          onClick={() => onSocialLogin('github')}
          disabled={loading}
        >
          <FaGithub className='h-5 w-5 text-gray-800' />
        </Button>
      </div>
    </div>
  )
}
