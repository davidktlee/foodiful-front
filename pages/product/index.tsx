import { useRouter } from 'next/router'
import { Button } from '../../components/common/Button'
import { getStoredUser, setStoreUser } from '../../components/util/userStorage'
import ProductList from '../../components/product/ProductList'
import { useEffect, useState } from 'react'
import { User } from '../../components/auth/types/user'
import { getProducts, useGetProducts } from '../../components/product/hooks/useProduct'
import { InferGetServerSidePropsType } from 'next'
import { api } from '../../components/axios/axiosInstance'
import { ProductReturnType } from '../../components/product/types/productTypes'

import { useUser } from '../../components/auth/hooks/useUser'
import StrongTitle from '../../components/common/StrongTitle'
import { ProductSkeleton } from '../../components/common/skeleton/Skeleton'

export const getServerSideProps = async (): Promise<{
  props: { products: ProductReturnType[] }
}> => {
  const { data: products = [] } = await api('/product/all')

  return { props: { products } }
}

function ProductPage({ products }: InferGetServerSidePropsType<typeof getServerSideProps>) {
  const [user, setUser] = useState<User | null>(null)
  const router = useRouter()
  const { getUser } = useUser()

  useEffect(() => {
    ;(async () => {
      const storedUser = getStoredUser()
      if (storedUser) {
        const fetchedUser = await getUser(storedUser)
        if (fetchedUser) {
          setUser(fetchedUser)
          setStoreUser(fetchedUser)
        }
      } else {
        setUser(null)
      }
    })()
  }, [])

  const { data: productsUserLiked, isFetching } = useGetProducts()

  const onClickAddBtn = () => {
    router.push('/product/add')
  }

  return (
    <>
      {user && user.role === 'ADMIN' && (
        <div className="flex justify-center pt-2">
          <Button
            size="md"
            title="상품 추가"
            style="border-2 border-main hover:bg-main hover:text-white"
            onClick={onClickAddBtn}
          />
        </div>
      )}
      <div className="mx-auto w-[80%] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <StrongTitle title="상품" style="border-b-2 border-main pb-2" />
        {isFetching ? (
          <ProductSkeleton count={3} />
        ) : (
          <ProductList products={user ? productsUserLiked : products} />
        )}
      </div>
    </>
  )
}

export default ProductPage
