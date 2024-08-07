import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { api } from '../../axios/axiosInstance'
import { queryKeys } from '../../../query-keys/queryKeys'
import useToast from '../../common/hooks/useToast'
import { getStoredUser } from '../../util/userStorage'
import { LectureType } from '../types/lectureTypes'
import { useRouter } from 'next/router'
import { isAxiosError } from 'axios'
import {
  InquiryType,
  PostInquiryType,
  PostRecommentType,
  RecommentType,
} from '../types/inquiryTypes'
import LectureInquiry from '../LectureInquiry'

export const getLectures = async (): Promise<LectureType[]> => {
  const user = getStoredUser()
  const { data } = await api('/lecture/all', {
    headers: {
      Authorization: user ? `Bearer ${user.token}` : undefined,
    },
  })
  return data
}

export const useGetLectures = (): { data: LectureType[]; isFetching: boolean } => {
  const { fireToast } = useToast()
  const { data = [], isFetching } = useQuery({
    queryKey: [queryKeys.lecture],
    queryFn: getLectures,
    onSuccess: () => {},
    onError: () => {
      fireToast({
        id: '전체 클래스 호출',
        message: '클래스를 불러오는데 실패했습니다. 다시 시도해주세요.',
        position: 'bottom',
        timer: 1000,
        type: 'failed',
      })
    },
  })
  return { data, isFetching }
}

export const getLectureByLectureId = async (id: string) => {
  const { data } = await api(`/lecture/${id}`)
  return data
}

export const useGetLectureByLectureId = (id: string) => {
  const { fireToast } = useToast()
  const { data, isFetching } = useQuery({
    queryKey: [queryKeys.lecture, id],
    queryFn: () => getLectureByLectureId(id),
    onSuccess: () => {},
    onError: () => {
      fireToast({
        id: '상세 클래스 호출',
        message: '클래스 상세 페이지를 불러오는데 실패했습니다. 다시 시도해주세요.',
        position: 'bottom',
        timer: 1000,
        type: 'failed',
      })
    },
  })
  return { data, isFetching }
}

const addLecture = async (lecture: Omit<LectureType, 'id'>) => {
  const user = getStoredUser()
  if (user) {
    return api.post(
      '/lecture',
      {
        ...lecture,
      },
      {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      }
    )
  }
}

export const useAddLecture = () => {
  const router = useRouter()
  const { fireToast } = useToast()
  const { mutate: addLectureMutate } = useMutation({
    mutationFn: ({ lecture }: { lecture: Omit<LectureType, 'id'> }) => addLecture(lecture),
    onSuccess: () => {
      fireToast({
        id: '클래스 등록',
        type: 'success',
        message: '클래스 등록이 완료 되었습니다.',
        position: 'bottom',
        timer: 2000,
      })
      router.push('/lecture')
    },
    onError: () => {
      fireToast({
        id: '클래스 등록 실패',
        type: 'failed',
        message: '클래스 등록 실패',
        position: 'bottom',
        timer: 2000,
      })
    },
  })

  return { addLectureMutate }
}

const updateLecture = async (lectureId: number, lecture: Omit<LectureType, 'id'>) => {
  const user = getStoredUser()
  if (user) {
    const { data } = await api.patch(
      `/lecture/${lectureId}`,
      {
        ...lecture,
      },
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    )
    return data
  }
}

export const useUpdateLecture = () => {
  const { fireToast } = useToast()
  const router = useRouter()
  const { mutate: updateLectureMutation } = useMutation({
    mutationFn: ({ lectureId, lecture }: { lectureId: number; lecture: Omit<LectureType, 'id'> }) =>
      updateLecture(lectureId, lecture),
    onSuccess: () => {
      fireToast({
        id: '클래스 업데이트',
        type: 'success',
        message: '클래스 업데이트가 완료 되었습니다.',
        position: 'bottom',
        timer: 2000,
      })
      router.push('/lecture')
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        fireToast({
          id: '클래스 업데이트 실패',
          type: 'failed',
          message: error.response?.data.message,
          position: 'bottom',
          timer: 2000,
        })
      }
      fireToast({
        id: '클래스 업데이트 실패',
        type: 'failed',
        message: '클래스 업데이트에 실패했습니다.',
        position: 'bottom',
        timer: 2000,
      })
    },
  })
  return { updateLectureMutation }
}

