import { ChangeEvent } from "react"

type Props = {
  className?: string
  type?: string
  placeholder?: string
  defaultValue?: string | number
  required?: boolean
  onChange: (e: ChangeEvent<HTMLInputElement>) => void
}

const Input = ({
  className,
  type,
  placeholder,
  defaultValue,
  required,
  onChange,
}: Props) => {
  return (
    <input
      className={`rounded-md px-2 py-2 ${className} text-black`}
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
      required={required}
    />
  )
}

export default Input
