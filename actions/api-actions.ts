// api-actions.ts

'use server';

import {del, get, getAll, patch, post, put} from '@/lib/api-utils';
import {API_ROUTES, API_URL} from '@/routes';
import {
    Bank,
    BankAccount,
    BlockedIP, Currency,
    DashboardMetrics,
    OAuthClient,
    OAuthToken,
    PaginatedResponse, PaymentMethod,
    QueryParams,
    Response, Transaction,
    Upload,
    User
} from '@/types';
import {
    bankAccountSchema,
    blockedIpSchema, changePasswordSchema, depositSchema, disable2faSchema,
    forgotPasswordSchema,
    oauthSchema,
    resetPasswordSchema,
    showSecretSchema, signInSchema,
    signUpSchema,
    userSchema, verify2faSchema, verifyDepositSchema, withdrawSchema
} from '@/lib/zod';
import {z} from 'zod';

// User related actions
export async function getUsers(
    params: QueryParams = {}
): Promise<PaginatedResponse<User>> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const url = `${API_URL}${API_ROUTES.USERS.GET_USERS}?${queryParams.toString()}`;
    return getAll<User>(url);
}

export async function getUser(id: string): Promise<Response<User>> {
    return get<Response<User>>(`${API_URL}${API_ROUTES.USERS.GET_USER(id)}`);
}

export async function createUser(
    data: z.infer<typeof userSchema>
): Promise<Response<User>> {
    return post<Response<User>>(`${API_URL}${API_ROUTES.USERS.CREATE_USER}`, data);
}

export async function updateUser(
    id: string,
    data: z.infer<typeof userSchema>
): Promise<Response<User>> {
    return put<Response<User>>(
        `${API_URL}${API_ROUTES.USERS.UPDATE_USER(id)}`,
        data
    );
}

export async function deleteUser(id: string): Promise<Response<null>> {
    return del<Response<null>>(`${API_URL}${API_ROUTES.USERS.DELETE_USER(id)}`);
}

export async function restoreUser(id: string): Promise<Response<User>> {
    return post<Response<User>>(
        `${API_URL}${API_ROUTES.USERS.RESTORE_USER(id)}`,
        {}
    );
}

export async function bulkDeleteUsers(
    userIds: string[]
): Promise<Response<null>> {
    return post<Response<null>>(`${API_URL}${API_ROUTES.USERS.BULK_DELETE}`, {
        userIds
    });
}

export async function bulkRestoreUsers(
    userIds: string[]
): Promise<Response<null>> {
    return post<Response<null>>(`${API_URL}${API_ROUTES.USERS.BULK_RESTORE}`, {
        userIds
    });
}

export async function forceDeleteUser(id: string): Promise<Response<null>> {
    return del<Response<null>>(
        `${API_URL}${API_ROUTES.USERS.FORCE_DELETE(id)}`
    );
}

export async function importUsers(file: File): Promise<Response<null>> {
    const formData = new FormData();
    formData.append('file', file);
    return post<Response<null>>(`${API_URL}${API_ROUTES.USERS.IMPORT}`, formData);
}

export async function exportUsers(): Promise<Response<Blob>> {
    return get<Response<Blob>>(`${API_URL}${API_ROUTES.USERS.EXPORT}`);
}

export async function blockIp(id: string, data: z.infer<typeof blockedIpSchema>
): Promise<Response<null>> {
    return post<Response<null>>(
        `${API_URL}${API_ROUTES.USERS.BLOCK_IP(id, data.ip_address)}`,
        data
    );
}

export async function unblockIp(
    id: string,
    ipAddress: string
): Promise<Response<null>> {
    return del<Response<null>>(
        `${API_URL}${API_ROUTES.USERS.UNBLOCK_IP(id, ipAddress)}`
    );
}

// Upload related actions
export async function getUploads(
    params: QueryParams = {}
): Promise<PaginatedResponse<Upload>> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const url = `${API_URL}${API_ROUTES.UPLOADS.GET_UPLOADS}?${queryParams.toString()}`;
    return getAll<Upload>(url);
}

export async function getUpload(id: string): Promise<Response<Upload>> {
    return get<Response<Upload>>(`${API_URL}${API_ROUTES.UPLOADS.GET_UPLOAD(id)}`);
}

