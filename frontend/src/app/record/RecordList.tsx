import MenuForm from "@/components/MenuForm"
import { TrainingMenu, WeeklyRecord } from "@/types/global"

type Props = {
  weeklyRecords: WeeklyRecord[]
}

const RecordList = ({ weeklyRecords }: Props) => {
  return (
    <>
      {weeklyRecords.map((record) => {
        return (
          <div key={record.menuId}>
            <MenuForm
              menu={record.menuName}
              count={record.totalCount}
              unit={record.unit}
              isEditCount={false}
            />
          </div>
        )
      })}
    </>
  )
}

export default RecordList
