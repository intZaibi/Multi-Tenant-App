'use server'

import { cookies } from 'next/headers'

export const setCookies = async (accessToken: string, refreshToken: string) => {
  const cookieStore = await cookies()
  cookieStore.set('accessToken', accessToken)
  cookieStore.set('refreshToken', refreshToken)
}

export const getCookies = async () => {
  const cookieStore = await cookies()
  return {
    accessToken: cookieStore.get('accessToken')?.value,
    refreshToken: cookieStore.get('refreshToken')?.value
  }
}

export const deleteCookies = async () => {
  const cookieStore = await cookies()
  cookieStore.delete('accessToken')
  cookieStore.delete('refreshToken')
}