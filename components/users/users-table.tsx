'use client';

import React, {useCallback, useEffect, useState} from 'react';
import {zodResolver} from '@hookform/resolvers/zod';
import {useForm} from 'react-hook-form';
import * as z from 'zod';
import {toast} from 'sonner';
import {
    AlertTriangle,
    Edit,
    Eye,
    Key,
    Loader2,
    PlusIcon,
    RefreshCw,
    ShieldAlert,
    ShieldCheck,
    ShieldOff,
    Trash2
} from 'lucide-react';
import AdvancedTable, {NestedKeyOf, TableState} from '@/components/table/advanced-table';
import {
    blockIp,
    createUser,
    deleteUser,
    forceDeleteUser,
    getUsers,
    restoreUser,
    unblockIp,
    updateUser
} from '@/actions/api-actions';
import {Action, ItemActions} from '@/components/table/item-actions';
import {Button} from '@/components/ui/button';
import {BlockedIP, User} from '@/types';
import {columns} from './columns';
import {ResponsiveDrawer} from '@/components/responsive-drawer';
import {Input} from '@/components/ui/input';
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from '@/components/ui/form';
import {blockedIpSchema, userSchema} from '@/lib/zod';
import AlertDialog from '@/components/alert-dialog';
import {PhoneInput} from '@/components/phone-input';
import SectionWrapper from '@/components/section-wrapper';
import {ResponsiveCombobox} from '@/components/responsive-combobox';
import {Textarea} from '@/components/ui/textarea';
import DatePickerWithTime from '@/components/date-picker-with-time';
import {format} from 'date-fns';

type UserFormValues = z.infer<typeof userSchema>

type BlockIpFormValues = z.infer<typeof blockedIpSchema>

