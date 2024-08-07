import { QueryFunctionContext, useMutation, useQuery, UseQueryResult } from '@tanstack/react-query'
import { useRouter } from 'next/router'
import { queryKeys } from '../../../query-keys/queryKeys'
import { api } from '../../axios/axiosInstance'
import useToast from '../../common/hooks/useToast'
import { getStoredUser } from '../../util/userStorage'

import { ProductReturnType, ProductType } from '../types/productTypes'

const addProduct = async (product: ProductType) => {
  const user = getStoredUser()
  if (user) {
    return api.post(
      '/product',
      {
        ...product,
      },
      {
        headers: { Authorization: `Bearer ${user?.token}` },
      }
    )
  }
}

export const useAddProduct = () => {
  const router = useRouter()
  const { fireToast } = useToast()
  const { mutate: addProductMutate } = useMutation({
    mutationFn: ({ product }: { product: ProductType }) => addProduct(product),
    onSuccess: () => {
      fireToast({
        id: '상품 등록',
        type: 'success',
        message: '상품 등록이 완료 되었습니다.',
        position: 'bottom',
        timer: 2000,
      })
      router.push('/product')
    },
    onError: () => {
      fireToast({
        id: '상품 등록 실패',
        type: 'failed',
        message: '상품 등록 실패',
        position: 'bottom',
        timer: 2000,
      })
    },
  })

  return { addProductMutate }
}
export const updateProductById = async (productId: number, product: ProductType) => {
  const user = getStoredUser()
  if (user) {
    const { data } = await api.patch(
      `/product/${productId}`,
      { ...product },
      { headers: { Authorization: `Bearer ${user?.token}` } }
    )
    return data
  }
}

export const useUpdateProductById = () => {
  const { fireToast } = useToast()
  const router = useRouter()
  const { mutate: updateProduct } = useMutation({
    mutationFn: ({ product, id }: { product: ProductType; id: number }) =>
      updateProductById(id, product),
    onSuccess: () => {
      // 지울 것
      fireToast({
        id: '상품 업데이트',
        type: 'success',
        message: '상품 업데이트가 완료 되었습니다.',
        position: 'bottom',
        timer: 2000,
      })
      router.reload()
    },
    onError: () => {
      fireToast({
        id: '상품 업데이트 실패',
        type: 'failed',
        message: '상품 업데이트에 실패했습니다.',
        position: 'bottom',
        timer: 2000,
      })
    },
  })
  return { updateProduct }
}

export const getProducts = async (): Promise<ProductReturnType[]> => {
  const user = getStoredUser()

  const { data } = await api.get(`product/all`, {
    headers: {
      Authorization: user ? `Bearer ${user?.token}` : undefined,
    },
  })

  return data
}

export const useGetProducts = (): {
  data: ProductReturnType[]
  isFetching: boolean
} => {
  const { fireToast } = useToast()
  const { data = [], isFetching } = useQuery({
    queryKey: [queryKeys.product],
    queryFn: getProducts,

    onError: (error) => {
      fireToast({
        id: '상품 조회',
        message: '새로고침을 눌러주세요',
        type: 'failed',
        position: 'bottom',
        timer: 2000,
      })
    },
  })

  return { data, isFetching }
}

export const getProductById = async (
  id: QueryFunctionContext<string[]> | string
): Promise<ProductReturnType> => {
  const { data } = await api.get(`/product/${id}`)
  return data
}

export const useGetProductById = (
  id: string
): { data: ProductReturnType | undefined; isFetching: boolean } => {
  const { data, isFetching } = useQuery({
    queryKey: [queryKeys.product, id],
    queryFn: () => getProductById(id),
  })
  return { data, isFetching }
}
