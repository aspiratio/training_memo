import { TrainingMenuList } from "@/types/global"
import CreateForm from "./CreateForm"
import MenuList from "./MenuList"

const Menu = () => {
  const trainingMenuList: TrainingMenuList = [
    {
      menu: "腕立て伏せ",
      quota: 70,
      unit: "回",
    },
    {
      menu: "プランク",
      quota: 7,
      unit: "分",
    },
  ]
  return (
    <>
      <CreateForm />
      <MenuList menuList={trainingMenuList} />
    </>
  )
}

export default Menu
