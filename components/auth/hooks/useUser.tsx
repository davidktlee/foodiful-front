'use client'
import axios from 'axios'
import { api } from '../../axios/axiosInstance'
import useToast from '../../common/hooks/useToast'
import { getStoredUser, removeStoredUser, setStoreUser } from '../../util/userStorage'
import { User } from '../types/user'
import { useRouter } from 'next/router'

export interface UseUser {
  user: StoredUser | null | undefined
}
export interface StoredUser {
  email: string
  name: string
  token: string
}

export const useUser = () => {
  const router = useRouter()
  let storedUser: User | null = null
  if (typeof window !== 'undefined') {
    storedUser = getStoredUser()
  }
  const { fireToast } = useToast()
  const getUser = async (storedUser: StoredUser | null): Promise<User | undefined | null> => {
    // user가 없을 경우 return
    try {
      if (!storedUser) return null
      const { data: user } = await api('/auth/authenticate', {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      })
      return user
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          try {
            const { refreshUser }: { refreshUser: User } = await api.post('/auth/refresh')
            setStoreUser(refreshUser)
            fireToast({
              id: '재 로그인',
              type: 'success',
              message: '재로그인 완료',
              position: 'bottom',
              timer: 2000,
            })
            return refreshUser
          } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error?.response?.status === 401) {
                removeStoredUser()
                alert('다시 로그인 해주세요')
                router.push('/')
              } else if (error?.response?.status === 404) {
                removeStoredUser()
                alert('다시 로그인 해주세요')
                router.push('/')
                router.reload()
              }
            }
          }
        }
      }
    }
  }

  return { getUser }
}