export async function createUpload(data: FormData): Promise<Response<Upload>> {
    return post<Response<Upload>>(
        `${API_URL}${API_ROUTES.UPLOADS.CREATE_UPLOAD}`,
        data
    );
}

export async function updateUpload(
    id: string,
    data: FormData
): Promise<Response<Upload>> {
    return put<Response<Upload>>(
        `${API_URL}${API_ROUTES.UPLOADS.UPDATE_UPLOAD(id)}`,
        data
    );
}

export async function deleteUpload(id: string): Promise<Response<null>> {
    return del<Response<null>>(
        `${API_URL}${API_ROUTES.UPLOADS.DELETE_UPLOAD(id)}`
    );
}

export async function restoreUpload(id: string): Promise<Response<Upload>> {
    return post<Response<Upload>>(
        `${API_URL}${API_ROUTES.UPLOADS.RESTORE_UPLOAD(id)}`,
        {}
    );
}

export async function bulkDeleteUploads(
    uploadIds: string[]
): Promise<Response<null>> {
    return post<Response<null>>(`${API_URL}${API_ROUTES.UPLOADS.BULK_DELETE}`, {
        uploadIds
    });
}

export async function bulkRestoreUploads(
    uploadIds: string[]
): Promise<Response<null>> {
    return post<Response<null>>(`${API_URL}${API_ROUTES.UPLOADS.BULK_RESTORE}`, {
        uploadIds
    });
}

export async function forceDeleteUpload(id: string): Promise<Response<null>> {
    return del<Response<null>>(`${API_URL}${API_ROUTES.UPLOADS.FORCE_DELETE(id)}`);
}

export async function importUploads(file: File): Promise<Response<null>> {
    const formData = new FormData();
    formData.append('file', file);
    return post<Response<null>>(
        `${API_URL}${API_ROUTES.UPLOADS.IMPORT}`,
        formData
    );
}

export async function exportUploads(): Promise<Response<Blob>> {
    return get<Response<Blob>>(`${API_URL}${API_ROUTES.UPLOADS.EXPORT}`);
}


// Bank Accounts related actions
export async function getBankAccounts(
    params: QueryParams = {}
): Promise<PaginatedResponse<BankAccount>> {
    const queryParams = new URLSearchParams(params as Record<string, string>)
    const url = `${API_URL}${API_ROUTES.BANK_ACCOUNTS.GET_ACCOUNTS}?${queryParams.toString()}`
    return getAll<BankAccount>(url)
}

export async function getBankAccount(id: string): Promise<BankAccount> {
    const url = `${API_URL}${API_ROUTES.BANK_ACCOUNTS.GET_ACCOUNT(id)}`
    return get<BankAccount>(url)
}

export async function createBankAccount(data: z.infer<typeof bankAccountSchema>): Promise<BankAccount> {
    const url = `${API_URL}${API_ROUTES.BANK_ACCOUNTS.CREATE_ACCOUNT}`
    return post<BankAccount>(url, data)
}


export async function updateBankAccount(id: string, data: z.infer<typeof bankAccountSchema>): Promise<BankAccount> {
    const url = `${API_URL}${API_ROUTES.BANK_ACCOUNTS.UPDATE_ACCOUNT(id)}`
    return put<BankAccount>(url, data)
}

export async function deleteBankAccount(id: string): Promise<void> {
    const url = `${API_URL}${API_ROUTES.BANK_ACCOUNTS.DELETE_ACCOUNT(id)}`
    return del(url)
}

// OAuth Client related actions
export async function getOAuthClients(
    params: QueryParams = {}
): Promise<PaginatedResponse<OAuthClient>> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const url = `${API_URL}${API_ROUTES.OAUTH_CLIENTS.GET_CLIENTS}?${queryParams.toString()}`;
    return getAll<OAuthClient>(url);
}

export async function getOAuthClient(
    id: string
): Promise<Response<OAuthClient>> {
    return get<Response<OAuthClient>>(
        `${API_URL}${API_ROUTES.OAUTH_CLIENTS.GET_CLIENT(id)}`
    );
}

export async function createOAuthClient(
    data: z.infer<typeof oauthSchema>
): Promise<Response<OAuthClient>> {
    return post<Response<OAuthClient>>(
        `${API_URL}${API_ROUTES.OAUTH_CLIENTS.CREATE_CLIENT}`,
        data
    );
}

