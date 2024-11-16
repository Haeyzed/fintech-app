import { DefaultSession, DefaultUser } from 'next-auth'

declare module 'next-auth' {
  interface Session extends DefaultSession {
    user: User & DefaultSession['user']
    error?: 'RefreshAccessTokenError'
  }

  interface User extends DefaultUser {
    id: string
    name: string
    email: string
    username: string
    phone: string
    role: string
    profile_image: string | null
    email_verified_at: string | null
    last_login_at: string | null
    current_login_at: string | null
    last_login_ip: string | null
    current_login_ip: string | null
    login_count: number
    provider: string | null
    provider_id: string | null
    google2fa_enabled: boolean
    recovery_codes: string[] | null
    created_at: string
    updated_at: string
    deleted_at: string | null
    accessToken: string
    refreshToken: string
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string
    refreshToken: string
    accessTokenExpires: number
    error?: 'RefreshAccessTokenError'
  }
}
