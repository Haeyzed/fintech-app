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
  isTrashed: boolean
  dateRange: { startDate: string; endDate: string }
}

export interface AdvancedTableProps<T> {
  columns: Column<T>[]
  data: T[] | null
  itemActions: (item: T, selectedItems: string[]) => React.ReactNode
  fallbackSortColumn?: NestedKeyOf<T>
  fallbackSortDirection?: 'asc' | 'desc'
  customButtons?: React.ReactNode
  onSearchChange?: (search: string) => void
  onSelectionChange?: (selectedItems: string[]) => void
  onTrashSwitchChange?: (isTrashed: boolean) => void
  onFetchData?: (tableState: TableState<T>) => Promise<void>
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