export const getLectureInquiryByLectureId = async (lectureId: string) => {
  const { data } = await api(`/lecture/inquiry/${lectureId}`)
  return data
}

export const useGetLectureInquiry = (lectureId: string) => {
  const { data } = useQuery({
    queryKey: [queryKeys.lecture, lectureId, queryKeys.inquiry],
    queryFn: () => getLectureInquiryByLectureId(lectureId),
  })
  return { data }
}

const postInquiry = async (lectureInquiry: PostInquiryType) => {
  const user = getStoredUser()
  if (user) {
    return api.post(
      '/lecture-inquiry',
      { ...lectureInquiry },
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    )
  }
}

export const usePostInquiry = (lectureId: string) => {
  const { fireToast } = useToast()
  const router = useRouter()
  const queryClient = useQueryClient()
  const { mutate: postInquiryMutate } = useMutation({
    mutationFn: ({ lectureInquiry }: { lectureInquiry: PostInquiryType }) =>
      postInquiry(lectureInquiry),
    onSuccess: () => {
      fireToast({
        id: '문의 등록',
        type: 'success',
        message: '문의 등록이 완료 되었습니다.',
        position: 'bottom',
        timer: 2000,
      })
      queryClient.invalidateQueries({ queryKey: [queryKeys.lecture, lectureId, queryKeys.inquiry] })
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        fireToast({
          id: '문의 등록 실패',
          type: 'failed',
          message: error.response?.data.message,
          position: 'bottom',
          timer: 2000,
        })
      }
      fireToast({
        id: '문의 등록 실패',
        type: 'failed',
        message: '문의 등록에 실패했습니다.',
        position: 'bottom',
        timer: 2000,
      })
    },
  })
  return { postInquiryMutate }
}

