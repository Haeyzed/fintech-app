import React, { useRef, useState } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { X } from 'lucide-react'

interface FileInputProps {
  onChange: (file: File | null) => void
  value?: File | null
  accept?: string
  label?: string
}

export function FileInput({
  onChange,
  value,
  accept,
  label = 'Upload file'
}: FileInputProps) {
  const inputRef = useRef<HTMLInputElement>(null)
  const [preview, setPreview] = useState<string | null>(null)

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] || null
    onChange(file)
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader()
      reader.onloadend = () => {
        setPreview(reader.result as string)
      }
      reader.readAsDataURL(file)
    } else {
      setPreview(null)
    }
  }

  const handleRemove = () => {
    onChange(null)
    setPreview(null)
    if (inputRef.current) {
      inputRef.current.value = ''
    }
  }

  return (
    <div className='space-y-2'>
      <Label htmlFor='file-input'>{label}</Label>
      <div className='flex items-center space-x-2'>
        <Input
          id='file-input'
          type='file'
          onChange={handleFileChange}
          accept={accept}
          ref={inputRef}
          className='hidden'
        />
        <Button type='button' onClick={() => inputRef.current?.click()}>
          Choose File
        </Button>
        {(value || preview) && (
          <Button
            type='button'
            variant='outline'
            size='icon'
            onClick={handleRemove}
          >
            <X className='h-4 w-4' />
          </Button>
        )}
      </div>
      {preview && (
        <div className='mt-2'>
          <img
            src={preview}
            alt='Preview'
            className='h-auto max-h-40 max-w-full rounded'
          />
        </div>
      )}
      {value && !preview && (
        <p className='mt-2 text-sm text-muted-foreground'>{value.name}</p>
      )}
    </div>
  )
}
