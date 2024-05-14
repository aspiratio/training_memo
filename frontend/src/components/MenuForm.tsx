import { ChangeEvent, forwardRef } from "react"
import Input from "./commons/Input"

type Props = {
  menu: string
  count: number
  unit: string
  isReadOnly: boolean
  onChangeCount?: (e: ChangeEvent<HTMLInputElement>) => void
}

// Propsにrefを含めた型定義を使ってforwardRefを使用
const MenuForm = forwardRef<HTMLInputElement, Props>(
  ({ menu, count, unit, isReadOnly, onChangeCount }, ref) => {
    return (
      <>
        <Input className="w-2/6" defaultValue={menu} readOnly={true} />
        <Input
          className="w-1/6"
          defaultValue={String(count)}
          readOnly={isReadOnly}
          ref={ref}
          type="number"
          onChange={onChangeCount}
        />
        <Input className="w-1/6" defaultValue={unit} readOnly={true} />
      </>
    )
  }
)

MenuForm.displayName = "MenuForm"

export default MenuForm
