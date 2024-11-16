import { Column } from '@/components/table/advanced-table'
import { User } from '@/types'
import { CheckCircle, XCircle } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { format } from 'date-fns'

export const columns: Column<User>[] = [
  {
    key: 'profile_image',
    label: 'Avatar',
    render: user => (
      <Avatar>
        <AvatarImage src={user.profile_image} alt={user.name} />
        <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
      </Avatar>
    )
  },
  { key: 'name', label: 'Name', sortable: true },
  { key: 'email', label: 'Email', sortable: true },
  { key: 'username', label: 'Username', sortable: true },
  { key: 'phone', label: 'Phone', sortable: true },
  { key: 'role', label: 'Role', sortable: true },
  {
    key: 'email_verified_at',
    label: 'Verified',
    render: user =>
      user.email_verified_at ? (
        <CheckCircle className='text-green-500' />
      ) : (
        <XCircle className='text-red-500' />
      )
  },
  {
    key: 'last_login_at',
    label: 'Last Login',
    render: user =>
      user.last_login_at
        ? format(new Date(user.last_login_at), 'PPpp')
        : 'Never'
  },
  { key: 'login_count', label: 'Login Count' },
  {
    key: 'google2fa_enabled',
    label: '2FA',
    render: user =>
      user.google2fa_enabled ? (
        <CheckCircle className='text-green-500' />
      ) : (
        <XCircle className='text-red-500' />
      )
  },
  {
    key: 'created_at',
    label: 'Created At',
    render: user => format(new Date(user.created_at), 'PPpp')
  },
  {
    key: 'updated_at',
    label: 'Updated At',
    sortable: true,
    render: user => format(new Date(user.updated_at), 'PPpp')
  }
]
