import { TrainingMenu } from "@/types/global"
import Menu from "./Menu"

type Props = {
  trainingMenuList: Array<TrainingMenu>
}

const MenuList = ({ trainingMenuList }: Props) => {
  return (
    <>
      {trainingMenuList.map((menu: TrainingMenu, index: number) => {
        return <Menu key={index}>{menu}</Menu>
      })}
    </>
  )
}

export default MenuList
