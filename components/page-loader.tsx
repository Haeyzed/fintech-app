import { Loader2 } from 'lucide-react'

export default function PageLoader({ text = 'Loading...' }: { text?: string }) {
  return (
    <div className='flex min-h-screen flex-col items-center justify-center bg-background'>
      <Loader2 className='h-9 w-9 animate-spin text-primary' />
      <p className='text-md mt-4 font-medium text-muted-foreground'>{text}</p>
    </div>
  )
}
