import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import { Hydrate, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { Provider, useSetAtom } from 'jotai'
import ToastList from '../components/common/toast/ToastList'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import React, { ReactElement, ReactNode, useEffect } from 'react'
import { NextPage } from 'next'

import HeaderNavMobile from '../components/common/header/mobile/HeaderNavMobile'
import { getStoredUser, removeStoredUser, setStoreUser } from '../components/util/userStorage'
import { useUser } from '../components/auth/hooks/useUser'

import { useRouter } from 'next/router'
import { getQueryClient } from '../components/util/getQueryClient'
import ModalContainer from '../components/common/modal/ModalContainer'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
} // 기존 AppProps타입에 Layout을 추가한 것.
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter()
  const { getUser } = useUser()

  useEffect(() => {
    const storedUser = getStoredUser()
    ;(async () => {
      if (storedUser) {
        const res = await getUser(storedUser)
        setStoreUser(res)
      } else {
        removeStoredUser()
      }
    })()
  }, [])

  const queryClient = getQueryClient()

  const getLayout =
    Component.getLayout ||
    ((page: React.ReactElement) => (
      <QueryClientProvider client={queryClient}>
        <Hydrate state={pageProps.dehydratedState}>
          <Provider>
            <ToastList />
            <HeaderNavMobile />
            <ModalContainer />
            <Layout>
              <div className="w-full mx-auto">{page}</div>
            </Layout>
          </Provider>
        </Hydrate>
        <ReactQueryDevtools initialIsOpen={true} />
      </QueryClientProvider>
    ))

  return getLayout(<Component {...pageProps} />)
}

export default MyApp
