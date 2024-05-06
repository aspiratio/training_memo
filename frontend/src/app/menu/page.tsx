"use client"
import { TrainingMenu } from "@/types/global"
import CreateForm from "./CreateForm"
import MenuList from "./MenuList"
import { useEffect, useState } from "react"
import { getTrainingMenuList, deleteTrainingMenu } from "@/utils/request"

const MenuPage = () => {
  const [trainingMenuList, setTrainingMenuList] = useState<Array<TrainingMenu>>(
    []
  )
  const addTrainingMenu = (trainingMenu: TrainingMenu) => {
    setTrainingMenuList([...trainingMenuList, trainingMenu])
  }
  const onClickDeleteButton = async (id: string) => {
    try {
      await deleteTrainingMenu(id)
      setTrainingMenuList(trainingMenuList.filter((menu) => menu.id !== id))
    } catch {
      alert("削除に失敗しました")
    }
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
      <MenuList
        trainingMenuList={trainingMenuList}
        onClickDeleteButton={(id) => onClickDeleteButton(id)}
      />
    </>
  )
}

export default MenuPage
