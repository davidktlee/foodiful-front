import axios from 'axios'
import { useRouter } from 'next/router'
import { api } from '../../axios/axiosInstance'
import useToast from '../../common/hooks/useToast'
import { removeStoredUser, setStoreUser } from '../../util/userStorage'
import { PromiseUserType, SignInType, SignUpType } from '../types/user'

interface UseAuth {
  signIn: (param: SignInType) => void
  signUp: (param: SignUpType) => void
  signOut: () => void
}

export const useAuth = (): UseAuth => {
  const { fireToast } = useToast()
  const router = useRouter()

  const signIn = async ({ email, password }: SignInType) => {
    try {
      const { data } = await api.post<PromiseUserType>('/auth/login', {
        email,
        password,
      })
      if (data) {
        router.push('/')
        setStoreUser(data.user)
        fireToast({
          id: '로그인',
          type: 'success',
          position: 'bottom',
          message: '로그인이 완료되었습니다.',
          timer: 1000,
        })
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        fireToast({
          id: '로그인',
          type: 'failed',
          position: 'bottom',
          message: error.response?.data.message,
          timer: 2000,
        })
      }
    }
  }
  const signUp = async ({ email, password, phone, name }: SignUpType) => {
    try {
      const res = await api.post('/auth/signup', { email, name, password, phone })
      if (res) {
        fireToast({
          id: '회원가입 완료',
          type: 'success',
          position: 'bottom',
          message: '회원가입이 완료되었습니다. 로그인 해주세요.',
          timer: 2000,
        })
        router.push('/auth/login')
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        fireToast({
          id: '회원가입 이메일 에러',
          type: 'failed',
          position: 'bottom',
          message: error.response?.data.message,
          timer: 2000,
        })
      }
    }
  }
  const signOut = async () => {
    removeStoredUser()
    const res = await api.post('/auth/logout')
    if (res) {
      fireToast({
        id: '로그아웃',
        type: 'success',
        position: 'bottom',
        message: '로그아웃이 완료되었습니다.',
        timer: 2000,
      })
      router.push('/')
      router.reload()
    }
  }

  return { signIn, signUp, signOut }
}