export async function updateOAuthClient(
    id: string,
    data: z.infer<typeof oauthSchema>
): Promise<Response<OAuthClient>> {
    return put<Response<OAuthClient>>(
        `${API_URL}${API_ROUTES.OAUTH_CLIENTS.UPDATE_CLIENT(id)}`,
        data
    );
}

export async function deleteOAuthClient(id: string): Promise<Response<null>> {
    return del<Response<null>>(
        `${API_URL}${API_ROUTES.OAUTH_CLIENTS.DELETE_CLIENT(id)}`
    );
}

export async function showOAuthClientSecret(
    id: string,
    data: z.infer<typeof showSecretSchema>
): Promise<
    Response<{
        secret: string
    }>
> {
    return post<Response<{ secret: string }>>(
        `${API_URL}${API_ROUTES.OAUTH_CLIENTS.SHOW_SECRET(id)}`,
        data
    );
}

export async function listOAuthTokens(): Promise<Response<OAuthToken[]>> {
    return get<Response<OAuthToken[]>>(
        `${API_URL}${API_ROUTES.OAUTH_CLIENTS.LIST_TOKENS}`
    );
}

export async function revokeOAuthToken(
    tokenId: string
): Promise<Response<null>> {
    return del<Response<null>>(
        `${API_URL}${API_ROUTES.OAUTH_CLIENTS.REVOKE_TOKEN(tokenId)}`
    );
}

export async function listAllOAuthTokens(): Promise<Response<OAuthToken[]>> {
    return get<Response<OAuthToken[]>>(
        `${API_URL}${API_ROUTES.OAUTH_CLIENTS.LIST_ALL_TOKENS}`
    );
}

export async function deleteOAuthToken(id: string): Promise<Response<null>> {
    return del<Response<null>>(
        `${API_URL}${API_ROUTES.OAUTH_CLIENTS.DELETE_TOKEN(id)}`
    );
}

// Blocked IP related actions
export async function getBlockedIPs(
    params: QueryParams = {}
): Promise<PaginatedResponse<BlockedIP>> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const url = `${API_URL}${API_ROUTES.BLOCKED_IPS.GET_BLOCKED_IPS}?${queryParams.toString()}`;
    return getAll<BlockedIP>(url);
}

export async function getBlockedIP(id: string): Promise<Response<BlockedIP>> {
    return get<Response<BlockedIP>>(
        `${API_URL}${API_ROUTES.BLOCKED_IPS.GET_BLOCKED_IP(id)}`
    );
}

export async function createBlockedIP(
    data: z.infer<typeof blockedIpSchema>
): Promise<Response<BlockedIP>> {
    return post<Response<BlockedIP>>(
        `${API_URL}${API_ROUTES.BLOCKED_IPS.CREATE_BLOCKED_IP}`,
        data
    );
}

export async function updateBlockedIP(
    id: string,
    data: z.infer<typeof blockedIpSchema>
): Promise<Response<BlockedIP>> {
    return put<Response<BlockedIP>>(
        `${API_URL}${API_ROUTES.BLOCKED_IPS.UPDATE_BLOCKED_IP(id)}`,
        data
    );
}

export async function deleteBlockedIP(id: string): Promise<Response<null>> {
    return del<Response<null>>(
        `${API_URL}${API_ROUTES.BLOCKED_IPS.DELETE_BLOCKED_IP(id)}`
    );
}

// Dashboard related actions
export async function getDashboardMetrics(): Promise<
    Response<DashboardMetrics>
> {
    return get<Response<DashboardMetrics>>(
        `${API_URL}${API_ROUTES.DASHBOARD.GET_METRICS}`
    );
}

// FCM related actions
export async function sendFCMToDevice(data: {
    token: string
    title: string
    body: string
}): Promise<Response<null>> {
    return post<Response<null>>(
        `${API_URL}${API_ROUTES.FCM.SEND_TO_DEVICE}`,
        data
    );
}

export async function sendFCMToDevices(data: {
    tokens: string[]
    title: string
    body: string
}): Promise<Response<null>> {
    return post<Response<null>>(
        `${API_URL}${API_ROUTES.FCM.SEND_TO_DEVICES}`,
        data
    );
}

// Notification related actions
export async function getNotifications(): Promise<Response<Notification[]>> {
    return get<Response<Notification[]>>(
        `${API_URL}${API_ROUTES.NOTIFICATIONS.GET_ALL}`
    );
}

