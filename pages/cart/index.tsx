import { AxiosResponse } from 'axios'
import { useRouter } from 'next/router'
import { useEffect, useState } from 'react'
import { api } from '../../components/axios/axiosInstance'
import CartList from '../../components/cart/CartList'
import { CartReturnType } from '../../components/cart/cartTypes'
import { useGetCartList } from '../../components/cart/hooks/useCart'
import Container from '../../components/common/Container'
import useToast from '../../components/common/hooks/useToast'
import StrongTitle from '../../components/common/StrongTitle'
import { getStoredUser } from '../../components/util/userStorage'

const CartPage = () => {
  const { fireToast } = useToast()
  const router = useRouter()

  const { data: cartLists, isFetching } = useGetCartList()
  useEffect(() => {
    const user = getStoredUser()
    if (!user) {
      fireToast({
        id: '장바구니 접속 실패',
        type: 'failed',
        message: '로그인 후에 이용해주세요.',
        timer: 1500,
        position: 'bottom',
      })
      router.push('/auth')
    }
  }, [])

  return (
    <Container>
      <div className="mt-[40px]">
        <StrongTitle title="장바구니" />
        {cartLists.length > 0 && <CartList cartLists={cartLists} />}
      </div>
    </Container>
  )
}
export default CartPage