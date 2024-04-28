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
  const { menu, unit } = children
  const [quota, setQuota] = useState<string>("100")
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true)

  const handleChange = (
    e: onChangeEvent,
    setState: Dispatch<SetStateAction<any>>
  ) => {
    setState(e.target.value)
  }

  const handleSubmit = () => {
    // フォームの値を送信する関数を実行
    console.log(menu, quota, unit)
    changeReadOnly()
  }

  const changeReadOnly = () => {
    setIsReadOnly(!isReadOnly)
  }

  return (
    <form className="py-4 space-x-2 text-center">
      <Input className="w-2/6" defaultValue={menu} readOnly={true} />
      <Input
        className="w-1/6"
        defaultValue={quota}
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
          <TrashIcon className="h-8 w-8 inline text-red-400" />
        </>
      ) : (
        <>
          <CheckCircleIcon
            onClick={() => {
              handleSubmit()
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
