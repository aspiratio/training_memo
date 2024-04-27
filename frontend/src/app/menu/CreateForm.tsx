"use client"
import Input from "@/components/commons/Input"
import PrimaryButton from "@/components/commons/PrimaryButton"
import { Dispatch, SetStateAction, useState } from "react"
import { onChangeEvent, onSubmitEvent } from "@/types/global"

const CreateForm = () => {
  const [menu, setMenu] = useState<string>("")
  const [quota, setQuota] = useState<string>("")
  const [unit, setUnit] = useState<string>("")

  const handleChange = (
    e: onChangeEvent,
    setState: Dispatch<SetStateAction<any>>
  ) => {
    setState(e.target.value)
  }

  const handleSubmit = (e: onSubmitEvent) => {
    e.preventDefault()
    // フォームの値を送信する関数を実行
    console.log(menu, quota, unit)
  }

  return (
    <form className="py-4 space-x-2 text-center" onSubmit={handleSubmit}>
      <Input
        className="w-2/6"
        placeholder="メニュー"
        onChange={(e) => handleChange(e, setMenu)}
      />
      <Input
        className="w-1/6"
        placeholder="数値"
        type="number"
        onChange={(e) => handleChange(e, setQuota)}
      />
      <Input
        className="w-1/6"
        placeholder="単位"
        onChange={(e) => handleChange(e, setUnit)}
      />
      <PrimaryButton type="submit">Save</PrimaryButton>
    </form>
  )
}

export default CreateForm
