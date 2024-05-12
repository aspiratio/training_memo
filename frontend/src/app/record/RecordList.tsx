import MenuForm from "@/components/MenuForm"
import { TrainingMenuList } from "@/types/global"

type Props = {
  trainingMenuList: TrainingMenuList
}

const RecordList = ({ trainingMenuList }: Props) => {
  return (
    <>
      {trainingMenuList.map((menu) => {
        return (
          <div key={menu.id}>
            <MenuForm
              menu={menu.name}
              count={10}
              unit={menu.unit}
              isEditCount={false}
            />
          </div>
        )
      })}
    </>
  )
}

export default RecordList
