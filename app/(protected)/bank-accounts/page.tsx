import BankAccountTable from '@/components/bank-accounts/bank-accounts-table';
import PageContainer from '@/components/page-container';

export const metadata = {
  title: 'Bank Accounts'
};

export default function OAuthClientManagement() {
  return (
    <PageContainer scrollable>
      <div className='space-y-2'>
        <BankAccountTable />
      </div>
    </PageContainer>
  )
}
