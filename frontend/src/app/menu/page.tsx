"use client"
import Input from "@/components/Input"
import PrimaryButton from "@/components/PrimaryButton"
import { ChangeEvent, useState } from "react"

const Menu = () => {
  const [menu, setMenu] = useState<string>("")
  const [quota, setQuota] = useState<string>("")
  const [unit, setUnit] = useState<string>("")

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // フォームの値を送信する関数を実行
    console.log(menu, quota, unit)
  }

  return (
    <>
      <form className="p-4" onSubmit={handleSubmit}>
        <Input
          className="w-2/6"
          placeholder="メニュー"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setMenu(e.target.value)
          }
        />
        <Input
          className="w-2/6"
          placeholder="数値"
          type="number"
          onChange={(e: ChangeEvent<HTMLInputElement>) => {
            console.log(quota)
            setQuota(e.target.value)
          }}
        />
        <Input
          className="w-2/6"
          placeholder="単位"
          onChange={(e: ChangeEvent<HTMLInputElement>) =>
            setUnit(e.target.value)
          }
        />
        <PrimaryButton type="submit">Save</PrimaryButton>
      </form>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="currentColor"
        className="w-6 h-6"
      >
        <path d="M21.731 2.269a2.625 2.625 0 0 0-3.712 0l-1.157 1.157 3.712 3.712 1.157-1.157a2.625 2.625 0 0 0 0-3.712ZM19.513 8.199l-3.712-3.712-8.4 8.4a5.25 5.25 0 0 0-1.32 2.214l-.8 2.685a.75.75 0 0 0 .933.933l2.685-.8a5.25 5.25 0 0 0 2.214-1.32l8.4-8.4Z" />
        <path d="M5.25 5.25a3 3 0 0 0-3 3v10.5a3 3 0 0 0 3 3h10.5a3 3 0 0 0 3-3V13.5a.75.75 0 0 0-1.5 0v5.25a1.5 1.5 0 0 1-1.5 1.5H5.25a1.5 1.5 0 0 1-1.5-1.5V8.25a1.5 1.5 0 0 1 1.5-1.5h5.25a.75.75 0 0 0 0-1.5H5.25Z" />
      </svg>
    </>
  )
}

export default Menu
