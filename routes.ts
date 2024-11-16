// routes.ts

export const publicRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/verify-email'
]

export const authRoutes = [
  '/login',
  '/register',
  '/forgot-password',
  '/verify-email'
]

export const protectedRoutes = [
  '/dashboard',
  '/users',
  '/bank-accounts',
  '/access-logs',
  '/settings',
  '/profile',
  '/uploads',
  '/blocked-ips',
  '/notifications'
]

export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://sso-api.test'

export const AUTH_API = {
  LOGIN: '/api/v1/auth/login',
  REGISTER: '/api/v1/auth/register',
  FORGOT_PASSWORD: '/api/v1/auth/forgot-password',
  RESET_PASSWORD: '/api/v1/auth/reset-password',
  VERIFY_EMAIL: (id: string, hash: string) =>
    `/api/v1/auth/email/verify/${id}/${hash}`,
  RESEND_VERIFICATION: '/api/v1/auth/email/resend',
  SOCIAL_LOGIN: (provider: string) => `/api/v1/auth/${provider}`,
  SOCIAL_CALLBACK: (provider: string) => `/api/v1/auth/${provider}/callback`,
  UNLOCK: '/api/v1/auth/unlock',
  CHANGE_PASSWORD: '/api/v1/auth/change-password',
  PROFILE: '/api/v1/auth/profile',
  LOGOUT: '/api/v1/auth/logout',
  REFRESH: '/api/v1/auth/refresh',
  ENABLE_2FA: '/api/v1/auth/2fa/enable',
  DISABLE_2FA: '/api/v1/auth/2fa/disable',
  GENERATE_RECOVERY_CODES: '/api/v1/auth/2fa/recovery-codes',
  VERIFY_2FA: '/api/v1/auth/2fa/verify',
  SEND_OTP: '/api/v1/auth/send-otp',
  ISSUE_PASSPORT_TOKEN: '/api/v1/auth/issue-passport-token'
}

export const USER_API = {
  GET_USERS: '/api/v1/users',
  GET_USER: (id: string) => `/api/v1/users/${id}`,
  CREATE_USER: '/api/v1/users',
  UPDATE_USER: (id: string) => `/api/v1/users/${id}`,
  DELETE_USER: (id: string) => `/api/v1/users/${id}`,
  RESTORE_USER: (id: string) => `/api/v1/users/${id}/restore`,
  BULK_DELETE: '/api/v1/users/bulk-delete',
  BULK_RESTORE: '/api/v1/users/bulk-restore',
  FORCE_DELETE: (id: string) => `/api/v1/users/${id}/force`,
  IMPORT: '/api/v1/users/import',
  EXPORT: '/api/v1/users/export',
  BLOCK_IP: (userId: string, ipAddress: string) =>
    `/api/v1/users/${userId}/block-ip/${ipAddress}`,
  UNBLOCK_IP: (userId: string, ipAddress: string) =>
    `/api/v1/users/${userId}/unblock-ip/${ipAddress}`
}

export const UPLOAD_API = {
  GET_UPLOADS: '/api/v1/uploads',
  GET_UPLOAD: (id: string) => `/api/v1/uploads/${id}`,
  CREATE_UPLOAD: '/api/v1/uploads',
  UPDATE_UPLOAD: (id: string) => `/api/v1/uploads/${id}`,
  DELETE_UPLOAD: (id: string) => `/api/v1/uploads/${id}`,
  RESTORE_UPLOAD: (id: string) => `/api/v1/uploads/${id}/restore`,
  BULK_DELETE: '/api/v1/uploads/bulk-delete',
  BULK_RESTORE: '/api/v1/uploads/bulk-restore',
  FORCE_DELETE: (id: string) => `/api/v1/uploads/${id}/force`,
  IMPORT: '/api/v1/uploads/import',
  EXPORT: '/api/v1/uploads/export'
}

export const OAUTH_CLIENT_API = {
  GET_CLIENTS: '/api/v1/bank-accounts',
  GET_CLIENT: (id: string) => `/api/v1/oauth-clients/${id}`,
  CREATE_CLIENT: '/api/v1/bank-accounts',
  UPDATE_CLIENT: (id: string) => `/api/v1/oauth-clients/${id}`,
  DELETE_CLIENT: (id: string) => `/api/v1/oauth-clients/${id}`,
  SHOW_SECRET: (id: string) => `/api/v1/oauth-clients/${id}/secret`,
  LIST_TOKENS: '/api/v1/bank-accounts/tokens',
  REVOKE_TOKEN: (tokenId: string) => `/api/v1/oauth-clients/tokens/${tokenId}`,
  LIST_ALL_TOKENS: '/api/v1/bank-accounts/all-tokens',
  DELETE_TOKEN: (id: string) => `/api/v1/oauth-clients/tokens/${id}`
}

