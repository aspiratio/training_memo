"use client"
import { TrainingMenu } from "@/types/global"
import CreateForm from "./CreateForm"
import MenuList from "./MenuList"
import { useEffect, useState } from "react"
import { getTrainingMenuList } from "@/utils/request"

const Menu = () => {
  const [trainingMenuList, setTrainingMenuList] = useState<Array<TrainingMenu>>(
    []
  )
  const addTrainingMenu = (trainingMenu: TrainingMenu) => {
    setTrainingMenuList([...trainingMenuList, trainingMenu])
  }

  useEffect(() => {
    const getData = async () => {
      const response = await getTrainingMenuList()
      setTrainingMenuList(response)
    }
    getData()
  }, [])

  return (
    <>
      <CreateForm
        addTrainingMenu={(trainingMenu) => addTrainingMenu(trainingMenu)}
      />
      <MenuList trainingMenuList={trainingMenuList} />
    </>
  )
}

export default Menu
