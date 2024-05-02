import { TrainingMenu } from "@/types/global"
import Menu from "./Menu"
import { getTrainingMenuList } from "@/utils/request"

const MenuList = async () => {
  const trainingMenuList = await getTrainingMenuList()
  return (
    <>
      {trainingMenuList.map((menu: TrainingMenu, index: number) => {
        return <Menu key={index}>{menu}</Menu>
      })}
    </>
  )
}

export default MenuList
