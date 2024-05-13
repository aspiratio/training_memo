"use client"
import { TrainingMenu, WeeklyRecord } from "@/types/global"
import { getDailyRecordList, getTrainingMenuList } from "@/utils/request"
import { useEffect, useState } from "react"
import RecordList from "./RecordList"
import { calcWeeklyRecords } from "@/utils/aggregate"

const Record = () => {
  const [weeklyRecords, setWeeklyRecords] = useState<WeeklyRecord[]>([])

  const onClickSaveButton = async (id: string) => {
    try {
      // daily_recordに記録する処理
    } catch {
      alert("削除に失敗しました")
    }
  }

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

export default Record
