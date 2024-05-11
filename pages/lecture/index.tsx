import { InferGetServerSidePropsType } from 'next'
import React, { useEffect, useState } from 'react'
import { User } from '../../components/auth/types/user'
import { LectureType } from '../../components/lecture/types/lectureTypes'
import { getLectures, useGetLectures } from '../../components/lecture/hooks/useLecture'
import LectureList from '../../components/lecture/LectureList'
import { getStoredUser } from '../../components/util/userStorage'
import { Button } from '../../components/common/Button'
import { useRouter } from 'next/router'
import { DehydratedState, QueryClient, dehydrate } from '@tanstack/react-query'
import { queryKeys } from '../../query-keys/queryKeys'
import { ProductSkeleton } from '../../components/common/skeleton/Skeleton'
import { api } from '../../components/axios/axiosInstance'

export const getServerSideProps = async (): Promise<{ props: { lectures: LectureType[] } }> => {
  const { data: lectures = [] } = await api('/lecture/all')
  return { props: { lectures } }
}

const LecturePage = ({ lectures }: InferGetServerSidePropsType<typeof getServerSideProps>) => {
  const { data: lectureUserLiked, isFetching } = useGetLectures()
  const { push } = useRouter()
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const storedUser = getStoredUser()
    if (storedUser) {
      setUser(storedUser)
    }
  }, [])

  const onClickAddBtn = () => {
    push('/lecture/add')
  }

  return (
    <>
      {user && user.role === 'ADMIN' && (
        <div className="flex justify-center pt-2">
          <Button style="text-xl" size="md" title="클래스 추가" onClick={onClickAddBtn} />
        </div>
      )}
      <div className="mx-auto w-[80%] px-4 py-16 sm:px-6 sm:py-24 lg:px-8">
        <LectureList lectureList={user ? lectureUserLiked : lectures} />
      </div>
    </>
  )
}

export default LecturePage