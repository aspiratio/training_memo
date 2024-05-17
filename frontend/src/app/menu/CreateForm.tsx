"use client"
import Input from "@/components/commons/Input"
import PrimaryButton from "@/components/commons/PrimaryButton"
import { Dispatch, SetStateAction, useState } from "react"
import { TrainingMenu, onChangeEvent, onSubmitEvent } from "@/types/global"
import { setTrainingMenu } from "@/utils/request"

type Props = {
  addTrainingMenu: (trainingMenu: TrainingMenu) => void
}

const CreateForm = ({ addTrainingMenu }: Props) => {
  const [menu, setMenu] = useState<string>("")
  const [quota, setQuota] = useState<string>("")
  const [unit, setUnit] = useState<string>("")

  const handleChange = (
    e: onChangeEvent,
    setState: Dispatch<SetStateAction<any>>
  ) => {
    setState(e.target.value)
  }

  const handleSubmit = async (e: onSubmitEvent) => {
    console.log(menu, quota, unit)
    try {
      e.preventDefault()
      const id = await setTrainingMenu(menu, Number(quota), unit) // APIリクエスト
      addTrainingMenu({
        name: menu,
        weeklyQuota: Number(quota),
        unit,
        id,
      }) // stateの更新
      setMenu("")
      setQuota("")
      setUnit("")
    } catch {
      alert("登録に失敗しました")
    }
  }

  return (
    <form className="py-4 space-x-2 text-center" onSubmit={handleSubmit}>
      <Input
        className="w-2/6"
        placeholder="メニュー"
        required={true}
        value={menu}
        onChange={(e) => handleChange(e, setMenu)}
      />
      <Input
        className="w-1/6"
        placeholder="数値"
        required={true}
        value={quota}
        type="number"
        onChange={(e) => handleChange(e, setQuota)}
      />
      <Input
        className="w-1/6"
        placeholder="単位"
        required={true}
        value={unit}
        onChange={(e) => handleChange(e, setUnit)}
      />
      <PrimaryButton type="submit">Save</PrimaryButton>
    </form>
  )
}

export default CreateForm
