import type { InferGetServerSidePropsType } from 'next'
import { useState } from 'react'
import { getStoredUser } from '../components/util/userStorage'
import ProductList from '../components/product/ProductList'
import { User } from '../components/auth/types/user'
import { useGetProducts } from '../components/product/hooks/useProduct'
import { useGetLectures } from '../components/lecture/hooks/useLecture'
import LectureList from '../components/lecture/LectureList'
import { ProductReturnType } from '../components/product/types/productTypes'
import { LectureType } from '../components/lecture/types/lectureTypes'
import { api } from '../components/axios/axiosInstance'
import { ProductSkeleton, LectureSkeleton } from '../components/common/skeleton/Skeleton'
import StrongTitle from '../components/common/StrongTitle'

export const getServerSideProps = async (): Promise<{
  props: { products: ProductReturnType[]; lectures: LectureType[] }
}> => {
  const { data: products } = await api('/product/all')
  const { data: lectures } = await api('/lecture/all')

  return { props: { products, lectures } }
}

const Home = ({ products, lectures }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const [user, setUser] = useState<User | null>(
    typeof window !== 'undefined' ? getStoredUser() : null
  )

  const { data: productsUserLiked, isFetching: isProductsFetching } = useGetProducts()
  const { data: lectureUserLiked, isFetching: isLecturesFetching } = useGetLectures()

  return (
    <>
      <div className="relative w-full">
        <div className="w-[80%] mx-auto px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
          <StrongTitle title="상품" style="border-b-2 border-main pb-2" />
          <ProductList products={user ? productsUserLiked : products} />
        </div>
        <div className="w-[80%] mx-auto px-4 sm:px-6 py-8 lg:px-8">
          <StrongTitle title="클래스" style="border-b-2 border-main pb-2" />
          <LectureList lectureList={user ? lectureUserLiked : lectures} />
        </div>
      </div>
    </>
  )
}

export default Home
