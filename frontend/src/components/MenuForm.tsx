import { ChangeEvent } from "react"
import Input from "./commons/Input"

type Props = {
  menu: string
  count: number
  unit: string
  isEditCount: boolean
  onChangeCount?: (e: ChangeEvent<HTMLInputElement>) => void
}

const MenuForm = ({ menu, count, unit, isEditCount, onChangeCount }: Props) => {
  return (
    <>
      <Input className="w-2/6" defaultValue={menu} readOnly={true} />
      <Input
        className="w-1/6"
        defaultValue={String(count)}
        readOnly={isEditCount}
        type="number"
        onChange={onChangeCount}
      />
      <Input className="w-1/6" defaultValue={unit} readOnly={true} />
    </>
  )
}

export default MenuForm
