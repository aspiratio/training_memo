import { ChangeEvent } from "react"

type Props = {
  className?: string
  type?: string
  placeholder?: string
  defaultValue?: string | number
  required?: boolean
  readOnly?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const Input = ({
  className,
  type,
  placeholder,
  defaultValue,
  required,
  readOnly,
  onChange,
}: Props) => {
  return (
    <input
      className={`rounded-md px-2 py-2 text-black ${
        readOnly && "bg-slate-300"
      } ${className}`}
      type={type}
      placeholder={placeholder}
      defaultValue={defaultValue}
      onChange={onChange}
      required={required}
      readOnly={readOnly}
    />
  )
}

export default Input
