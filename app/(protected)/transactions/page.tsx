import PageContainer from '@/components/page-container';
import TransactionTable from "@/components/transactions/transactions-table";

export const metadata = {
    title: 'Transactions'
};

export default function OAuthClientManagement() {
    return (
        <PageContainer scrollable>
            <div className='space-y-2'>
                <TransactionTable />
            </div>
        </PageContainer>
    )
}
