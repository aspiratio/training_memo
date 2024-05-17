"use client"
import { WeeklyRecord } from "@/types/global"
import { getDailyRecordList, getTrainingMenuList } from "@/utils/request"
import { useEffect, useState } from "react"
import RecordList from "./RecordList"
import { calcWeeklyRecords } from "@/utils/aggregate"

const RecordPage = () => {
  const [weeklyRecords, setWeeklyRecords] = useState<WeeklyRecord[]>([])

  useEffect(() => {
    const getData = async () => {
      const menuList = await getTrainingMenuList()
      const dailyRecordList = await getDailyRecordList()
      setWeeklyRecords(calcWeeklyRecords(dailyRecordList, menuList))
    }
    getData()
  }, [])

  return (
    <>
      <RecordList weeklyRecords={weeklyRecords} />
    </>
  )
}

export default RecordPage
