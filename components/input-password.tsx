'use client'

import * as React from 'react'
import { Eye, EyeOff } from 'lucide-react'
import { Input, InputProps } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

export interface InputPasswordProps extends Omit<InputProps, 'type'> {
  showPasswordLabel?: string
  hidePasswordLabel?: string
}

const InputPassword = React.forwardRef<HTMLInputElement, InputPasswordProps>(
  (
    {
      className,
      showPasswordLabel = 'Show password',
      hidePasswordLabel = 'Hide password',
      ...props
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = React.useState(false)

    const togglePasswordVisibility = () => {
      setShowPassword(!showPassword)
    }

    return (
      <div className='relative'>
        <Input
          type={showPassword ? 'text' : 'password'}
          className={cn('pr-10', className)}
          ref={ref}
          {...props}
        />
        <Button
          type='button'
          variant='ghost'
          size='sm'
          className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
          onClick={togglePasswordVisibility}
        >
          {showPassword ? (
            <EyeOff className='h-4 w-4 text-gray-500' />
          ) : (
            <Eye className='h-4 w-4 text-gray-500' />
          )}
          <span className='sr-only'>
            {showPassword ? hidePasswordLabel : showPasswordLabel}
          </span>
        </Button>
      </div>
    )
  }
)

InputPassword.displayName = 'InputPassword'

export { InputPassword }
