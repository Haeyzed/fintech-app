import { auth } from '@/auth'
import { cookies } from 'next/headers'

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

interface FetchOptions extends RequestInit {
  method: HttpMethod
  headers?: Record<string, string>
  body?: Record<string, unknown> | FormData | undefined
}

interface PaginatedResponse<T> {
  success: boolean
  message: string
  data: T[]
  meta: {
    current_page: number
    last_page: number
    per_page: number
    total: number
  }
}

async function fetchWithAuth(url: string, options: FetchOptions) {
  const session = await auth()

  const cookieStore = cookies()
  const locale = cookieStore.get('NEXT_LOCALE')?.value || 'en'

  const headers: Record<string, string> = {
    'Accept-Language': locale,
    ...options.headers
  }

  if (session && session.user) {
    headers['Authorization'] = `Bearer ${session.user.accessToken}`
  }

  if (!(options.body instanceof FormData)) {
    headers['Content-Type'] = 'application/json'
  }

  const response = await fetch(url, {
    ...options,
    headers,
    body:
      options.body instanceof FormData
        ? options.body
        : JSON.stringify(options.body)
  })

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({}))
    throw new Error(errorData.message || response.statusText)
  }

  return response.json()
}

export async function get<T>(url: string): Promise<T> {
  return fetchWithAuth(url, { method: 'GET' })
}

export async function getAll<T>(url: string): Promise<PaginatedResponse<T>> {
  return fetchWithAuth(url, { method: 'GET' })
}

export async function post<T>(
  url: string,
  data: Record<string, unknown> | FormData
): Promise<T> {
  return fetchWithAuth(url, {
    method: 'POST',
    body: data
  })
}

export async function put<T>(
  url: string,
  data: Record<string, unknown> | FormData
): Promise<T> {
  return fetchWithAuth(url, {
    method: 'PUT',
    body: data
  })
}

export async function patch<T>(
  url: string,
  data: Record<string, unknown> | FormData
): Promise<T> {
  return fetchWithAuth(url, {
    method: 'PATCH',
    body: data
  })
}

export async function del<T>(url: string): Promise<T> {
  return fetchWithAuth(url, { method: 'DELETE' })
}
