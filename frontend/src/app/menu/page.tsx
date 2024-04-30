import { TrainingMenuList } from "@/types/global"
import CreateForm from "./CreateForm"
import MenuList from "./MenuList"

const Menu = async () => {
  const API_URL = process.env.NEXT_CLOUD_FUNCTIONS_URL
  const res = await fetch(`${API_URL}/menu`, { cache: "no-store" })
  const trainingMenuList = (await res.json()).data
  console.log(trainingMenuList)

  // const trainingMenuList: TrainingMenuList = [
  //   {
  //     menu: "腕立て伏せ",
  //     quota: 70,
  //     unit: "回",
  //   },
  //   {
  //     menu: "プランク",
  //     quota: 7,
  //     unit: "分",
  //   },
  // ]
  return (
    <>
      <CreateForm />
      <MenuList menuList={trainingMenuList} />
    </>
  )
}

export default Menu