export const BLOCKED_IP_API = {
  GET_BLOCKED_IPS: '/api/v1/blocked-ips',
  GET_BLOCKED_IP: (id: string) => `/api/v1/blocked-ips/${id}`,
  CREATE_BLOCKED_IP: '/api/v1/blocked-ips',
  UPDATE_BLOCKED_IP: (id: string) => `/api/v1/blocked-ips/${id}`,
  DELETE_BLOCKED_IP: (id: string) => `/api/v1/blocked-ips/${id}`
}

export const DASHBOARD_API = {
  GET_METRICS: '/api/v1/dashboard/metrics'
}

export const FCM_API = {
  SEND_TO_DEVICE: '/api/v1/fcm/send-to-device',
  SEND_TO_DEVICES: '/api/v1/fcm/send-to-devices'
}

export const NOTIFICATION_API = {
  GET_ALL: '/api/v1/notifications/all',
  MARK_AS_READ: (id: string) => `/api/v1/notifications/${id}/read`,
  MARK_ALL_READ: '/api/v1/notifications/mark-all-read',
  DELETE: (id: string) => `/api/v1/notifications/${id}`,
  UNREAD_COUNT: '/api/v1/notifications/unread-count'
}

export const BANK_ACCOUNT_API = {
  GET_ACCOUNTS: '/api/v1/bank-accounts',
  GET_ACCOUNT: (id: string) => `/api/v1/bank-accounts/${id}`,
  CREATE_ACCOUNT: '/api/v1/bank-accounts',
  UPDATE_ACCOUNT: (id: string) => `/api/v1/bank-accounts/${id}`,
  DELETE_ACCOUNT: (id: string) => `/api/v1/bank-accounts/${id}`,
  RESTORE_ACCOUNT: (id: string) => `/api/v1/bank-accounts/${id}/restore`,
  BULK_DELETE: '/api/v1/bank-accounts/bulk-delete',
  BULK_RESTORE: '/api/v1/bank-accounts/bulk-restore',
  FORCE_DELETE: (id: string) => `/api/v1/bank-accounts/${id}/force`,
  IMPORT: '/api/v1/bank-accounts/import',
  EXPORT: '/api/v1/bank-accounts/export'
}

export const BANK_API = {
  GET_BANKS: '/api/v1/banks',
  GET_BANK: (id: string) => `/api/v1/banks/${id}`,
  CREATE_BANK: '/api/v1/banks',
  UPDATE_BANK: (id: string) => `/api/v1/banks/${id}`,
  DELETE_BANK: (id: string) => `/api/v1/banks/${id}`,
};

export const CURRENCY_API = {
  GET_CURRENCIES: '/api/v1/currencies',
  GET_CURRENCY: (id: string) => `/api/v1/currencies/${id}`,
  CREATE_CURRENCY: '/api/v1/currencies',
  UPDATE_CURRENCY: (id: string) => `/api/v1/currencies/${id}`,
  DELETE_CURRENCY: (id: string) => `/api/v1/currencies/${id}`,
};

export const TRANSACTION_API = {
  GET_TRANSACTIONS: '/api/v1/transactions',
  GET_TRANSACTION: (id: string) => `/api/v1/transactions/${id}`,
  CREATE_TRANSACTION: '/api/v1/transactions',
  UPDATE_TRANSACTION: (id: string) => `/api/v1/transactions/${id}`,
  DELETE_TRANSACTION: (id: string) => `/api/v1/transactions/${id}`,
  DEPOSIT_INITIALIZE: '/api/v1/paystack/payment/initialize',
  DEPOSIT_VERIFY: '/api/v1/paystack/payment/verify',
  WITHDRAW_INITIALIZE: '/api/v1/paystack/withdrawal/initialize'
}

export const PAYMENT_METHOD_API = {
  GET_PAYMENT_METHODS: '/api/v1/payment-methods',
  GET_PAYMENT_METHOD: (id: string) => `/api/v1/payment-methods/${id}`,
  CREATE_PAYMENT_METHOD: '/api/v1/payment-methods',
  UPDATE_PAYMENT_METHOD: (id: string) => `/api/v1/payment-methods/${id}`,
  DELETE_PAYMENT_METHOD: (id: string) => `/api/v1/payment-methods/${id}`,
}

export const API_ROUTES = {
  AUTH: AUTH_API,
  USERS: USER_API,
  UPLOADS: UPLOAD_API,
  OAUTH_CLIENTS: OAUTH_CLIENT_API,
  BLOCKED_IPS: BLOCKED_IP_API,
  DASHBOARD: DASHBOARD_API,
  FCM: FCM_API,
  NOTIFICATIONS: NOTIFICATION_API,
  BANK_ACCOUNTS: BANK_ACCOUNT_API,
  BANKS: BANK_API,
  CURRENCIES: CURRENCY_API,
  TRANSACTIONS: TRANSACTION_API,
  PAYMENT_METHODS: PAYMENT_METHOD_API,
}
