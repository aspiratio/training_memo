"use client"
import Input from "@/components/commons/Input"
import { Dispatch, SetStateAction, useState } from "react"
import { TrainingMenu, onChangeEvent, onSubmitEvent } from "@/types/global"
import {
  CheckCircleIcon,
  PencilIcon,
  TrashIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid"

type Props = {
  children: TrainingMenu
}

const Menu = ({ children }: Props) => {
  const menu = children.name
  const unit = children.unit
  const [quota, setQuota] = useState<number>(children.weekly_quota)
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true)

  const handleChange = (
    e: onChangeEvent,
    setState: Dispatch<SetStateAction<any>>
  ) => {
    setState(e.target.value)
  }

  const deleteMenu = () => {
    console.log("Firestoreからmenuを削除する処理")
  }

  const updateMenu = async () => {
    // TODO: API側にupdateメソッドを追加したら書き換える
    const API_URL = process.env.NEXT_PUBLIC_CLOUD_FUNCTIONS_URL
    console.log(API_URL)
    try {
      await fetch(`${API_URL}/menu`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          name: menu,
          unit: unit,
          weekly_quota: quota,
        }),
        cache: "no-store",
      })
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
      <Input className="w-2/6" defaultValue={menu} readOnly={true} />
      <Input
        className="w-1/6"
        defaultValue={String(quota)}
        readOnly={isReadOnly}
        type="number"
        onChange={(e) => handleChange(e, setQuota)}
      />
      <Input className="w-1/6" defaultValue={unit} readOnly={true} />
      {isReadOnly ? (
        <>
          <PencilIcon
            onClick={changeReadOnly}
            className="h-8 w-8 inline text-yellow-100"
          />
          <TrashIcon
            onClick={deleteMenu}
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
