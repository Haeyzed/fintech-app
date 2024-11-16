export interface BlockedIP {
  id: string
  ip_address: string
  reason: string
  blocked_until: string
  created_at: string
  updated_at: string
  deleted_at: string
  user: User
}

export interface OAuthClient {
  id: string
  name: string
  secret: string
  redirect: string
  vendor_id: string
  vendor_name: string
  client_app: string
  personal_access_client: string
  password_client: string
  revoked: string
  created_at: string
  updated_at: string
}

export interface User {
  id: string
  name: string
  email: string
  username: string
  phone: string
  role: string
  profile_image: string
  email_verified_at: string
  last_login_at: string
  current_login_at: string
  last_login_ip: string
  current_login_ip: string
  login_count: number
  provider: string
  provider_id: string
  google2fa_enabled: boolean
  recovery_codes: string[]
  created_at: string
  updated_at: string
  deleted_at: string
  blocked_ips?: BlockedIP[]
}

export interface BankAccount {
  id: string
  account_number: string
  account_type: string
  balance: string
  is_primary: boolean
  created_at: string
  updated_at: string
  user: User
  bank?: Bank
  currency?: Currency
}

export interface PaymentMethod {
  id: string
  type: string
  details: Record<string, string>
  is_active: boolean
  created_at: string
  updated_at: string
}

export interface Transaction {
  id: string
  reference: string
  type: string
  amount: string
  description: string
  created_at: string
  status: string
  updated_at: string
  start_balance: string
  end_balance: string
  user: User
  payment_method?: PaymentMethod
  bank_account?: BankAccount
}

export interface Bank {
  id: string
  name: string
  code: string
  slug: string
  long_code: string
  gateway: string | null
  pay_with_bank: boolean
  is_active: boolean
  type: string
  ussd: string | null
  logo: string | null
  created_at: string
  updated_at: string
  deleted_at: string | null
  country?: Country
  currency?: Currency
}

export interface Currency {
  id: string
  name: string
  code: string
  precision: number
  symbol: string
  symbol_native: string
  symbol_first: boolean
  decimal_mark: string
  thousands_separator: string
  country?: Country
}

export interface Country {
  id: string
  name: string
  iso2: string
  iso3: string
  phone_code: string
  region: string
  subregion: string
  native: string
  latitude: number
  longitude: number
  emoji: string
  emojiU: string
  status: boolean
}

export interface Response<T> {
  success: boolean
  message: string
  data: T
}

export interface PaginatedResponse<T> extends Response<T[]> {
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

export interface Upload {
  id: string
  filename: string
  path: string
  size: number
  mime_type: string
  created_at: string
  updated_at: string
}

export interface OAuthToken {
  id: string
  user_id: string
  client_id: string
  name: string
  scopes: string[]
  revoked: boolean
  created_at: string
  updated_at: string
  expires_at: string
}

export interface DashboardMetrics {
  total_users: number
  new_users_today: number
  active_users: number
  total_logins: number
}

// Notifications
export interface NotificationData {
  notifications: Notification[]
  unread_count: number
}

export interface Notification {
  id: string
  type: string
  data: Data2
  read_at: string
  created_at: string
}

export interface Data2 {
  notification: Notification2
  data: Data3
  image: string
}

export interface Notification2 {
  title: string
  body: string
}

export interface Data3 {
  type: string
}

export interface QueryParams {
  [key: string]: string | number | boolean | undefined
}
