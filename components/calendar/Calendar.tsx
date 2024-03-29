import dayjs from 'dayjs'
import React, { Dispatch, SetStateAction, useState } from 'react'
import useToast from '../common/hooks/useToast'
import CalendarContent from './CalendarContent'
import CalendarHeader from './CalendarHeader'

import isSameOrBefore from 'dayjs/plugin/isSameOrBefore'
dayjs.extend(isSameOrBefore)

interface PropsType {
  isTimeTableModalOpen: boolean
  setIsTimeTableModalOpen: Dispatch<SetStateAction<boolean>>
  reservedTimes: string[] | []
  selectedClass: { id: number; name: string; classDuration: number }
}

const Calendar = ({
  isTimeTableModalOpen,
  setIsTimeTableModalOpen,
  reservedTimes,
  selectedClass,
}: PropsType) => {
  const { fireToast } = useToast()
  const [currentDate, setCurrentDate] = useState(dayjs().format())
  const [selectedDate, setSelectedDate] = useState(dayjs().format())

  const onClickPrevMonth = () => {
    if (dayjs(currentDate).isBefore(dayjs())) {
      fireToast({
        id: '달력 뒤로가기 실패',
        type: 'failed',
        position: 'bottom',
        message: '현재 월 보다 전으로 갈 수 없습니다.',
        timer: 1000,
      })
      return
    }
    setCurrentDate(dayjs(currentDate).subtract(1, 'M').format())
  }
  const onClickNextMonth = () => {
    setCurrentDate(dayjs(currentDate).add(1, 'M').format())
  }
  /**
   * TODO: 날짜 선택했을 때 날짜에 맞는 시간을 띄워줘야 한다. 비어있는 시간, 차있는 시간
   */

  const onClickSelectDate = (day: string) => {
    if (dayjs(day).isSameOrBefore(dayjs(), 'd')) {
      fireToast({
        id: '달력 뒤로가기 실패',
        type: 'failed',
        position: 'bottom',
        message: '내일부터 선택 가능합니다.',
        timer: 1000,
      })
      return
    } else if (dayjs(day).day() === 0) {
      fireToast({
        id: '일요일 선택',
        type: 'failed',
        position: 'bottom',
        message: '일요일에는 예약이 불가능합니다.',
        timer: 1000,
      })
      return
    } else if (
      dayjs(currentDate).month() === dayjs(day).month() &&
      !dayjs(day).isBefore(dayjs(), 'd')
    ) {
      setSelectedDate(day)
      setIsTimeTableModalOpen(true)
    } else if (dayjs(currentDate).isBefore(dayjs(day), 'M')) {
      setCurrentDate(dayjs(currentDate).add(1, 'M').format())
      setSelectedDate(day)
    } else if (dayjs(currentDate).isAfter(dayjs(day), 'M')) {
      setCurrentDate(dayjs(currentDate).subtract(1, 'M').format())
      setSelectedDate(day)
    }
  }

  const onClickToToday = () => {
    setSelectedDate(dayjs().format())
    setCurrentDate(dayjs().format())
  }

  return (
    <>
      <CalendarHeader
        currentDate={currentDate}
        onClickToToday={onClickToToday}
        onClickPrevMonth={onClickPrevMonth}
        onClickNextMonth={onClickNextMonth}
      />

      <CalendarContent
        currentDate={currentDate}
        selectedDate={selectedDate}
        onClickSelectDate={onClickSelectDate}
        isTimeTableModalOpen={isTimeTableModalOpen}
        setIsTimeTableModalOpen={setIsTimeTableModalOpen}
        reservedTimes={reservedTimes}
        selectedClass={selectedClass}
      />
    </>
  )
}

export default Calendar