export default function UserTable() {
    const [users, setUsers] = useState<User[] | null>(null);
    const [totalUsers, setTotalUsers] = useState(0);
    const [isLoading, setIsLoading] = useState(false);
    const [userDrawerOpen, setUserDrawerOpen] = useState(false);
    const [blockIpDrawerOpen, setBlockIpDrawerOpen] = useState(false);
    const [unblockIpDrawerOpen, setUnblockIpDrawerOpen] = useState(false);
    const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
    const [restoreDialogOpen, setRestoreDialogOpen] = useState(false);
    const [forceDeleteDialogOpen, setForceDeleteDialogOpen] = useState(false);
    const [isOnlyDeleted, setIsOnlyDeleted] = useState(false);
    const [tableState, setTableState] = useState<TableState<User>>({
        search: '',
        page: 1,
        perPage: 10,
        sortColumn: 'created_at' as NestedKeyOf<User>,
        sortDirection: 'desc',
        onlyDeleted: false,
        dateRange: {startDate: '', endDate: ''}
    });
    const [selectedItem, setSelectedItem] = useState<User | null>(null);
    const [selectedItems, setSelectedItems] = useState<string[]>([]);
    const [visibleColumns, setVisibleColumns] = useState<Set<NestedKeyOf<User>>>(
        new Set(columns.map(col => col.key))
    );

    const userForm = useForm<UserFormValues>({
        resolver: zodResolver(userSchema),
        defaultValues: {
            name: '',
            email: '',
            username: '',
            phone: '',
            role: 'user'
        }
    });

    const blockIpForm = useForm<BlockIpFormValues>({
        resolver: zodResolver(blockedIpSchema),
        defaultValues: {
            ip_address: '',
            reason: '',
            blocked_until: ''
        }
    });

    const [selectedIpToUnblock, setSelectedIpToUnblock] = useState<string>('');

    const handleFetchUsers = useCallback(async (state: TableState<User>) => {
        setIsLoading(true);
        try {
            const result = await getUsers({
                page: state.page,
                per_page: state.perPage,
                search: state.search,
                sort_by: state.sortColumn as string,
                sort_order: state.sortDirection as string,
                only_deleted: state.onlyDeleted,
                date_from: state.dateRange.startDate,
                date_to: state.dateRange.endDate
            });
            setUsers(result.data);
            setTotalUsers(result.meta.total);
        } catch (error) {
            console.error('Failed to fetch users:', error);
            toast.error('Error', {
                description: error.messsage || 'Failed to fetch users. Please try again.'
            });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        handleFetchUsers(tableState);
    }, [handleFetchUsers, tableState]);

    const handleUserActions = useCallback(
        (user: User): React.ReactNode => {
            const actions: Action[] = [
                {
                    label: 'View',
                    icon: Eye,
                    onClick: () => {
                        console.log('View user:', user.id);
                    }
                },
                ...(isOnlyDeleted
                        ? [
                            {
                                label: 'Restore',
                                onClick: () => {
                                    setSelectedItem(user);
                                    setRestoreDialogOpen(true);
                                },
                                icon: RefreshCw
                            },
                            {
                                label: 'Permanent Delete',
                                onClick: () => {
                                    setSelectedItem(user);
                                    setForceDeleteDialogOpen(true);
                                },
                                icon: AlertTriangle
                            }
                        ]
                        : [
                            {
                                label: 'Edit',
                                icon: Edit,
                                onClick: () => {
                                    setSelectedItem(user);
                                    userForm.reset(user);
                                    setUserDrawerOpen(true);
                                }
                            },
                            {
                                label: 'Delete',
                                icon: Trash2,
                                onClick: () => {
                                    setSelectedItem(user);
                                    setDeleteDialogOpen(true);
                                }
                            },
                            {
                                label: 'Manage IP',
                                icon: ShieldAlert,
                                subItems: [
                                    {
                                        label: 'Block IP',
                                        onClick: () => {
                                            setSelectedItem(user);
                                            setBlockIpDrawerOpen(true);
                                        },
                                        icon: ShieldAlert
                                    },
                                    {
                                        label: 'Unblock IP',
                                        onClick: () => {
                                            setSelectedItem(user);
                                            setSelectedIpToUnblock('');
                                            setUnblockIpDrawerOpen(true);
                                        },
                                        icon: ShieldCheck
                                    }
                                ]
                            },
                            {
                                label: '2FA',
                                icon: user.google2fa_enabled ? ShieldCheck : ShieldOff,
                                subItems: [
                                    {
                                        label: user.google2fa_enabled ? 'Disable 2FA' : 'Enable 2FA',
                                        onClick: () => {
                                            console.log(
                                                user.google2fa_enabled
                                                    ? 'Disable 2FA for user:'
                                                    : 'Enable 2FA for user:',
                                                user.id
                                            );
                                        }
                                    },
                                    {
                                        label: 'Reset Recovery Codes',
                                        icon: Key,
                                        onClick: () => {
                                            console.log('Reset recovery codes for user:', user.id);
                                        }
                                    }
                                ]
                            }
                        ]
                )
            ];

            return <ItemActions actions={actions}/>;
        },
        [isOnlyDeleted, userForm]
    );

    const onUserSubmit = async (values: UserFormValues) => {
        try {
            if (selectedItem) {
                const result = await updateUser(selectedItem.id, values);
                toast.success('Success', {description: result.message});
            } else {
                const result = await createUser(values);
                toast.success('Success', {description: result.message});
            }
            setUserDrawerOpen(false);
            handleFetchUsers(tableState);
        } catch (error) {
            console.error('Error saving user:', error);
            toast.error('Error', {description: error.message || 'Failed to save user. Please try again.'});
        }
    };

    const onBlockIpSubmit = async (values: BlockIpFormValues) => {
        if (!selectedItem) return;
        try {
            const result = await blockIp(selectedItem.id, values);
            toast.success('Success', {description: result.message});
            setBlockIpDrawerOpen(false);
            handleFetchUsers(tableState);
        } catch (error) {
            console.error('Error blocking IP:', error);
            toast.error('Error', {description: error.message || 'Failed to block IP. Please try again.'});
        }
    };

    const handleUnblockIp = async () => {
        if (!selectedItem || !selectedIpToUnblock) return;
        try {
            const result = await unblockIp(selectedItem.id, selectedIpToUnblock);
            toast.success('Success', {description: result.message});
            setUnblockIpDrawerOpen(false);
            handleFetchUsers(tableState);
        } catch (error) {
            console.error('Error unblocking IP:', error);
            toast.error('Error', {description: error.message || 'Failed to unblock IP. Please try again.'});
        }
    };

    const handleDeleteUser = async () => {
        if (!selectedItem) return;
        try {
            const result = await deleteUser(selectedItem.id);
            toast.success('Success', {description: result.message});
            handleFetchUsers(tableState);
        } catch (error) {
            console.error('Error deleting user:', error);
            toast.error('Error', {description: error.message || 'Failed to delete user. Please try again.'});
        } finally {
            setDeleteDialogOpen(false);
            setSelectedItem(null);
        }
    };

    const handleRestoreUser = async () => {
        if (!selectedItem) return;
        try {
            const result = await restoreUser(selectedItem.id);
            toast.success('Success', {description: result.message});
            handleFetchUsers(tableState);
        } catch (error) {
            console.error('Error restoring user:', error);
            toast.error('Error', {description: error.message || 'Failed to restore user. Please try again.'});
        } finally {
            setRestoreDialogOpen(false);
            setSelectedItem(null);
        }
    };

    const handleForceDeleteUser = async () => {
        if (!selectedItem) return;
        try {
            const result = await forceDeleteUser(selectedItem.id);
            toast.success('Success', {description: result.message});
            handleFetchUsers(tableState);
        } catch (error) {
            console.error('Error permanently deleting user:', error);
            toast.error('Error', {description: error.message || 'Failed to permanently delete user. Please try again.'});
        } finally {
            setForceDeleteDialogOpen(false);
            setSelectedItem(null);
        }
    };

    return (
        <SectionWrapper
            title={isOnlyDeleted ? 'Deleted Users' : 'Users'}
            description={isOnlyDeleted ? 'Manage and view all deleted users within the system.' : 'Manage and view all users within the system.'}
            totalItems={totalUsers}
        >
            <AdvancedTable
                columns={columns}
                data={users}
                itemActions={handleUserActions}
                tableState={tableState}
                setTableState={setTableState}
                selectedItems={selectedItems}
                setSelectedItems={setSelectedItems}
                visibleColumns={visibleColumns}
                setVisibleColumns={setVisibleColumns}
                isLoading={isLoading}
                totalItems={totalUsers}
                fallbackSortColumn="created_at"
                fallbackSortDirection="desc"
                onTrashSwitchChange={(isTrashed) => {
                    setIsOnlyDeleted(isTrashed);
                    handleFetchUsers({...({} as TableState<User>), onlyDeleted: isTrashed});
                }}
                customButtons={
                    <Button
                        onClick={() => {
                            setSelectedItem(null);
                            userForm.reset();
                            setUserDrawerOpen(true);
                        }}
                    >
                        <PlusIcon className="mr-2 h-4 w-4"/>
                        Add User
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
                open={userDrawerOpen}
                onOpenChange={setUserDrawerOpen}
                title={selectedItem ? 'Edit User' : 'Add User'}
                description={
                    selectedItem
                        ? 'Update the user details.'
                        : 'Enter the details for the new user.'
                }
                content={
                    <Form {...userForm}>
                        <form
                            onSubmit={userForm.handleSubmit(onUserSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={userForm.control}
                                name="name"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Name</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={userForm.control}
                                name="email"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Email</FormLabel>
                                        <FormControl>
                                            <Input {...field} type="email"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={userForm.control}
                                name="username"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Username</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={userForm.control}
                                name="phone"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Phone</FormLabel>
                                        <FormControl>
                                            <PhoneInput {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={userForm.control}
                                name="role"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={userForm.formState.isSubmitting}
                            >
                                {userForm.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Saving...
                                    </>
                                ) : selectedItem ? (
                                    'Update User'
                                ) : (
                                    'Create User'
                                )}
                            </Button>
                        </form>
                    </Form>
                }
            />
            <ResponsiveDrawer
                open={blockIpDrawerOpen}
                onOpenChange={setBlockIpDrawerOpen}
                title="Block IP"
                description="Enter the IP address you want to block for this user."
                content={
                    <Form {...blockIpForm}>
                        <form
                            onSubmit={blockIpForm.handleSubmit(onBlockIpSubmit)}
                            className="space-y-4"
                        >
                            <FormField
                                control={blockIpForm.control}
                                name="ip_address"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>IP Address</FormLabel>
                                        <FormControl>
                                            <Input {...field} placeholder="Enter IP address"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={blockIpForm.control}
                                name="reason"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Reason</FormLabel>
                                        <FormControl>
                                            <Textarea {...field} placeholder="Enter reason for blocking"/>
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <FormField
                                control={blockIpForm.control}
                                name="blocked_until"
                                render={({field}) => (
                                    <FormItem>
                                        <FormLabel>Blocked Until</FormLabel>
                                        <FormControl>
                                            <DatePickerWithTime
                                                onDateTimeChange={(value) => field.onChange(value)}
                                                enableTime={true}
                                            />
                                        </FormControl>
                                        <FormMessage/>
                                    </FormItem>
                                )}
                            />
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={blockIpForm.formState.isSubmitting}
                            >
                                {blockIpForm.formState.isSubmitting ? (
                                    <>
                                        <Loader2 className="mr-2 h-4 w-4 animate-spin"/>
                                        Blocking...
                                    </>
                                ) : (
                                    'Block IP'
                                )}
                            </Button>
                        </form>
                    </Form>
                }
            />
            <ResponsiveDrawer
                open={unblockIpDrawerOpen}
                onOpenChange={setUnblockIpDrawerOpen}
                title="Unblock IP"
                description="Select the IP address you want to unblock for this user."
                content={
                    <div className="space-y-4">
                        <ResponsiveCombobox
                            items={selectedItem?.blocked_ips?.map((blockedIp: BlockedIP) => ({
                                value: blockedIp.ip_address,
                                label: `${blockedIp.ip_address} - ${format(new Date(blockedIp.blocked_until), 'PPpp')}`
                            })) || []}
                            placeholder="Select IP address to unblock"
                            emptyText="No blocked IPs found."
                            multiple={false}
                            onChange={(value) => setSelectedIpToUnblock(value as string)}
                            value={selectedIpToUnblock}
                        />
                        <Button
                            onClick={handleUnblockIp}
                            className="w-full"
                            disabled={!selectedIpToUnblock}
                        >
                            Unblock Selected IP
                        </Button>
                    </div>
                }
            />
            <AlertDialog
                isOpen={deleteDialogOpen}
                onOpenChange={setDeleteDialogOpen}
                onConfirm={handleDeleteUser}
                title="Delete User"
                description="Are you sure you want to delete this user? This action can be undone."
                confirmText="Delete"
            />
            <AlertDialog
                isOpen={restoreDialogOpen}
                onOpenChange={setRestoreDialogOpen}
                onConfirm={handleRestoreUser}
                title="Restore User"
                description="Are you sure you want to restore this user?"
                confirmText="Restore"
            />
            <AlertDialog
                isOpen={forceDeleteDialogOpen}
                onOpenChange={setForceDeleteDialogOpen}
                onConfirm={handleForceDeleteUser}
                title="Permanently Delete User"
                description="Are you sure you want to permanently delete this user? This action cannot be undone."
                confirmText="Permanently Delete"
            />
        </SectionWrapper>
    );
}