import MenuForm from "@/components/MenuForm"
import { TrainingMenu, WeeklyRecord } from "@/types/global"
import Record from "./Record"

type Props = {
  weeklyRecords: WeeklyRecord[]
}

const RecordList = ({ weeklyRecords }: Props) => {
  return (
    <>
      {weeklyRecords.map((record) => {
        return <Record key={record.menuId}>{record}</Record>
      })}
    </>
  )
}

export default RecordList
