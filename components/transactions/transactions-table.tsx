'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import * as z from 'zod'
import { toast } from 'sonner'
import { ArrowDownCircle, ArrowUpCircle, CheckCircle, Edit, Eye, Loader2, Trash2 } from 'lucide-react'
import AdvancedTable, { NestedKeyOf, TableState } from '@/components/table/advanced-table'
import {
    deleteTransaction,
    getBankAccounts,
    getPaymentMethods,
    getTransactions,
    initializeDeposit,
    initializeWithdrawal,
    verifyDeposit
} from '@/actions/api-actions'
import { Action, ItemActions } from '@/components/table/item-actions'
import { Button } from '@/components/ui/button'
import { BankAccount, PaymentMethod, Transaction } from '@/types'
import { columns } from './columns'
import { ResponsiveDrawer } from '@/components/responsive-drawer'
import { Input } from '@/components/ui/input'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { depositSchema, withdrawSchema } from '@/lib/zod'
import AlertDialog from '@/components/alert-dialog'
import SectionWrapper from '@/components/section-wrapper'
import { ComboboxItem, ResponsiveCombobox } from '@/components/responsive-combobox'
import { Textarea } from "@/components/ui/textarea"
import { pvtlaraEcho } from "@/lib/echo.config"
import { useAuth } from "@/hooks/use-auth"

type DepositFormValues = z.infer<typeof depositSchema>
type WithdrawFormValues = z.infer<typeof withdrawSchema>

