import NextAuth from 'next-auth'
import { authConfig } from './auth.config'
import { refreshAccessToken } from '@/actions/auth'

export const { handlers, auth, signIn, signOut } = NextAuth({
  ...authConfig,
  session: { strategy: 'jwt' },
  callbacks: {
    async jwt({ token, user, account }) {
      if (account && user) {
        token = { ...token, ...user }
      }

      // If the token has not expired, return it
      if (Date.now() < (token.accessTokenExpires as number)) {
        return token
      }

      // If the token has expired, try to refresh it
      return refreshAccessToken(token)
    },
    async session({ session, token }) {
      session.user = {
        ...session.user,
        id: token.id as string,
        username: token.username as string,
        phone: token.phone as string,
        role: token.role as string,
        profile_image: token.profile_image as string | null,
        email_verified_at: token.email_verified_at as string | null,
        last_login_at: token.last_login_at as string | null,
        current_login_at: token.current_login_at as string | null,
        last_login_ip: token.last_login_ip as string | null,
        current_login_ip: token.current_login_ip as string | null,
        login_count: token.login_count as number,
        provider: token.provider as string | null,
        provider_id: token.provider_id as string | null,
        google2fa_enabled: token.google2fa_enabled as boolean,
        recovery_codes: token.recovery_codes as string[] | null,
        created_at: token.created_at as string,
        updated_at: token.updated_at as string,
        deleted_at: token.deleted_at as string | null,
        accessToken: token.accessToken as string,
        refreshToken: token.refreshToken as string
      }
      // session.error = token.error as string | undefined

      return session
    }
  }
})
