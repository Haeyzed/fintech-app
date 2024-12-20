import React, { useCallback } from 'react'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { Skeleton } from '@/components/ui/skeleton'
import {
  ArrowDownIcon,
  ArrowUpIcon,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Checkbox } from '@/components/ui/checkbox'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import {
  CaretSortIcon,
  Cross2Icon,
  EyeNoneIcon,
  MixerHorizontalIcon
} from '@radix-ui/react-icons'
import DateRangePicker from '@/components/date-range-picker'
import { ScrollArea, ScrollBar } from '@/components/ui/scroll-area'
import DateRangePickerWithTime from '@/components/date-range-picker-with-time';

export type NestedKeyOf<T> = {
  [K in keyof T & (string | number)]: T[K] extends object
    ? `${K}` | `${K}.${NestedKeyOf<T[K]>}`
    : `${K}`
}[keyof T & (string | number)]

export interface Column<T> {
  key: NestedKeyOf<T>
  label: string
  sortable?: boolean
  render?: (item: T) => React.ReactNode
}

export interface TableState<T> {
  search: string
  page: number
  perPage: number
  sortColumn: NestedKeyOf<T> | null
  sortDirection: 'asc' | 'desc' | null
  onlyDeleted: boolean
  dateRange: { startDate: string; endDate: string }
}

interface AdvancedTableProps<T> {
  columns: Column<T>[]
  data: T[] | null
  itemActions: (item: T, selectedItems: string[]) => React.ReactNode
  tableState: TableState<T>
  setTableState: React.Dispatch<React.SetStateAction<TableState<T>>>
  selectedItems: string[]
  setSelectedItems: React.Dispatch<React.SetStateAction<string[]>>
  visibleColumns: Set<NestedKeyOf<T>>
  setVisibleColumns: React.Dispatch<React.SetStateAction<Set<NestedKeyOf<T>>>>
  fallbackSortColumn?: NestedKeyOf<T>
  fallbackSortDirection?: 'asc' | 'desc'
  customButtons?: React.ReactNode
  onSearchChange?: (search: string) => void
  onSelectionChange?: (selectedItems: string[]) => void
  onTrashSwitchChange?: (isTrashed: boolean) => void
  isLoading?: boolean
  totalItems?: number
  enableSearch?: boolean
  enableTrash?: boolean
  enableColumnVisibility?: boolean
  enableDateRange?: boolean
  enablePerPage?: boolean
  enableSort?: boolean
  isFiltered?: boolean
}

const getNestedValue = <T,>(obj: T, path: string): unknown => {
  return path.split('.').reduce((acc: unknown, part: string) => {
    if (acc && typeof acc === 'object' && part in acc) {
      return (acc as Record<string, unknown>)[part]
    }
    return undefined
  }, obj)
}

