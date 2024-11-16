import { Column } from '@/components/table/advanced-table'
import { Transaction } from '@/types'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'

export const columns: Column<Transaction>[] = [
  { key: 'reference', label: 'Reference', sortable: true },
  {
    key: 'type',
    label: 'Type',
    sortable: true,
    render: (transaction: Transaction) => (
        <Badge
            variant={transaction.type === 'deposit' ? 'success' : 'destructive'}
        >
          {transaction.type || 'N/A'}
        </Badge>
    )
  },
  {
    key: 'amount',
    label: 'Amount',
    sortable: true,
    render: (transaction: Transaction) =>
        transaction.amount
            ? `${transaction.bank_account?.bank?.currency?.symbol || ''} ${parseFloat(transaction.amount).toFixed(2)}`
            : 'N/A'
  },
  {
    key: 'start_balance',
    label: 'Start Balance',
    sortable: true,
    render: (transaction: Transaction) =>
        transaction.start_balance
            ? `${transaction.bank_account?.bank?.currency?.symbol || ''} ${parseFloat(transaction.start_balance).toFixed(2)}`
            : 'N/A'
  },
  {
    key: 'end_balance',
    label: 'End Balance',
    sortable: true,
    render: (transaction: Transaction) =>
        transaction.end_balance
            ? `${transaction.bank_account?.bank?.currency?.symbol || ''} ${parseFloat(transaction.end_balance).toFixed(2)}`
            : 'N/A'
  },
  { key: 'description', label: 'Description', sortable: true },
  {
    key: 'status',
    label: 'Status',
    sortable: true,
    render: (transaction: Transaction) => (
        <Badge
            variant={
              transaction.status === 'completed'
                  ? 'success'
                  : transaction.status === 'failed'
                      ? 'destructive'
                      : 'default'
            }
        >
          {transaction.status || 'N/A'}
        </Badge>
    )
  },
  {
    key: 'bank_account.account_number',
    label: 'Bank Account',
    sortable: true,
    render: (transaction) => transaction.bank_account?.account_number || 'N/A'
  },
  {
    key: 'payment_method.type',
    label: 'Payment Method',
    sortable: true,
    render: (transaction) => transaction.payment_method?.type || 'N/A'
  },
  {
    key: 'bank_account.account_type',
    label: 'Account Type',
    sortable: true,
    render: (transaction: Transaction) => transaction.bank_account?.account_type || 'N/A'
  },
  {
    key: 'created_at',
    label: 'Created At',
    sortable: true,
    render: transaction => format(new Date(transaction.created_at), 'PPpp')
  },
  {
    key: 'updated_at',
    label: 'Updated At',
    sortable: true,
    render: transaction => format(new Date(transaction.updated_at), 'PPpp')
  }
]