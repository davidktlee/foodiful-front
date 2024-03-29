// import { useQuery } from '@tanstack/react-query'
// import axios from 'axios'
// import { useEffect } from 'react'
// import { api } from '../../../axios/axiosInstance'
// import useToast from '../../../common/hooks/useToast'
// import { getStoredUser, removeStoredUser, setStoreUser } from '../../../util/userStorage'
// import { User } from '../../types/user'
// import { StoredUser, useUser } from '../useUser'

// const getUser = async (storedUser: StoredUser | null): Promise<User | undefined> => {
//   // user가 없을 경우 return
//   try {
//     if (!storedUser) return
//     const { data: user } = await api('/auth/authenticate', {
//       headers: { Authorization: `Bearer ${storedUser.token}` },
//     })
//     return user
//   } catch (error) {
//     if (axios.isAxiosError(error)) {
//       if (error.response?.status === 401) {
//         try {
//           const { refreshUser }: { refreshUser: User } = await api.post('/auth/refresh')

//           setStoreUser(refreshUser)
//           // router.reload()
//           fireToast({
//             id: '재 로그인',
//             type: 'success',
//             message: '재로그인 완료',
//             position: 'bottom',
//             timer: 2000,
//           })
//           return refreshUser
//         } catch (error) {
//           if (axios.isAxiosError(error)) {
//             if (error?.response?.status === 401) {
//               removeStoredUser()
//               alert('다시 로그인 해주세요')
//             } else if (error?.response?.status === 404) {
//               removeStoredUser()
//               alert('다시 로그인 해주세요')
//               router.reload()
//             }
//           }
//         }
//       }
//     }
//   }
// }

// const loginUser = () => {}

// export const useLoginUser = () => {
//   let storedUser: User | null = null
//   if (typeof window !== 'undefined') {
//     storedUser = getStoredUser()
//   }
//   const { getUser } = useUser()

//   const { data } = useQuery({
//     queryKey: ['user'],
//     queryFn: () => getUser(storedUser),

//     onSuccess: (received: User | null) => {
//       if (!received) {
//         removeStoredUser()
//       } else {
//         setStoreUser(received)
//       }
//     },
//   })
//   return { data }
// }
