import { TrainingMenuList } from "@/types/global"
import Menu from "./Menu"

type Props = {
  menuList: TrainingMenuList
}

const MenuList = ({ menuList }: Props) => {
  return (
    <>
      {menuList.map((menu, index) => {
        return <Menu key={index}>{menu}</Menu>
      })}
    </>
  )
}

export default MenuList
