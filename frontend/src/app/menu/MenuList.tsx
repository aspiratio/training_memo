import { TrainingMenu } from "@/types/global"
import Menu from "./Menu"

const MenuList = async () => {
  const API_URL = process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL
  const res = await fetch(`${API_URL}/menu`, { cache: "no-store" })
  const trainingMenuList = (await res.json()).data
  return (
    <>
      {trainingMenuList.map((menu: TrainingMenu, index: number) => {
        return <Menu key={index}>{menu}</Menu>
      })}
    </>
  )
}

export default MenuList
