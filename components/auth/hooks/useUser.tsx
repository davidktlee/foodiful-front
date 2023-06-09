'use client'
import axios, { AxiosResponse } from 'axios'
import { useQuery, useQueryClient } from '@tanstack/react-query'
import { queryKeys } from '../../../query-keys/queryKeys'
import { api } from '../../axios/axiosInstance'
import useToast from '../../common/hooks/useToast'
import { getStoredUser, removeStoredUser, setStoreUser } from '../../util/userStorage'
import { User } from '../types/user'
import Router, { useRouter } from 'next/router'

interface UseUser {
  user: StoredUser | null | undefined
}
interface StoredUser {
  email: string
  name: string
  token: string
}

export const useUser = (): any => {
  const router = useRouter()
  // let storedUser: User | null = null
  // if (typeof window !== 'undefined') {
  //   storedUser = getStoredUser()
  // }
  const { fireToast } = useToast()
  const getUser = async (storedUser: StoredUser | null) => {
    // user가 없을 경우 return
    try {
      if (!storedUser) return null
      const { data }: AxiosResponse<{ user: StoredUser }> = await api.get('/auth/authenticate', {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      })
      return data.user
    } catch (error) {
      if (axios.isAxiosError(error)) {
        if (error.response?.status === 401) {
          try {
            const res = await api.post('/auth/refresh')
            setStoreUser(res.data.refreshUser)
            // router.reload()
            fireToast({
              id: '재 로그인',
              type: 'success',
              message: '재로그인 완료',
              position: 'bottom',
              timer: 2000,
            })
            return res.data
          } catch (error) {
            if (axios.isAxiosError(error)) {
              if (error?.response?.status === 401) {
                removeStoredUser()
                alert('다시 로그인 해주세요')
                router.reload()
              } else if (error?.response?.status === 404) {
                removeStoredUser()
                alert('다시 로그인 해주세요')
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
