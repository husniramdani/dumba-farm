'use client'

import { useAuth } from '@clerk/nextjs'

export const API_URL =
  process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'

export function useFetch() {
  const { getToken } = useAuth()

  return async function fetcher<T>(
    endpoint: string,
    options?: RequestInit,
  ): Promise<T> {
    const token = await getToken({ template: 'development' })

    const defaultHeaders: HeadersInit = {
      'Content-Type': 'application/json',
    }

    if (token) {
      defaultHeaders.Authorization = `Bearer ${token}`
    }

    const response = await fetch(`${API_URL}${endpoint}`, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options?.headers,
      },
    })

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`)
    }

    return response.json()
  }
}
