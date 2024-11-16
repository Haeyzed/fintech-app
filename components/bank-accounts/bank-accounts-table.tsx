'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {toast} from 'sonner';
import {Edit, Eye, Loader2, PlusIcon, Trash2} from 'lucide-react';
import AdvancedTable, {
    NestedKeyOf,
    TableState
} from '@/components/table/advanced-table';
import {
    createBankAccount,
    deleteBankAccount,
    getBankAccounts,
    updateBankAccount,
    getBanks,
    getCurrencies
} from '@/actions/api-actions';
import {Action, ItemActions} from '@/components/table/item-actions';
import {Button} from '@/components/ui/button';
import {BankAccount, Bank, Currency} from '@/types';
import {columns} from './columns';
import {ResponsiveDrawer} from '@/components/responsive-drawer';
import {Input} from '@/components/ui/input';
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage
} from '@/components/ui/form';
import {bankAccountSchema} from '@/lib/zod';
import AlertDialog from '@/components/alert-dialog';
import SectionWrapper from '@/components/section-wrapper';
import {Switch} from '@/components/ui/switch';
import {ResponsiveCombobox, ComboboxItem} from '@/components/responsive-combobox';

type BankAccountFormValues = z.infer<typeof bankAccountSchema>

export default function BankAccountTable() {
    const [accounts, setAccounts] = useState<BankAccount[] | null>(null);
    const [totalAccounts, setTotalAccounts] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [accountDrawerOpen, setAccountDrawerOpen] = useState(false);
    const [tableState, setTableState] = useState<TableState<BankAccount>>({
        search: '',
        page: 1,
        perPage: 10,
        sortColumn: 'created_at' as NestedKeyOf<BankAccount>,
        sortDirection: 'desc',
        onlyDeleted: false,
        dateRange: {startDate: '', endDate: ''}
    });
    const [selectedItem, setSelectedItem] = useState<BankAccount | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<
        Set<NestedKeyOf<BankAccount>>
    >(new Set(columns.map(col => col.key)));
    const [banks, setBanks] = useState<ComboboxItem[]>([]);
    const [currencies, setCurrencies] = useState<ComboboxItem[]>([]);

    const accountTypes: ComboboxItem[] = [
        {value: 'savings', label: 'Savings'},
        {value: 'current', label: 'Current'},
        {value: 'business', label: 'Business'}
    ];

    const accountForm = useForm<BankAccountFormValues>({
        resolver: zodResolver(bankAccountSchema),
        defaultValues: {
            account_number: '',
            bank_id: '',
            currency_id: '',
            account_type: '',
            balance: '',
            is_primary: false
        }
    });

    const handleFetchAccounts = useCallback(
        async (state: TableState<BankAccount>) => {
            setIsLoading(true);
            try {
                const result = await getBankAccounts({
                    page: state.page,
                    per_page: state.perPage,
                    search: state.search,
                    sort_by: state.sortColumn as string,
                    sort_order: state.sortDirection as string,
                    only_deleted: state.onlyDeleted,
                    date_from: state.dateRange.startDate,
                    date_to: state.dateRange.endDate
                });
                setAccounts(result.data);
                setTotalAccounts(result.meta.total);
            } catch (error) {
                console.error('Failed to fetch bank accounts:', error);
                toast.error('Error', {
                    description: 'Failed to fetch bank accounts. Please try again.'
                });
            } finally {
                setIsLoading(false);
            }
        },
        []
    );

    const fetchBanks = useCallback(async () => {
        try {
            const banksData = await getBanks(
                {
                    page: '',
                    per_page: 1000,
                    search: '',
                    sort_by: 'name' as NestedKeyOf<Bank>,
                    sort_order: 'asc',
                    only_deleted: false,
                    start_date: '',
                    end_date: '',
                });
            setBanks(banksData.data.map((bank: Bank) => ({value: bank.id, label: bank.name})));
        } catch (error) {
            console.error('Failed to fetch banks:', error);
            toast.error('Error', {
                description: error.message || 'Failed to fetch banks. Please try again.'
            });
        }
    }, []);

    const fetchCurrencies = useCallback(async () => {
        try {
            const currenciesData = await getCurrencies(
                {
                    page: '',
                    per_page: 1000,
                    search: '',
                    sort_by: 'code' as NestedKeyOf<Currency>,
                    sort_order: 'asc',
                    only_deleted: false,
                    start_date: '',
                    end_date: '',
                });
            setCurrencies(currenciesData.data.map((currency: Currency) => ({
                value: currency.id,
                label: `${currency.code} - ${currency.name}`
            })));
        } catch (error) {
            console.error('Failed to fetch currencies:', error);
            toast.error('Error', {
                description: error.message || 'Failed to fetch currencies. Please try again.'
            });
        }
    }, []);

    useEffect(() => {
        handleFetchAccounts(tableState);
        fetchBanks();
        fetchCurrencies();
    }, [handleFetchAccounts, fetchBanks, fetchCurrencies, tableState]);

    const handleAccountActions = useCallback(
        (account: BankAccount): React.ReactNode => {
            const actions: Action[] = [
                {
                    label: 'View',
                    icon: Eye,
                    onClick: () => {
                        console.log('View account:', account.id);
                    }
                },
                {
                    label: 'Edit',
                    icon: Edit,
                    onClick: () => {
                        setSelectedItem(account);
                        accountForm.reset(account);
                        setAccountDrawerOpen(true);
                    }
                },
                {
                    label: 'Delete',
                    icon: Trash2,
                    onClick: () => {
                        setSelectedItem(account);
                        setDeleteDialogOpen(true);
                    }
                }
            ];

            return <ItemActions actions={actions}/>;
        },
        [accountForm]
    );

    const onAccountSubmit = async (values: BankAccountFormValues) => {
        try {
            if (selectedItem) {
                await updateBankAccount(selectedItem.id, values);
                toast.success('Success', {
                    description: 'Bank account updated successfully.'
                });
            } else {
                await createBankAccount(values);
                toast.success('Success', {
                    description: 'Bank account created successfully.'
                });
            }
            setAccountDrawerOpen(false);
            handleFetchAccounts(tableState);
        } catch (error) {
            console.error('Error saving bank account:', error);
            toast.error('Failed to save bank account. Please try again.');
        }
    };

    const handleDeleteAccount = async () => {
        if (!selectedItem) return;
        try {
            await deleteBankAccount(selectedItem.id);
            toast.success('Success', {
                description: 'Bank account deleted successfully.'
            });
            handleFetchAccounts(tableState);
        } catch (error) {
            console.error('Error deleting bank account:', error);
            toast.error('Failed to delete bank account. Please try again.');
        } finally {
            setDeleteDialogOpen(false);
            setSelectedItem(null);
        }
    };

    return (
        <SectionWrapper
            title="Bank Accounts"
            description="Manage and view all bank accounts, configure account details, and set primary accounts."
            totalItems={totalAccounts}
        >
            <AdvancedTable
                columns={columns}
                data={accounts}
                itemActions={handleAccountActions}
                tableState={tableState}
                setTableState={setTableState}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                isLoading={isLoading}
                totalItems={totalAccounts}
                fallbackSortColumn="created_at"
                fallbackSortDirection="desc"
                customButtons={
                    <Button
                        onClick={() => {
                            setSelectedItem(null);
                            accountForm.reset();
                            setAccountDrawerOpen(true);
                        }}
                    >
                        <PlusIcon className="mr-2 h-4 w-4"/>
                        Add Bank Account
                    </Button>
                }
                enableSearch={true}
                enableTrash={true}
                enableColumnVisibility={true}
                enableDateRange={true}
                enablePerPage={true}
                enableSort={true}
            />
            <ResponsiveDrawer
                open={accountDrawerOpen}
                onOpenChange={setAccountDrawerOpen}
                title={selectedItem ? 'Edit Bank Account' : 'Add Bank Account'}
                description={
                    selectedItem
                        ? 'Update the bank account details.'
                        : 'Enter the details for the new bank account.'
                }
                content={
                    <Form {...accountForm}>
                        <form
                            onSubmit={accountForm.handleSubmit(onAccountSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={accountForm.control}
                                name="account_number"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Account Number</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={accountForm.control}
                                name="bank_id"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Bank</FormLabel>
                                        <FormControl>
                                            <ResponsiveCombobox
                                                items={banks}
                                                placeholder="Select a bank"
                                                value={field.value}
                                                onChange={value => field.onChange(value)}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={accountForm.control}
                                name="currency_id"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Currency</FormLabel>
                                        <FormControl>
                                            <ResponsiveCombobox
                                                items={currencies}
                                                placeholder="Select a currency"
                                                value={field.value}
                                                onChange={value => field.onChange(value)}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={accountForm.control}
                                name="account_type"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Account Type</FormLabel>
                                        <FormControl>
                                            <ResponsiveCombobox
                                                items={accountTypes}
                                                placeholder="Select an account type"
                                                value={field.value}
                                                onChange={value => field.onChange(value)}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={accountForm.control}
                                name="balance"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Balance</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="number" step="0.01"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={accountForm.control}
                                name="is_primary"
                                render={({field}) => (
                                    <FormItem
                                        className="flex flex-row items-center justify-between rounded-lg border p-4">
                                        <div className="space-y-0.5">
                                            <FormLabel className="text-base">Primary Account</FormLabel>
                                            <FormDescription>
                                                Set this as your primary bank account
                                            </FormDescription>
                                        </div>
                                        <FormControl>
                                            <Switch
                                                checked={field.value}
                                                onCheckedChange={field.onChange}
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={accountForm.formState.isSubmitting}
                            >
                                {accountForm.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Saving...
                                    </>
                                ) : selectedItem ? (
                                    'Update Account'
                                ) : (
                                    'Create Account'
                                )}
                            </Button>
                        </form>
                    </Form>
                }
            />
            <AlertDialog
                isOpen={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteAccount}
                title="Delete Bank Account"
                description="Are you sure you want to delete this bank account? This action cannot be undone."
                confirmText="Delete"
            />
        </SectionWrapper>
    );
}