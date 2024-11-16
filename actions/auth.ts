// actions/auth.ts

'use server'

import * as z from 'zod'
import {
  forgotPasswordSchema,
  signInSchema,
  signUpSchema,
  verifyEmailSchema
} from '@/lib/zod'
import { signIn, signOut } from '@/auth'
import { AuthError } from 'next-auth'
import { API_ROUTES, API_URL, AUTH_API } from '@/routes';
import { post } from '@/lib/api-utils';
import { Response } from '@/types';

export async function login(
  values: z.infer<typeof signInSchema>,
  callbackUrl?: string | null
) {
  const validatedFields = signInSchema.safeParse(values)
  if (!validatedFields.success) {
    return { success: false, message: 'Invalid fields' }
  }
  const { email, password } = validatedFields.data
  try {
    // const response = post<Response<{ requires_2fa: string, user_id: string, is_setup: boolean }>>(
    //   `${API_URL}${API_ROUTES.AUTH.LOGIN}`,
    //   validatedFields
    // );
    // if (response){
    //
    // }
    const result = await signIn('credentials', {
      email,
      password,
      redirect: false,
      callbackUrl: callbackUrl || '/dashboard'
    })
    if (result?.error) {
      return { success: false, message: 'Invalid credentials' }
    }
    if (result?.url) {
      return {
        success: true,
        message: 'Logged in successfully',
        url: result.url
      }
    }
    return { success: true, message: 'Logged in successfully' }
  } catch (error) {
    if (error instanceof AuthError) {
      switch (error.type) {
        case 'CredentialsSignin':
          return { success: false, message: 'Invalid credentials' }
        default:
          return { success: false, message: 'Something went wrong' }
      }
    }
    throw error
  }
}

export async function refreshAccessToken(token: any) {
  try {
    const response = await fetch(`${API_URL}${AUTH_API.REFRESH}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        Authorization: `Bearer ${token.refreshToken}`
      }
    })
    const data = await response.json()
    if (!response.ok) {
      throw new Error('RefreshAccessTokenError')
    }
    if (data.success && data.data) {
      return {
        ...token,
        accessToken: data.data.access_token,
        refreshToken: data.data.refresh_token,
        accessTokenExpires: Date.now() + data.data.expires_in * 1000
      }
    } else {
      throw new Error('RefreshAccessTokenError')
    }
  } catch (error) {
    console.error('Error refreshing access token:', error)
    return {
      ...token,
      error: 'RefreshAccessTokenError'
    }
  }
}

export async function logout() {
  await signOut({ redirectTo: '/' })
}

export async function signUp(values: z.infer<typeof signUpSchema>) {
  const validatedFields = signUpSchema.safeParse(values)
  if (!validatedFields.success) {
    return {
      success: false,
      message: 'Invalid fields',
      errors: validatedFields.error.flatten().fieldErrors
    }
  }
  const { name, email, password } = validatedFields.data
  try {
    const response = await fetch(`${API_URL}${AUTH_API.REGISTER}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ name, email, password })
    })
    const data = await response.json()
    if (!response.ok) {
      return { success: false, message: data.message || 'Registration failed' }
    }
    return {
      success: true,
      message: 'Registration successful. Please verify your email.'
    }
  } catch (error) {
    console.error('Error during registration:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}

export async function verifyEmail(values: z.infer<typeof verifyEmailSchema>) {
  const validatedFields = verifyEmailSchema.safeParse(values)
  if (!validatedFields.success) {
    return { success: false, message: 'Invalid token' }
  }
  const { token } = validatedFields.data
  try {
    const response = await fetch(`${API_URL}${AUTH_API.VERIFY_EMAIL}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ token })
    })
    const data = await response.json()
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Email verification failed'
      }
    }
    return { success: true, message: 'Email verified successfully' }
  } catch (error) {
    console.error('Error during email verification:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}

export async function forgotPassword(
  values: z.infer<typeof forgotPasswordSchema>
) {
  const validatedFields = forgotPasswordSchema.safeParse(values)
  if (!validatedFields.success) {
    return { success: false, message: 'Invalid email' }
  }
  const { email } = validatedFields.data
  try {
    const response = await fetch(`${API_URL}${AUTH_API.FORGOT_PASSWORD}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json'
      },
      body: JSON.stringify({ email })
    })
    const data = await response.json()
    if (!response.ok) {
      return {
        success: false,
        message: data.message || 'Password reset request failed'
      }
    }
    return {
      success: true,
      message: 'Password reset instructions sent to your email'
    }
  } catch (error) {
    console.error('Error during password reset request:', error)
    return { success: false, message: 'An unexpected error occurred' }
  }
}
