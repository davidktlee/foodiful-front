import { useMutation, useQuery } from '@tanstack/react-query'
import { queryKeys } from '../../../query-keys/queryKeys'
import { api } from '../../axios/axiosInstance'
import useToast from '../../common/hooks/useToast'
import { getStoredUser } from '../../util/userStorage'
import { GetOrderType } from '../types/getOrderType'
import { OrderPostType } from '../types/orderFormTypes'
import { PostOrderProductTypes } from '../types/postOrderProductTypes'

const postOrder = ({
  orderForm,
  orderProduct,
}: {
  orderForm: OrderPostType
  orderProduct: PostOrderProductTypes[]
}) => {
  const user = getStoredUser()
  return api.post(
    '/order',
    {
      orderForm: { ...orderForm, quantity: orderProduct.length },
      orderProduct,
    },
    {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }
  )
}

export const usePostOrder = () => {
  const { fireToast } = useToast()
  const { mutate } = useMutation({
    mutationFn: ({
      orderForm,
      orderProduct,
    }: {
      orderForm: OrderPostType
      orderProduct: PostOrderProductTypes[]
    }) => postOrder({ orderForm, orderProduct }),
    onSuccess: () => {
      fireToast({
        type: 'success',
        id: '주문 성공',
        position: 'bottom',
        timer: 2000,
        message: '주문 해주셔서 감사합니다.',
      })
    },
    onError: () => {
      fireToast({
        type: 'failed',
        id: '주문 실패',
        position: 'bottom',
        timer: 2000,
        message: '다시 주문해주세요.',
      })
    },
  })
  return { mutate }
}

const getOrder = async () => {
  const user = getStoredUser()

  const { data } = await api('/order', {
    headers: {
      Authorization: user ? `Bearer ${user.token}` : undefined,
    },
  })
  return data
}

export const useGetOrder = (userId?: number): { data: GetOrderType[] } => {
  const { fireToast } = useToast()
  const { data = [], isError } = useQuery({
    queryKey: [queryKeys.order, userId],
    queryFn: getOrder,
    enabled: !!userId,
    onSuccess: () => {},
    onError: (error) => {},
  })
  return { data }
}

// const updateOrder = async (orderId: string, updateOrderData) => {
//   const user = getStoredUser()
//   const { data } = await api.patch(
//     `/order/${orderId}`,
//     {
//       ...updateOrderData,
//     },
//     {
//       headers: {
//         Authorization: `Bearer ${user?.token}`,
//       },
//     }
//   )
//   return data
// }

// export const useUpdateOrder = () => {
//   const { mutate } = useMutation({
//     mutationFn: ({ orderId, updateOrderData }: { orderId: string }) =>
//       updateOrder(orderId, updateOrderData),
//     onSuccess: () => {},
//     onError: () => {},
//   })
//   return { mutate }
// }

const cancelOrder = async (orderId: string, refundReason: string) => {
  const user = getStoredUser()
  const { data } = await api.patch(
    `/order/cancel/${orderId}`,
    {
      refundReason,
    },
    {
      headers: {
        Authorization: `Bearer ${user?.token}`,
      },
    }
  )
  return data
}

export const useCancelOrder = () => {
  const { fireToast } = useToast()

  const { mutate } = useMutation({
    mutationFn: ({ orderId, refundReason }: { orderId: string; refundReason: string }) =>
      cancelOrder(orderId, refundReason),
    onSuccess: () => {
      fireToast({
        type: 'success',
        id: '주문 취소 성공',
        position: 'bottom',
        timer: 2000,
        message: '주문이 취소되었습니다.',
      })
    },
    onError: () => {},
  })
  return { mutate }
}
