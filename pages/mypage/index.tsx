import { useEffect, useState } from 'react'
import { User } from '../../components/auth/types/user'
import { getStoredUser } from '../../components/util/userStorage'
import { getMyPageLayout } from './getMyPageLayout'
import StrongTitle from '../../components/common/StrongTitle'
import { useRouter } from 'next/router'
import useToast from '../../components/common/hooks/useToast'
import ProductItem from '../../components/product/ProductItem'
import { useGetOrder } from '../../components/order/hooks/useOrder'
import PurchasedTitle from '../../components/purchase/PurchasedTitle'
import PurchasedOrderItem from '../../components/purchase/PurchasedOrderItem'
import { Button } from '../../components/common/Button'
import { useGetFavoriteProducts } from '../../components/common/favorite/hooks/useFavorite'
import { useGetReservationByUserId } from '../../components/calendar/hooks/useReservation'
import { useGetReviewByUserId } from '../../components/review/hooks/useReviews'

function MyPage() {
  const [user, setUser] = useState<User>()

  const { data: myReviews } = useGetReviewByUserId(user?.id)
  const { data: myPurchasedList } = useGetOrder()
  const { data: myFavoriteProducts } = useGetFavoriteProducts()
  const { data: myReservations } = useGetReservationByUserId(user?.id)

  const router = useRouter()
  const { fireToast } = useToast()
  useEffect(() => {
    const storedUser = getStoredUser()
    if (storedUser) {
      setUser(storedUser)
    } else {
      fireToast({
        id: '재로그인',
        type: 'failed',
        message: '다시 로그인 해주세요.',
        position: 'bottom',
        timer: 1000,
      })
      router.push('/')
    }
  }, [])

  return (
    <div className="grow shadow-basic rounded-md px-5">
      <div className="border-t-2 border-t-active py-2 my-12">
        <StrongTitle title="로그인 정보" />
        <div className="my-4">
          <div className="text-main text-lg font-bold">{user?.email}</div>
          <div className="text-main text-lg font-bold">{user?.name}</div>님
        </div>
      </div>
      <div className="w-full my-12 border-t-2 border-t-active py-2">
        <div className="flex justify-between">
          <StrongTitle title="좋아하는 상품" />
        </div>
        {!!myFavoriteProducts.length ? (
          <>
            <div className="grid justify-center md:justify-start md:grid-cols-3 my-12 items-center">
              {myFavoriteProducts.slice(0, 4).map((product) => (
                <ProductItem key={product.id} product={product} mini={true} />
              ))}
            </div>
            <div className="flex justify-content my-2">
              <Button
                title="더 보기"
                onClick={() => {
                  router.push('/mypage/purchased')
                }}
                style="mx-auto bg-main text-white"
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center my-[50px] text-main text-xl font-bold">
            좋아요 누른 상품이 없습니다.
          </div>
        )}
      </div>
      <div className="w-full my-12 border-t-2 border-t-active py-2">
        <StrongTitle title="내 후기 보기" />
        {!!myReviews.length ? (
          <></>
        ) : (
          <div className="flex justify-center my-[50px] text-main text-xl font-bold">
            작성하신 후기가 없습니다.
          </div>
        )}
      </div>
      <div className="w-full my-12 border-t-2 border-t-active py-2">
        <StrongTitle title="주문/배송 내역" />
        {!!myPurchasedList.length ? (
          <>
            <PurchasedTitle />
            {myPurchasedList.slice(0, 5).map((purchased) => (
              <PurchasedOrderItem key={purchased.id} order={purchased} />
            ))}
            <div className="flex justify-content my-2">
              <Button
                title="더 보기"
                onClick={() => {
                  router.push('/mypage/purchased')
                }}
                style="mx-auto bg-main text-white"
              />
            </div>
          </>
        ) : (
          <div className="flex justify-center my-[50px] text-main text-xl font-bold">
            주문 내역이 없습니다.
          </div>
        )}
      </div>

      <div className="w-full my-12 border-t-2 border-t-active py-2">
        <StrongTitle title="예약 내역" />
        {!!myReservations.length ? (
          <div>
            {myReservations.map((reservation) => (
              <div key={reservation.id}>{reservation.reserveDate}</div>
            ))}
          </div>
        ) : (
          <div className="flex justify-center my-[50px] text-main text-xl font-bold">
            예약 내역이 없습니다.
          </div>
        )}
      </div>
    </div>
  )
}

MyPage.getLayout = getMyPageLayout

export default MyPage