const deleteInquiry = async (id: number) => {
  const user = getStoredUser()
  if (user) {
    return api.delete(`/lecture-inquiry/${id}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  }
}

export const useDeleteInquiry = (lectureId: string) => {
  const { fireToast } = useToast()
  const queryClient = useQueryClient()
  const { mutate: deleteInquiryMutate } = useMutation({
    mutationFn: (id: number) => deleteInquiry(id),
    onSuccess: () => {
      fireToast({
        id: '문의 삭제',
        type: 'success',
        message: '문의 삭제가 완료 되었습니다.',
        position: 'bottom',
        timer: 2000,
      })
      queryClient.invalidateQueries({ queryKey: [queryKeys.lecture, lectureId, queryKeys.inquiry] })
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        fireToast({
          id: '문의 삭제 실패',
          type: 'failed',
          message: error.response?.data.message,
          position: 'bottom',
          timer: 2000,
        })
      }
      fireToast({
        id: '문의 삭제 실패',
        type: 'failed',
        message: '문의 삭제에 실패했습니다.',
        position: 'bottom',
        timer: 2000,
      })
    },
  })
  return { deleteInquiryMutate }
}

const postRecomment = async (recomment: PostRecommentType) => {
  const user = getStoredUser()
  if (user) {
    return api.post(
      '/recomment',
      {
        ...recomment,
      },
      {
        headers: { Authorization: `Bearer ${user.token}` },
      }
    )
  }
}

export const usePostRecomment = (parentId: number) => {
  const { fireToast } = useToast()
  const queryClient = useQueryClient()
  const { mutate: postRecommentMutate } = useMutation({
    mutationFn: ({ recomment }: { recomment: PostRecommentType }) => postRecomment(recomment),
    onSuccess: () => {
      fireToast({
        id: '댓글 등록',
        type: 'success',
        message: '댓글 등록이 완료 되었습니다.',
        position: 'bottom',
        timer: 2000,
      })
      queryClient.invalidateQueries({ queryKey: [queryKeys.inquiry, parentId] })
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        fireToast({
          id: '댓글 등록 실패',
          type: 'failed',
          message: error.response?.data.message,
          position: 'bottom',
          timer: 2000,
        })
      }
      fireToast({
        id: '댓글 등록 실패',
        type: 'failed',
        message: '댓글 등록에 실패했습니다.',
        position: 'bottom',
        timer: 2000,
      })
    },
  })
  return { postRecommentMutate }
}

const getInquiryRecomment = async (inquiryId: number) => {
  const { data } = await api(`/lecture-inquiry/recomment/${inquiryId}`)
  return data
}

export const useGetInquiryRecomment = (inquiryId: number): { data: RecommentType[] } => {
  const { data } = useQuery({
    queryKey: [queryKeys.inquiry, inquiryId],
    queryFn: () => getInquiryRecomment(inquiryId),
  })
  return { data }
}

const deleteInquiryRecomment = async (recommentId: number) => {
  const user = getStoredUser()
  if (user) {
    return api.delete(`/recomment/${recommentId}`, {
      headers: {
        Authorization: `Bearer ${user.token}`,
      },
    })
  }
}

export const useDeleteInquiryRecomment = (inquiryId: number) => {
  const { fireToast } = useToast()
  const queryClient = useQueryClient()
  const { mutate: deleteInquiryRecommentMutate } = useMutation({
    mutationFn: (recommentId: number) => deleteInquiryRecomment(recommentId),
    onSuccess: () => {
      fireToast({
        id: '댓글 삭제',
        type: 'success',
        message: '댓글 삭제가 완료 되었습니다.',
        position: 'bottom',
        timer: 2000,
      })
      queryClient.invalidateQueries({ queryKey: [queryKeys.inquiry, inquiryId] })
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        fireToast({
          id: '댓글 삭제 실패',
          type: 'failed',
          message: error.response?.data.message,
          position: 'bottom',
          timer: 2000,
        })
      }
      fireToast({
        id: '댓글 실패',
        type: 'failed',
        message: '댓글 삭제에 실패했습니다.',
        position: 'bottom',
        timer: 2000,
      })
    },
  })
  return { deleteInquiryRecommentMutate }
}

// const updateInquiryById = async (id: number, updateData: Partial<InquiryType>) => {
//   const user = getStoredUser()
//   if (user) {
//     return api.patch(
//       `/lecture-inquiry/${id}`,
//       {
//         ...updateData,
//       },
//       {
//         headers: { Authorization: `Bearer ${user.token}` },
//       }
//     )
//   }
// }

// export const useUpdateInquiryById = () => {
//   const { fireToast } = useToast()
//   const router = useRouter()
//   const { mutate: updateInquiryByIdMutate } = useMutation({
//     mutationFn: ({ id, updateData }: { id: number; updateData: Partial<InquiryType> }) =>
//       updateInquiryById(id, updateData),
//     onSuccess: () => {
//       fireToast({
//         id: '문의 업데이트',
//         type: 'success',
//         message: '문의 업데이트가 완료 되었습니다.',
//         position: 'bottom',
//         timer: 2000,
//       })
//       router.reload()
//     },
//     onError: () => {
//       fireToast({
//         id: '상품 업데이트 실패',
//         type: 'failed',
//         message: '상품 업데이트에 실패했습니다.',
//         position: 'bottom',
//         timer: 2000,
//       })
//     },
//   })
//   return { updateInquiryByIdMutate }
// }
// const updateInquiryRecomment = async (id: number, updateData: Partial<RecommentType>) => {
//   const user = getStoredUser()
//   if (user) {
//     return api.patch(
//       `/recomment/${id}`,
//       {
//         ...updateData,
//       },
//       {
//         headers: { Authorization: `Bearer ${user.token}` },
//       }
//     )
//   }
// }

// export const useUpdateInquiryRecommentById = () => {
//   const { fireToast } = useToast()
//   const router = useRouter()
//   const { mutate: updateInquiryRecommentMutate } = useMutation({
//     mutationFn: ({ id, updateData }: { id: number; updateData: Partial<RecommentType> }) =>
//       updateInquiryRecomment(id, updateData),
//     onSuccess: () => {
//       fireToast({
//         id: '문의 업데이트',
//         type: 'success',
//         message: '문의 업데이트가 완료 되었습니다.',
//         position: 'bottom',
//         timer: 2000,
//       })
//       router.reload()
//     },
//     onError: () => {
//       fireToast({
//         id: '상품 업데이트 실패',
//         type: 'failed',
//         message: '상품 업데이트에 실패했습니다.',
//         position: 'bottom',
//         timer: 2000,
//       })
//     },
//   })
//   return { updateInquiryRecommentMutate }
// }