export async function markNotificationAsRead(
    id: string
): Promise<Response<null>> {
    return patch<Response<null>>(
        `${API_URL}${API_ROUTES.NOTIFICATIONS.MARK_AS_READ(id)}`,
        {}
    );
}

export async function markAllNotificationsAsRead(): Promise<Response<null>> {
    return post<Response<null>>(
        `${API_URL}${API_ROUTES.NOTIFICATIONS.MARK_ALL_READ}`,
        {}
    );
}

export async function deleteNotification(id: string): Promise<Response<null>> {
    return del<Response<null>>(`${API_URL}${API_ROUTES.NOTIFICATIONS.DELETE(id)}`);
}

export async function getUnreadNotificationCount(): Promise<
    Response<{ count: number }>
> {
    return get<Response<{ count: number }>>(
        `${API_URL}${API_ROUTES.NOTIFICATIONS.UNREAD_COUNT}`
    );
}

// Authentication actions
export async function login(data: z.infer<typeof signInSchema>): Promise<Response<null>> {
    return post<Response<null>>(
        `${API_URL}${API_ROUTES.AUTH.LOGIN}`,
        data
    );
}

export async function signup(
    data: z.infer<typeof signUpSchema>
): Promise<Response<User>> {
    return post<Response<User>>(`${API_URL}${API_ROUTES.AUTH.REGISTER}`, data);
}

export async function forgotPassword(
    data: z.infer<typeof forgotPasswordSchema>
): Promise<Response<null>> {
    return post<Response<null>>(
        `${API_URL}${API_ROUTES.AUTH.FORGOT_PASSWORD}`,
        data
    );
}

export async function resetPassword(
    data: z.infer<typeof resetPasswordSchema>
): Promise<Response<null>> {
    return post<Response<null>>(
        `${API_URL}${API_ROUTES.AUTH.RESET_PASSWORD}`,
        data
    );
}

// export async function verifyEmail(
//     id: string,
//     hash: string
// ): Promise<Response<null>> {
//     return get<Response<null>>(
//         `${API_URL}${API_ROUTES.AUTH.VERIFY_EMAIL(id, hash)}`
//     );
// }

export async function verifyEmail(
    id: string,
    hash: string,
    expires: string,
    signature: string
): Promise<Response<null>> {
    const url = new URL(`${API_URL}${API_ROUTES.AUTH.VERIFY_EMAIL(id, hash)}`);
    url.searchParams.append('expires', expires);
    url.searchParams.append('signature', signature);
    return get<Response<null>>(url.toString());
}

export async function resendVerificationEmail(): Promise<Response<null>> {
    return post<Response<null>>(
        `${API_URL}${API_ROUTES.AUTH.RESEND_VERIFICATION}`,
        {}
    );
}

export async function logout(): Promise<Response<null>> {
    return post<Response<null>>(`${API_URL}${API_ROUTES.AUTH.LOGOUT}`, {});
}

export async function refreshToken(): Promise<Response<{ token: string }>> {
    return post<Response<{ token: string }>>(
        `${API_URL}${API_ROUTES.AUTH.REFRESH}`,
        {}
    );
}

export async function sendOtp(): Promise<Response<{ otp: string }>> {
    return get<Response<{ otp: string }>>(`${API_URL}${API_ROUTES.AUTH.SEND_OTP}`);
}

export async function issuePassportToken(data: {
    email: string
    password: string
}): Promise<
    Response<{
        token: string
    }>
> {
    return post<Response<{ token: string }>>(
        `${API_URL}${API_ROUTES.AUTH.ISSUE_PASSPORT_TOKEN}`,
        data
    );
}

export async function unlockAccount(data: {
    email: string
    password: string
}): Promise<Response<null>> {
    return post<Response<null>>(`${API_URL}${API_ROUTES.AUTH.UNLOCK}`, data);
}

export async function changePassword(data: z.infer<typeof changePasswordSchema>): Promise<Response<null>> {
    return put<Response<null>>(
        `${API_URL}${API_ROUTES.AUTH.CHANGE_PASSWORD}`,
        data
    );
}

export async function getProfile(): Promise<Response<User>> {
    return get<Response<User>>(`${API_URL}${API_ROUTES.AUTH.PROFILE}`);
}

