import React from 'react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { LucideIcon } from 'lucide-react'

interface BaseAction {
  label: string
  icon?: LucideIcon
  disabled?: boolean
  separator?: boolean
}

interface ActionWithOnClick extends BaseAction {
  onClick: () => void
  subItems?: never
}

interface ActionWithSubItems extends BaseAction {
  onClick?: never
  subItems: ActionWithOnClick[]
}

export type Action = ActionWithOnClick | ActionWithSubItems

interface ItemActionsProps {
  actions: Action[]
}

export function ItemActions({ actions }: ItemActionsProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant='ghost' className='h-8 w-8 p-0'>
          <span className='sr-only'>Open menu</span>
          <MoreHorizontal className='h-4 w-4' />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end'>
        {actions.map((action, index) => (
          <React.Fragment key={index}>
            {action.separator && index > 0 && <DropdownMenuSeparator />}
            {action.subItems ? (
              <DropdownMenuSub>
                <DropdownMenuSubTrigger>
                  {action.icon && <action.icon className='mr-2 h-4 w-4' />}
                  {action.label}
                </DropdownMenuSubTrigger>
                <DropdownMenuSubContent>
                  {action.subItems.map((subItem, subIndex) => (
                    <React.Fragment key={`${index}-${subIndex}`}>
                      {subItem.separator && subIndex > 0 && (
                        <DropdownMenuSeparator />
                      )}
                      <DropdownMenuItem
                        onClick={subItem.onClick}
                        disabled={subItem.disabled}
                      >
                        {subItem.icon && (
                          <subItem.icon className='mr-2 h-4 w-4' />
                        )}
                        {subItem.label}
                      </DropdownMenuItem>
                    </React.Fragment>
                  ))}
                </DropdownMenuSubContent>
              </DropdownMenuSub>
            ) : (
              <DropdownMenuItem
                onClick={action.onClick}
                disabled={action.disabled}
              >
                {action.icon && <action.icon className='mr-2 h-4 w-4' />}
                {action.label}
              </DropdownMenuItem>
            )}
          </React.Fragment>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
