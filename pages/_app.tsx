import '../styles/globals.css'
import type { AppProps } from 'next/app'
import Layout from '../components/layout/Layout'
import { Hydrate } from '@tanstack/react-query'
import { Provider, useSetAtom } from 'jotai'
import ToastList from '../components/common/toast/ToastList'
import React, { ReactElement, ReactNode, useEffect } from 'react'
import { NextPage } from 'next'
import HeaderNavMobile from '../components/common/header/mobile/HeaderNavMobile'
import { getStoredUser, removeStoredUser, setStoreUser } from '../components/util/userStorage'
import { useUser } from '../components/auth/hooks/useUser'
import { useRouter } from 'next/router'
import ModalContainer from '../components/common/modal/ModalContainer'
import RQProvider from '../components/util/RQProvider'
import Head from 'next/head'
import MetaHead from '../components/common/MetaHead'
import { isMobileDisplay } from '../store/isMobileDisplay'

export type NextPageWithLayout = NextPage & {
  getLayout?: (page: ReactElement) => ReactNode
}

type AppPropsWithLayout = AppProps & {
  Component: NextPageWithLayout
} // 기존 AppProps타입에 Layout을 추가한 것.
function MyApp({ Component, pageProps }: AppPropsWithLayout) {
  const router = useRouter()
  const { getUser } = useUser()

  const setIsMobile = useSetAtom(isMobileDisplay)

  const handleResize = () => {
    if (window.innerWidth < 950) {
      window.localStorage.setItem('isMobile', 'true')
      setIsMobile(true)
    } else {
      window.localStorage.setItem('isMobile', 'false')
      setIsMobile(false)
    }
  }

  useEffect(() => {
    const isMobile = window.localStorage.getItem('isMobile')
    setIsMobile(isMobile === 'true' ? true : false)
    window.addEventListener('resize', handleResize)
    return () => window.removeEventListener('resize', handleResize)
  }, [])

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

  const getLayout =
    Component.getLayout ||
    ((page: React.ReactElement) => (
      <>
        <MetaHead
          title="푸디풀 FOODIFUL"
          description="한식 디저트 구매와 한식 디저트 수업을 예약할 수 있는 사이트입니다."
        />
        <RQProvider>
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
        </RQProvider>
      </>
    ))

  return getLayout(<Component {...pageProps} />)
}

export default MyApp
