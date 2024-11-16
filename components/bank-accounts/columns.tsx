import { Column } from '@/components/table/advanced-table'
import { BankAccount } from '@/types'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export const columns: Column<BankAccount>[] = [
  { key: 'account_number', label: 'Account Number', sortable: true },
  {
    key: 'bank.name',
    label: 'Bank',
    sortable: true,
    render: (account) => account.bank?.name || 'N/A'
  },
  {
    key: 'currency.code',
    label: 'Currency',
    sortable: true,
    render: (account) => account.currency?.code || 'N/A'
  },
  { key: 'account_type', label: 'Account Type', sortable: true },
  {
    key: 'balance',
    label: 'Balance',
    sortable: true,
    render: (account) => `${account.currency?.symbol || ''}${account.balance}`
  },
  {
    key: 'is_primary',
    label: 'Primary',
    sortable: true,
    render: account => (
        <Badge variant={account.is_primary ? 'success' : 'secondary'}>
          {account.is_primary ? 'Yes' : 'No'}
        </Badge>
    )
  },
  {
    key: 'created_at',
    label: 'Created At',
    sortable: true,
    render: account => format(new Date(account.created_at), 'PPpp')
  },
  {
    key: 'updated_at',
    label: 'Updated At',
    sortable: true,
    render: account => format(new Date(account.updated_at), 'PPpp')
  }
]