'use client';

import { useSession, signIn, signOut } from 'next-auth/react'
import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { logout } from '@/actions/api-actions'
import { toast } from 'sonner'

export function useAuth(requireAuth: boolean = true) {
  const { data: session, status, update } = useSession()
  const router = useRouter()

  useEffect(() => {
    if (requireAuth && status === 'unauthenticated') {
      router.push('/login')
    }
  }, [requireAuth, status, router])

  const handleLogout = async () => {
    try {
      const result = await logout()
      if (result.success) {
        await signOut({ redirect: false })
        toast.success('Logged out successfully', {
          description: result.message
        })
      } else {
        console.error('Logout failed:', result.message)
        toast.error('Logout failed', {
          description: result.message
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
      toast.error('An unexpected error occurred during logout')
    } finally {
      // Always redirect to login page after logout attempt
      router.push('/login')
    }
  }

  useEffect(() => {
    if (session?.error === 'RefreshAccessTokenError') {
      // Force sign in to potentially resolve the error
      signIn()
    }
  }, [session])

  return { session, status, logout: handleLogout, update }
}