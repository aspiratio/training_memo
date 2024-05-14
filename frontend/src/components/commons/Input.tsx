import React, { ChangeEvent, ForwardedRef, forwardRef } from "react"

type Props = {
  className?: string
  type?: string
  placeholder?: string
  defaultValue?: string | number
  value?: string | number
  required?: boolean
  readOnly?: boolean
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

// forwardRefを使用してInputコンポーネントを定義
const Input = forwardRef<HTMLInputElement, Props>(
  (
    {
      className,
      type,
      placeholder,
      defaultValue,
      value,
      required,
      readOnly,
      onChange,
    },
    ref
  ) => {
    return (
      <input
        className={`rounded-md px-2 py-2 text-black ${
          readOnly ? "bg-slate-300" : ""
        } ${className}`}
        type={type}
        placeholder={placeholder}
        defaultValue={defaultValue}
        value={value}
        ref={ref}
        onChange={onChange}
        required={required}
        readOnly={readOnly}
      />
    )
  }
)

Input.displayName = "Input"

export default Input
