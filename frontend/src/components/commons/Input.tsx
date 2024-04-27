import { ChangeEvent } from "react"

type Props = {
  className?: string
  type?: string
  placeholder?: string
  defaultValue?: string | number
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const Input = ({
  className,
  type,
  placeholder,
  defaultValue,
  onChange,
}: Props) => {
  return (
    <input
      className={`rounded-md px-2 py-2 ${className} text-black`}
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
    />
  )
}

export default Input
