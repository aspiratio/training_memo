"use client"

import MenuForm from "@/components/MenuForm"
import { WeeklyRecord, onChangeEvent } from "@/types/global"
import { setDailyRecord } from "@/utils/request"
import {
  CheckCircleIcon,
  PlusCircleIcon,
  XCircleIcon,
} from "@heroicons/react/20/solid"
import { Dispatch, SetStateAction, useState } from "react"

type Props = {
  children: WeeklyRecord
}

const Record = ({ children }: Props) => {
  const menu = children.menuName
  const unit = children.unit
  const [count, setCount] = useState<number>(children.totalCount)
  const [isReadOnly, setIsReadOnly] = useState<boolean>(true)

  const handleChange = (
    e: onChangeEvent,
    setState: Dispatch<SetStateAction<any>>
  ) => {
    setState(e.target.value)
  }

  const addDailyRecord = async () => {
    try {
      await setDailyRecord(menu, Number(count))
      setIsReadOnly(true)
    } catch {
      alert("記録に失敗しました")
    }
  }

  const changeReadOnly = () => {
    setIsReadOnly(!isReadOnly)
  }

  return (
    <form className="py-4 space-x-2 text-center">
      <MenuForm
        menu={menu}
        count={count}
        unit={unit}
        isReadOnly={isReadOnly}
        onChangeCount={(e) => handleChange(e, setCount)}
      />
      {isReadOnly ? (
        <>
          <PlusCircleIcon
            onClick={changeReadOnly}
            className="h-8 w-8 inline text-yellow-100"
          />
        </>
      ) : (
        <>
          <CheckCircleIcon
            onClick={() => {
              addDailyRecord()
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

export default Record
