import * as React from 'react'
import { Check, ChevronsUpDown, X } from 'lucide-react'

import { useMediaQuery } from '@/hooks/use-media-query'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList
} from '@/components/ui/command'
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer'
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover'
import { Badge } from '@/components/ui/badge'

export interface ComboboxItem {
  value: string
  label: string
}

interface ResponsiveComboboxProps {
  items: ComboboxItem[]
  placeholder?: string
  emptyText?: string
  multiple?: boolean
  onChange: (value: string | string[]) => void
  value: string | string[]
  className?: string
}

export function ResponsiveCombobox({
  items,
  placeholder = 'Select item...',
  emptyText = 'No items found.',
  multiple = false,
  onChange,
  value,
  className
}: ResponsiveComboboxProps) {
  const [open, setOpen] = React.useState(false)
  const isDesktop = useMediaQuery('(min-width: 768px)')

  const handleSelect = (currentValue: string) => {
    if (multiple) {
      const newValue = Array.isArray(value) ? value : []
      if (newValue.includes(currentValue)) {
        onChange(newValue.filter(v => v !== currentValue))
      } else {
        onChange([...newValue, currentValue])
      }
    } else {
      onChange(currentValue)
      setOpen(false)
    }
  }

  const handleRemove = (valueToRemove: string) => {
    if (multiple) {
      onChange((value as string[]).filter(v => v !== valueToRemove))
    } else {
      onChange('')
    }
  }

  const selectedItems = React.useMemo(() => {
    if (Array.isArray(value)) {
      return value.map(
        v => items.find(item => item.value === v) || { value: v, label: v }
      )
    }
    const selectedItem = items.find(item => item.value === value)
    return selectedItem ? [selectedItem] : []
  }, [value, items])

  const ComboboxContent = (
    <Command>
      <CommandInput placeholder={`Filter ${placeholder.toLowerCase()}...`} />
      <CommandList>
        <CommandEmpty>{emptyText}</CommandEmpty>
        <CommandGroup>
          {items.map(item => (
            <CommandItem
              key={item.value}
              value={item.value}
              onSelect={() => handleSelect(item.value)}
            >
              <Check
                className={cn(
                  'mr-2 h-4 w-4',
                  (
                    Array.isArray(value)
                      ? value.includes(item.value)
                      : value === item.value
                  )
                    ? 'opacity-100'
                    : 'opacity-0'
                )}
              />
              {item.label}
            </CommandItem>
          ))}
        </CommandGroup>
      </CommandList>
    </Command>
  )

  const renderSelectedItems = () => {
    if (!multiple) {
      return <span>{selectedItems[0]?.label || placeholder}</span>
    }

    return (
      <div className='flex flex-wrap gap-1 overflow-hidden'>
        {selectedItems.length > 0 ? (
          selectedItems.map(item => (
            <Badge key={item.value} variant='secondary' className='mr-1'>
              {item.label}
              <button
                className='ml-1 rounded-full outline-none ring-offset-background focus:ring-2 focus:ring-ring focus:ring-offset-2'
                onKeyDown={e => {
                  if (e.key === 'Enter') {
                    handleRemove(item.value)
                  }
                }}
                onMouseDown={e => {
                  e.preventDefault()
                  e.stopPropagation()
                }}
                onClick={() => handleRemove(item.value)}
              >
                <X className='h-3 w-3 text-muted-foreground hover:text-foreground' />
                <span className='sr-only'>Remove {item.label}</span>
              </button>
            </Badge>
          ))
        ) : (
          <span>{placeholder}</span>
        )}
      </div>
    )
  }

  const triggerContent = (
    <Button
      variant='outline'
      role='combobox'
      aria-expanded={open}
      className={cn('h-auto min-h-[2.5rem] w-full justify-between', className)}
    >
      {renderSelectedItems()}
      <ChevronsUpDown className='ml-2 h-4 w-4 shrink-0 opacity-50' />
    </Button>
  )

  if (isDesktop) {
    return (
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>{triggerContent}</PopoverTrigger>
        <PopoverContent className='w-[200px] p-0' align='start'>
          {ComboboxContent}
        </PopoverContent>
      </Popover>
    )
  }

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{triggerContent}</DrawerTrigger>
      <DrawerContent>
        <div className='mt-4 border-t'>{ComboboxContent}</div>
      </DrawerContent>
    </Drawer>
  )
}
