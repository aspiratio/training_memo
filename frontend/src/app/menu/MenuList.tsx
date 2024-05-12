import { TrainingMenuList } from "@/types/global"
import Menu from "./Menu"

type Props = {
  trainingMenuList: TrainingMenuList
  onClickDeleteButton: (id: string) => void
}

const MenuList = ({ trainingMenuList, onClickDeleteButton }: Props) => {
  return (
    <>
      {trainingMenuList.map((menu) => {
        return (
          <Menu
            key={menu.id}
            onClickDeleteButton={() => onClickDeleteButton(menu.id)}
          >
            {menu}
          </Menu>
        )
      })}
    </>
  )
}

export default MenuList
