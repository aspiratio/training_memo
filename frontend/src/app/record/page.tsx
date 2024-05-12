"use client"
import { TrainingMenu, WeeklyRecord } from "@/types/global"
import { getDailyRecordList, getTrainingMenuList } from "@/utils/request"
import { useEffect, useState } from "react"
import RecordList from "./RecordList"
import { sumDailyRecords } from "@/utils/aggregate"

const Record = () => {
  const [trainingMenuList, setTrainingMenuList] = useState<TrainingMenu[]>([])
  const [weeklyRecordList, setWeeklyRecordList] = useState<WeeklyRecord[]>([])

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
      setTrainingMenuList(menuList)
      const recordList = await getDailyRecordList()
      setWeeklyRecordList(sumDailyRecords(recordList))
    }
    getData()
  }, [])

  return (
    <>
      <RecordList trainingMenuList={trainingMenuList} />
    </>
  )
}

export default Record