export default function AdvancedTable<T extends { id: string | number }>({
  columns,
  data,
  itemActions,
  tableState,
  setTableState,
  selectedItems,
  setSelectedItems,
  visibleColumns,
  setVisibleColumns,
  fallbackSortColumn,
  fallbackSortDirection = 'asc',
  customButtons,
  onSearchChange,
  onSelectionChange,
  onTrashSwitchChange,
  isLoading = false,
  totalItems = 0,
  enableSearch = true,
  enableTrash = true,
  enableColumnVisibility = true,
  enableDateRange = true,
  enablePerPage = true,
  enableSort = true,
  isFiltered = true
}: AdvancedTableProps<T>) {
  const updateTableState = useCallback(
    (newState: Partial<TableState<T>>) => {
      setTableState(prevState => {
        const updatedState = { ...prevState, ...newState }
        if (onSearchChange && 'search' in newState) {
          onSearchChange(updatedState.search)
        }
        return updatedState
      })
    },
    [setTableState, onSearchChange]
  )

  const handleSelectAll = useCallback(
    (checked: boolean) => {
      const newSelectedItems = checked
        ? data?.map(item => String(item.id)) || []
        : []
      setSelectedItems(newSelectedItems)
      onSelectionChange?.(newSelectedItems)
    },
    [data, setSelectedItems, onSelectionChange]
  )

  const handleSelectItem = useCallback(
    (id: string, checked: boolean) => {
      setSelectedItems(prev => {
        const newSelectedItems = checked
          ? [...prev, id]
          : prev.filter(item => item !== id)
        onSelectionChange?.(newSelectedItems)
        return newSelectedItems
      })
    },
    [setSelectedItems, onSelectionChange]
  )

  const toggleColumnVisibility = useCallback(
    (column: NestedKeyOf<T>) => {
      setVisibleColumns(prev => {
        const newSet = new Set(prev)
        if (newSet.has(column)) {
          newSet.delete(column)
        } else {
          newSet.add(column)
        }
        return newSet
      })
    },
    [setVisibleColumns]
  )

  const handleDateRangeChange = useCallback(
    (startDate: string, endDate: string) => {
      updateTableState({
        dateRange: { startDate, endDate },
        page: 1
      })
    },
    [updateTableState]
  )

  const handleTrashSwitch = useCallback(
    (checked: boolean) => {
      updateTableState({ onlyDeleted: checked, page: 1 })
      onTrashSwitchChange?.(checked)
    },
    [updateTableState, onTrashSwitchChange]
  )

  const handleSort = (column: NestedKeyOf<T>) => {
    if (!enableSort) return
    updateTableState({
      sortColumn: column as NestedKeyOf<T> | null,
      sortDirection:
        tableState.sortColumn === column && tableState.sortDirection === 'asc'
          ? 'desc'
          : 'asc',
      page: 1
    })
  }

  const getSortIcon = (column: NestedKeyOf<T>) => {
    if (column !== tableState.sortColumn)
      return <CaretSortIcon className='ml-2 h-4 w-4' aria-hidden='true' />
    if (tableState.sortDirection === 'asc')
      return <ArrowUpIcon className='ml-2 h-4 w-4' aria-hidden='true' />
    if (tableState.sortDirection === 'desc')
      return <ArrowDownIcon className='ml-2 h-4 w-4' aria-hidden='true' />
    return <CaretSortIcon className='ml-2 h-4 w-4' aria-hidden='true' />
  }

  const TableSkeleton = () => (
    <TableRow>
      {[...Array(columns.length + 2)].map((_, index) => (
        <TableCell key={index}>
          <Skeleton className='h-6 w-full rounded-lg bg-secondary' />
        </TableCell>
      ))}
    </TableRow>
  )

  const NoResultsMessage = () => (
    <TableRow>
      <TableCell colSpan={columns.length + 2} className='h-24 text-center'>
        No results found.
      </TableCell>
    </TableRow>
  )

  const handlePerPageChange = (perPage: number) => {
    updateTableState({ perPage, page: 1 })
  }

  return (
    <div className='w-full space-y-2'>
      <div className='flex flex-wrap items-center justify-between gap-4'>
        <div className='flex flex-wrap items-center gap-2'>{customButtons}</div>
        {enableDateRange && (
          <DateRangePickerWithTime
            onDateRangeChange={handleDateRangeChange}
            className='h-9 bg-card shadow-sm'
          />
        )}
      </div>
      <div className='flex w-full flex-col items-start justify-between gap-2 overflow-auto p-1 sm:flex-row sm:items-center'>
        <div className='flex w-full flex-col items-start gap-2 sm:flex-row sm:items-center'>
          {enableSearch && (
            <div className='w-full sm:w-auto'>
              <Input
                type='search'
                placeholder='Search...'
                value={tableState.search}
                onChange={e =>
                  updateTableState({ search: e.target.value, page: 1 })
                }
                className='h-9 w-full bg-card sm:w-[200px] lg:w-[300px]'
              />
            </div>
          )}
          <div className='flex flex-wrap items-center gap-4'>
            {enableTrash && (
              <div className='flex items-center space-x-2'>
                <Switch
                  id='isTrashed'
                  checked={tableState.onlyDeleted}
                  onCheckedChange={handleTrashSwitch}
                />
                <Label htmlFor='isTrashed'>Trashed</Label>
              </div>
            )}
          </div>
          {isFiltered && (
            <Button
              aria-label='Reset filters'
              variant='outline'
              className='h-9 bg-card px-2 lg:px-3'
              onClick={() => {
                updateTableState({
                  search: '',
                  page: 1,
                  sortColumn: fallbackSortColumn || null,
                  sortDirection: fallbackSortDirection,
                  onlyDeleted: false,
                  dateRange: { startDate: '', endDate: '' }
                })
              }}
            >
              Reset
              <Cross2Icon className='ml-2 size-4' aria-hidden='true' />
            </Button>
          )}
        </div>
        <div className='flex items-center gap-2'>
          {enableColumnVisibility && (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  aria-label='Toggle columns'
                  variant='outline'
                  size='sm'
                  className='h-9 bg-card'
                >
                  <MixerHorizontalIcon className='mr-2 size-4' />
                  View
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align='end' className='w-40'>
                <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {columns.map(column => (
                  <DropdownMenuCheckboxItem
                    key={column.key as string}
                    className='capitalize'
                    checked={visibleColumns.has(column.key)}
                    onCheckedChange={() => toggleColumnVisibility(column.key)}
                  >
                    <span className='truncate'>{column.label}</span>
                  </DropdownMenuCheckboxItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
      <ScrollArea className='grid h-[calc(80vh-220px)] rounded-md border bg-card md:h-[calc(90dvh-240px)]'>
        <Table className='relative'>
          <TableHeader>
            <TableRow>
              <TableHead className='w-[50px]'>
                <Checkbox
                  checked={
                    selectedItems.length === data?.length && data?.length > 0
                  }
                  onCheckedChange={checked =>
                    handleSelectAll(checked as boolean)
                  }
                  aria-label='Select all'
                />
              </TableHead>
              {columns
                .filter(col => visibleColumns.has(col.key))
                .map(column => (
                  <TableHead
                    key={column.key as string}
                    className='whitespace-nowrap'
                  >
                    {enableSort && column.sortable ? (
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button
                            variant='ghost'
                            size='sm'
                            className='-ml-3 h-8 data-[state=open]:bg-accent'
                          >
                            <span>{column.label}</span>
                            {getSortIcon(column.key)}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align='start'>
                          <DropdownMenuItem
                            onClick={() => handleSort(column.key)}
                          >
                            <ArrowUpIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                            Asc
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            onClick={() => handleSort(column.key)}
                          >
                            <ArrowDownIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                            Desc
                          </DropdownMenuItem>
                          {enableColumnVisibility && (
                            <DropdownMenuItem
                              onClick={() => toggleColumnVisibility(column.key)}
                            >
                              <EyeNoneIcon className='mr-2 h-3.5 w-3.5 text-muted-foreground/70' />
                              Hide
                            </DropdownMenuItem>
                          )}
                        </DropdownMenuContent>
                      </DropdownMenu>
                    ) : (
                      column.label
                    )}
                  </TableHead>
                ))}
              <TableHead className='sticky right-0 bg-card shadow-sm'></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {isLoading ? (
              [...Array(5)].map((_, index) => <TableSkeleton key={index} />)
            ) : data && data.length > 0 ? (
              data.map(item => (
                <TableRow
                  key={item.id}
                  data-state={
                    selectedItems.includes(item.id as string)
                      ? 'selected'
                      : undefined
                  }
                >
                  <TableCell>
                    <Checkbox
                      checked={selectedItems.includes(item.id as string)}
                      onCheckedChange={checked =>
                        handleSelectItem(item.id as string, checked as boolean)
                      }
                      aria-label={`Select ${item.id}`}
                    />
                  </TableCell>
                  {columns
                    .filter(col => visibleColumns.has(col.key))
                    .map(column => (
                      <TableCell key={column.key as string}>
                        {column.render
                          ? column.render(item)
                          : (getNestedValue(
                              item,
                              column.key as string
                            ) as React.ReactNode)}
                      </TableCell>
                    ))}
                  <TableCell className='sticky right-0 bg-card shadow-sm'>
                    {itemActions(item, selectedItems)}
                  </TableCell>
                </TableRow>
              ))
            ) : (
              <NoResultsMessage />
            )}
          </TableBody>
        </Table>
        <ScrollBar orientation='horizontal' />
      </ScrollArea>
      <div className='flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between'>
        <div className='flex-1 whitespace-nowrap text-sm text-muted-foreground'>
          {selectedItems.length} of {totalItems} row(s) selected.
        </div>
        <div className='flex flex-col items-center gap-4 sm:flex-row sm:gap-6 lg:gap-8'>
          {enablePerPage && (
            <div className='flex items-center space-x-2'>
              <p className='whitespace-nowrap text-sm font-medium'>
                Rows per page
              </p>
              <Select
                value={tableState.perPage.toString()}
                onValueChange={value => handlePerPageChange(Number(value))}
              >
                <SelectTrigger className='h-8 w-[4.5rem] bg-card'>
                  <SelectValue placeholder={tableState.perPage.toString()} />
                </SelectTrigger>
                <SelectContent>
                  {[5, 10, 20, 25, 50].map(value => (
                    <SelectItem key={value} value={value.toString()}>
                      {value}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}
          <div className='flex items-center justify-center text-sm font-medium'>
            Showing {(tableState.page - 1) * tableState.perPage + 1} to{' '}
            {Math.min(tableState.page * tableState.perPage, totalItems)} of{' '}
            {totalItems} entries
          </div>
          <div className='flex items-center space-x-2'>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() => updateTableState({ page: 1 })}
              disabled={tableState.page === 1}
              aria-label='Go to first page'
            >
              <ChevronsLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => updateTableState({ page: tableState.page - 1 })}
              disabled={tableState.page === 1}
              aria-label='Go to previous page'
            >
              <ChevronLeft className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='h-8 w-8 p-0'
              onClick={() => updateTableState({ page: tableState.page + 1 })}
              disabled={
                tableState.page === Math.ceil(totalItems / tableState.perPage)
              }
              aria-label='Go to next page'
            >
              <ChevronRight className='h-4 w-4' />
            </Button>
            <Button
              variant='outline'
              className='hidden h-8 w-8 p-0 lg:flex'
              onClick={() =>
                updateTableState({
                  page: Math.ceil(totalItems / tableState.perPage)
                })
              }
              disabled={
                tableState.page === Math.ceil(totalItems / tableState.perPage)
              }
              aria-label='Go to last page'
            >
              <ChevronsRight className='h-4 w-4' />
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