export default function TransactionTable() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [transactions, setTransactions] = useState<Transaction[]>([])
    const [totalTransactions, setTotalTransactions] = useState(0)
    const [isLoading, setIsLoading] = useState(false)
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
    const [depositDrawerOpen, setDepositDrawerOpen] = useState(false)
    const [withdrawDrawerOpen, setWithdrawDrawerOpen] = useState(false)
    const [tableState, setTableState] = useState<TableState<Transaction>>({
        search: '',
        page: 1,
        perPage: 10,
        sortColumn: 'updated_at' as NestedKeyOf<Transaction>,
        sortDirection: 'desc',
        onlyDeleted: false,
        dateRange: { startDate: '', endDate: '' }
    })
    const [selectedItem, setSelectedItem] = useState<Transaction | null>(null)
    const [selectedItems, setSelectedItems] = useState<string[]>([])
    const [visibleColumns, setVisibleColumns] = useState<Set<NestedKeyOf<Transaction>>>(
        new Set(columns.map(col => col.key))
    )
    const [bankAccounts, setBankAccounts] = useState<ComboboxItem[]>([])
    const [paymentMethods, setPaymentMethods] = useState<ComboboxItem[]>([])
    const { session } = useAuth()

    const depositForm = useForm<DepositFormValues>({
        resolver: zodResolver(depositSchema),
        defaultValues: {
            amount: 0,
            payment_method_id: '',
            bank_account_id: '',
            description: ''
        }
    })

    const withdrawForm = useForm<WithdrawFormValues>({
        resolver: zodResolver(withdrawSchema),
        defaultValues: {
            amount: 0,
            payment_method_id: '',
            bank_account_id: '',
            reference_code: '',
            description: ''
        }
    })

    const handleFetchTransactions = useCallback(
        async (state: TableState<Transaction>) => {
            setIsLoading(true)
            try {
                const result = await getTransactions({
                    page: state.page,
                    per_page: state.perPage,
                    search: state.search,
                    sort_by: state.sortColumn as string,
                    sort_order: state.sortDirection as string,
                    only_deleted: state.onlyDeleted,
                    date_from: state.dateRange.startDate,
                    date_to: state.dateRange.endDate
                })
                setTransactions(result.data)
                setTotalTransactions(result.meta.total)
            } catch (error) {
                console.error('Failed to fetch transactions:', error)
                toast.error('Error', {
                    description: 'Failed to fetch transactions. Please try again.'
                })
            } finally {
                setIsLoading(false)
            }
        },
        []
    )

    const fetchBankAccounts = useCallback(async () => {
        try {
            const bankAccountsData = await getBankAccounts({
                page: '',
                per_page: 1000,
                search: '',
                sort_by: 'created_at' as NestedKeyOf<BankAccount>,
                sort_order: 'asc',
                only_deleted: false,
                start_date: '',
                end_date: '',
            })
            setBankAccounts(
                bankAccountsData.data.map((account: BankAccount) => ({
                    value: account.id,
                    label: `${account.account_number} - ${account.bank?.name} - ${account.currency?.symbol} ${parseFloat(account.balance).toFixed(2)}`
                }))
            )
        } catch (error) {
            console.error('Failed to fetch bank accounts:', error)
            toast.error('Error', {
                description: 'Failed to fetch bank accounts. Please try again.'
            })
        }
    }, [])

    const fetchPaymentMethods = useCallback(async () => {
        try {
            const paymentMethodsData = await getPaymentMethods({
                page: '',
                per_page: 1000,
                search: '',
                sort_by: 'type' as NestedKeyOf<PaymentMethod>,
                sort_order: 'asc',
                only_deleted: false,
                start_date: '',
                end_date: '',
            })
            setPaymentMethods(
                paymentMethodsData.data.map((method: PaymentMethod) => ({
                    value: method.id,
                    label: method.type
                }))
            )
        } catch (error) {
            console.error('Failed to fetch payment methods:', error)
            toast.error('Error', {
                description: error.message || 'Failed to fetch payment methods. Please try again.'
            })
        }
    }, [])

    useEffect(() => {
        handleFetchTransactions(tableState)
        fetchBankAccounts()
        fetchPaymentMethods()
    }, [handleFetchTransactions, fetchBankAccounts, fetchPaymentMethods, tableState])

    useEffect(() => {
        const reference = searchParams.get('reference') || searchParams.get('trxref')
        if (reference) {
            verifyTransaction(reference)
        }
    }, [searchParams])

    const verifyTransaction = async (reference: string) => {
        try {
            const result = await verifyDeposit({ reference })
            toast.success('Success', {
                description: result.message || 'Transaction verified successfully.'
            })
            handleFetchTransactions(tableState)
            router.replace('/transactions')
        } catch (error) {
            console.error('Error verifying transaction:', error)
            toast.error('Error', { description: error.message || 'Failed to verify transaction. Please try again.' })
        }
    }

    const handleTransactionActions = useCallback(
        (transaction: Transaction): React.ReactNode => {
            const actions: Action[] = [
                {
                    label: 'View',
                    icon: Eye,
                    onClick: () => {
                        console.log('View transaction:', transaction.id)
                    }
                },
                {
                    label: 'Edit',
                    icon: Edit,
                    onClick: () => {
                        setSelectedItem(transaction)
                        // Implement edit functionality if needed
                    }
                },
                {
                    label: 'Verify',
                    icon: CheckCircle,
                    onClick: () => {
                        verifyTransaction(transaction.reference)
                    }
                },
                {
                    label: 'Delete',
                    icon: Trash2,
                    onClick: () => {
                        setSelectedItem(transaction)
                        setDeleteDialogOpen(true)
                    }
                }
            ]

            return <ItemActions actions={actions} />
        },
        []
    )

    useEffect(() => {
        if (session) {
            const echo = pvtlaraEcho(session.user.accessToken)
            console.log('Echo instance created:', echo)

            echo.private(`App.Models.User.${session.user.id}`)
                .listen('TransactionEvent', (e: {
                    user_balance: number;
                    bank_account_balance: number;
                    transaction: Transaction
                }) => {
                    setTransactions(prevTransactions => {
                        if (!prevTransactions) return [e.transaction]
                        const index = prevTransactions.findIndex(t => t.id === e.transaction.id)
                        if (index !== -1) {
                            const updatedTransactions = [...prevTransactions]
                            updatedTransactions[index] = e.transaction
                            return updatedTransactions
                        } else {
                            return [e.transaction, ...prevTransactions]
                        }
                    })

                    toast.success('Transaction Updated', {
                        description: `${e.transaction.type} of ${e.transaction.amount} has been ${e.transaction.status}`
                    })
                })

            return () => {
                echo.leave(`App.Models.User.${session.user.id}`)
            }
        }
    }, [session])

    const onDepositSubmit = async (values: DepositFormValues) => {
        try {
            const result = await initializeDeposit(values)
            toast.success('Success', {
                description: result.message
            })
            window.open(result.data.paystack.authorization_url, '_blank')
            toast.success('Success', {
                description: result.message || 'Deposit initiated successfully.'
            })
            setDepositDrawerOpen(false)
        } catch (error) {
            console.error('Error initializing deposit:', error)
            toast.error('Error', { description: error.message || 'Failed to initialize deposit. Please try again.' })
        }
    }

    const onWithdrawSubmit = async (values: WithdrawFormValues) => {
        try {
            const result = await initializeWithdrawal(values)
            toast.success('Success', {
                description: result.message || 'Withdrawal initiated successfully.'
            })
            handleFetchTransactions(tableState)
            setWithdrawDrawerOpen(false)
        } catch (error) {
            console.error('Error initiating withdrawal:', error)
            toast.error('Error', { description: error.message || 'Failed to initiate withdrawal. Please try again.' })
        }
    }

    const handleDeleteTransaction = async () => {
        if (!selectedItem) return
        try {
            const result = await deleteTransaction(selectedItem.id)
            toast.success('Success', {
                description: result.message || 'Transaction deleted successfully.'
            })
            handleFetchTransactions(tableState)
        } catch (error) {
            console.error('Error deleting transaction:', error)
            toast.error('Failed to delete transaction. Please try again.')
        } finally {
            setDeleteDialogOpen(false)
            setSelectedItem(null)
        }
    }

    return (
        <SectionWrapper
            title="Transactions"
            description="Manage and view all transactions, including deposits and withdrawals."
            totalItems={totalTransactions}
        >
            <div className="mb-4 flex space-x-2">
                <Button onClick={() => setDepositDrawerOpen(true)}>
                    <ArrowUpCircle className="mr-2 h-4 w-4" />
                    Deposit
                </Button>
                <Button onClick={() => setWithdrawDrawerOpen(true)}>
                    <ArrowDownCircle className="mr-2 h-4 w-4" />
                    Withdraw
                </Button>
            </div>
            <AdvancedTable
                columns={columns}
                data={transactions}
                itemActions={handleTransactionActions}
                tableState={tableState}
                setTableState={setTableState}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                isLoading={isLoading}
                totalItems={totalTransactions}
                fallbackSortColumn="created_at"
                fallbackSortDirection="desc"
                enableSearch={true}
                enableTrash={true}
                enableColumnVisibility={true}
                enableDateRange={true}
                enablePerPage={true}
                enableSort={true}
            />
            <ResponsiveDrawer
                open={depositDrawerOpen}
                onOpenChange={setDepositDrawerOpen}
                title="Deposit Funds"
                description="Enter the details for your deposit."
                content={
                    <Form {...depositForm}>
                        <form onSubmit={depositForm.handleSubmit(onDepositSubmit)} className="space-y-4">
                            <FormField
                                control={depositForm.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input
                                                {...field}
                                                type="number"
                                                step="0.01"
                                                onChange={e => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={depositForm.control}
                                name="payment_method_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Method</FormLabel>
                                        <FormControl>
                                            <ResponsiveCombobox
                                                items={paymentMethods}
                                                placeholder="Select payment method"
                                                value={field.value}
                                                onChange={value => field.onChange(value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={depositForm.control}
                                name="bank_account_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank Account</FormLabel>
                                        <FormControl>
                                            <ResponsiveCombobox
                                                items={bankAccounts}
                                                placeholder="Select bank account"
                                                value={field.value}
                                                onChange={value => field.onChange(value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={depositForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={depositForm.formState.isSubmitting}>
                                {depositForm.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Initializing...
                                    </>
                                ) : (
                                    'Initialize Deposit'
                                )}
                            </Button>
                        </form>
                    </Form>
                }
            />
            <ResponsiveDrawer
                open={withdrawDrawerOpen}
                onOpenChange={setWithdrawDrawerOpen}
                title="Withdraw Funds"
                description="Enter the details for your withdrawal."
                content={
                    <Form {...withdrawForm}>
                        <form onSubmit={withdrawForm.handleSubmit(onWithdrawSubmit)} className="space-y-4">
                            <FormField
                                control={withdrawForm.control}
                                name="amount"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Amount</FormLabel>
                                        <FormControl>
                                            <Input {...field}
                                                   type="number"
                                                   step="0.01"
                                                   onChange={e => field.onChange(parseFloat(e.target.value))}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={withdrawForm.control}
                                name="payment_method_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Payment Method</FormLabel>
                                        <FormControl>
                                            <ResponsiveCombobox
                                                items={paymentMethods}
                                                placeholder="Select payment method"
                                                value={field.value}
                                                onChange={value => field.onChange(value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={withdrawForm.control}
                                name="bank_account_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Bank Account</FormLabel>
                                        <FormControl>
                                            <ResponsiveCombobox
                                                items={bankAccounts}
                                                placeholder="Select bank account"
                                                value={field.value}
                                                onChange={value => field.onChange(value)}
                                            />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={withdrawForm.control}
                                name="reference_code"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reference Code</FormLabel>
                                        <FormControl>
                                            <Input {...field} disabled={true} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={withdrawForm.control}
                                name="description"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Description</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={withdrawForm.formState.isSubmitting}>
                                {withdrawForm.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                                        Initializing...
                                    </>
                                ) : (
                                    'Initialize Withdrawal'
                                )}
                            </Button>
                        </form>
                    </Form>
                }
            />
            <AlertDialog
                isOpen={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteTransaction}
                title="Delete Transaction"
                description="Are you sure you want to delete this transaction? This action cannot be undone."
                confirmText="Delete"
            />
        </SectionWrapper>
    )
}