"use client"
import { Dispatch, SetStateAction, useState } from "react"
import { TrainingMenu, onChangeEvent } from "@/types/global"
import {
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid"
import { setTrainingMenu } from "@/utils/request"
import MenuForm from "@/components/MenuForm"

type Props = {
  children: TrainingMenu
  onClickDeleteButton: () => void
}

const Menu = ({ children, onClickDeleteButton }: Props) => {
  const menu = children.name
  const unit = children.unit
  const [quota, setQuota] = useState<number>(children.weeklyQuota)
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true)

  const handleChange = (
    e: onChangeEvent,
    setState: Dispatch<SetStateAction<any>>
  ) => {
    setState(e.target.value)
  }

  const updateMenu = async () => {
    // TODO: API側にupdateメソッドを追加したら書き換える
    try {
      await setTrainingMenu(menu, quota, unit)
      changeReadOnly()
    } catch {
      alert("更新に失敗しました")
    }
  }

  const changeReadOnly = () => {
    setIsReadOnly(!isReadOnly)
  }

  return (
    <form className="py-4 space-x-2 text-center">
      <MenuForm
        menu={menu}
        count={quota}
        unit={unit}
        isReadOnly={isReadOnly}
        onChangeCount={(e) => handleChange(e, setQuota)}
      />
      {isReadOnly ? (
        <>
          <PencilIcon
            onClick={changeReadOnly}
            className="h-8 w-8 inline text-yellow-100"
          />
          <TrashIcon
            onClick={onClickDeleteButton}
            className="h-8 w-8 inline text-red-400"
          />
        </>
      ) : (
        <>
          <CheckCircleIcon
            onClick={() => {
              updateMenu()
            }}
            className="h-8 w-8 inline text-yellow-100"
          />
          <XCircleIcon
            onClick={changeReadOnly}
            className="h-8 w-8 inline text-red-400"
          />
        </>
      )}
    </form>
  )
}

export default Menu
