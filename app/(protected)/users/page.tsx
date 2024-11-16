import UserTable from '@/components/users/users-table'
import PageContainer from '@/components/page-container'

export const metadata = {
  title: 'Users'
};

export default function UserManagement() {
  return (
    <PageContainer scrollable>
      <div className='space-y-2'>
        <UserTable />
      </div>
    </PageContainer>
  )
}