export async function updateProfile(
    data: z.infer<typeof userSchema>
): Promise<Response<User>> {
    return put<Response<User>>(`${API_URL}${API_ROUTES.AUTH.PROFILE}`, data);
}

export async function enable2FA(): Promise<
    Response<{ secret: string; qr_code_url: string }>
> {
    return post<Response<{ secret: string; qr_code_url: string }>>(
        `${API_URL}${API_ROUTES.AUTH.ENABLE_2FA}`,
        {}
    );
}

export async function disable2FA(data: z.infer<typeof disable2faSchema>): Promise<Response<null>> {
    return post<Response<null>>(`${API_URL}${API_ROUTES.AUTH.DISABLE_2FA}`, data);
}

export async function generateNewRecoveryCodes(): Promise<Response<string[]>> {
    return post<Response<string[]>>(
        `${API_URL}${API_ROUTES.AUTH.GENERATE_RECOVERY_CODES}`,
        {}
    );
}

export async function verify2FA(data: z.infer<typeof verify2faSchema>): Promise<Response<{
    recovery_codes: string[]
}>> {
    return post<Response<{ recovery_codes: string[] }>>(`${API_URL}${API_ROUTES.AUTH.VERIFY_2FA}`, data);
}

export async function verifyLogin2FA(data: z.infer<typeof verify2faSchema>): Promise<Response<{
    recovery_codes: string[]
}>> {
    return post<Response<{ recovery_codes: string[] }>>(`${API_URL}${API_ROUTES.AUTH.VERIFY_2FA}`, data);
}

export async function getBanks(
    params: QueryParams = {}
): Promise<PaginatedResponse<Bank>> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const url = `${API_URL}${API_ROUTES.BANKS.GET_BANKS}?${queryParams.toString()}`;
    return getAll<Bank>(url);
}

export async function getCurrencies(
    params: QueryParams = {}
): Promise<PaginatedResponse<Currency>> {
    const queryParams = new URLSearchParams(params as Record<string, string>);
    const url = `${API_URL}${API_ROUTES.CURRENCIES.GET_CURRENCIES}?${queryParams.toString()}`;
    return getAll<Currency>(url);
}

// Transaction related actions
export async function getTransactions(
    params: QueryParams = {}
): Promise<PaginatedResponse<Transaction>> {
    const queryParams = new URLSearchParams(params as Record<string, string>)
    const url = `${API_URL}${API_ROUTES.TRANSACTIONS.GET_TRANSACTIONS}?${queryParams.toString()}`
    return getAll<Transaction>(url)
}

export async function getTransaction(id: string): Promise<Transaction> {
    const url = `${API_URL}${API_ROUTES.TRANSACTIONS.GET_TRANSACTION(id)}`
    return get<Transaction>(url)
}

export async function initializeDeposit(data: z.infer<typeof depositSchema>): Promise<Response<{
    paystack: {
        authorization_url: string,
        access_code: string,
        reference: string
    },
    transaction_id: string
}>> {
    const url = `${API_URL}${API_ROUTES.TRANSACTIONS.DEPOSIT_INITIALIZE}`
    return post(url, data)
}

export async function verifyDeposit(data: z.infer<typeof verifyDepositSchema>): Promise<Response<Transaction>> {
    const url = `${API_URL}${API_ROUTES.TRANSACTIONS.DEPOSIT_VERIFY}`
    return post(url, data)
}

export async function initializeWithdrawal(data: z.infer<typeof withdrawSchema>): Promise<Response<Transaction>> {
    const url = `${API_URL}${API_ROUTES.TRANSACTIONS.WITHDRAW_INITIALIZE}`
    return post(url, data)
}


export async function deleteTransaction(id: string): Promise<Response<null>> {
    const url = `${API_URL}${API_ROUTES.TRANSACTIONS.DELETE_TRANSACTION(id)}`
    return del(url)
}

// Payment Method related actions (for fetching in transaction form)
export async function getPaymentMethods(
    params: QueryParams = {}
): Promise<PaginatedResponse<PaymentMethod>> {
    const queryParams = new URLSearchParams(params as Record<string, string>)
    const url = `${API_URL}${API_ROUTES.PAYMENT_METHODS.GET_PAYMENT_METHODS}?${queryParams.toString()}`
    return getAll<PaymentMethod>(url)
}

