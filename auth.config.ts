import type { NextAuthConfig } from 'next-auth'
import Credentials from 'next-auth/providers/credentials'
import { signInSchema } from '@/lib/zod'
import { API_URL, AUTH_API, authRoutes, protectedRoutes } from './routes'

export const authConfig = {
  pages: {
    signIn: '/'
  },
  callbacks: {
    authorized({ auth, request: { nextUrl } }) {
      const isLoggedIn = !!auth?.user
      const isOnAuthRoute = authRoutes.includes(nextUrl.pathname)
      const isOnProtectedRoute = protectedRoutes.some(route =>
        nextUrl.pathname.startsWith(route)
      )

      if (isOnProtectedRoute) {
        if (isLoggedIn) return true
        return false
      } else if (isLoggedIn && isOnAuthRoute) {
        return Response.redirect(new URL('/dashboard', nextUrl))
      }
      return true
    }
  },
  providers: [
    Credentials({
      async authorize(credentials) {
        try {
          const validatedFields = signInSchema.safeParse(credentials)

          if (!validatedFields.success) {
            return null
          }

          const { email, password } = validatedFields.data

          const response = await fetch(`${API_URL}${AUTH_API.LOGIN}`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Accept: 'application/json'
            },
            body: JSON.stringify({ email, password })
          })

          const data = await response.json()

          if (!response.ok || !data.success) {
            console.error('Login failed:', data.message)
            return null
          }

          return {
            id: data.data.user.id,
            name: data.data.user.name,
            email: data.data.user.email,
            username: data.data.user.username,
            phone: data.data.user.phone,
            role: data.data.user.role,
            profile_image: data.data.user.profile_image,
            email_verified_at: data.data.user.email_verified_at,
            last_login_at: data.data.user.last_login_at,
            current_login_at: data.data.user.current_login_at,
            last_login_ip: data.data.user.last_login_ip,
            current_login_ip: data.data.user.current_login_ip,
            login_count: data.data.user.login_count,
            provider: data.data.user.provider,
            provider_id: data.data.user.provider_id,
            google2fa_enabled: data.data.user.google2fa_enabled,
            recovery_codes: data.data.user.recovery_codes,
            created_at: data.data.user.created_at,
            updated_at: data.data.user.updated_at,
            deleted_at: data.data.user.deleted_at,
            accessToken: data.data.access_token,
            refreshToken: data.data.refresh_token
          }
        } catch (error) {
          console.error('Authorization error:', error)
          return null
        }
      }
    })
  ]
} satisfies NextAuthConfig
