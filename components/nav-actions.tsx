'use client'

import * as React from 'react'
import { ModeToggle } from '@/components/theme/mode-toggle'

export function NavActions() {
  const [isOpen, setIsOpen] = React.useState(false)

  React.useEffect(() => {
    setIsOpen(true)
  }, [])

  return (
    <div className='flex items-center gap-2 text-sm'>
      {/*<div className="hidden font-medium text-muted-foreground md:inline-block">*/}
      {/*  Edit Oct 08*/}
      {/*</div>*/}
      {/*<Button variant="ghost" size="icon" className="h-7 w-7">*/}
      {/*  <Star />*/}
      {/*</Button>*/}
      <ModeToggle />
    </div>
  )
}
