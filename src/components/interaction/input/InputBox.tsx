import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  className?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const InputBox: React.FC<InputProps> = ({
  className,
  value,
  onChange,
  ...props
}) => {
  return (
    <input
      className={`rounded-full outline-none bg-transparent px-4 py-2 text-bfbase-darkgrey
      ring-1 ring-bfbase-grey placeholder:text-bfbase-grey focus:ring-4 focus:ring-bfgreen-base transition-all ${className}`}
      value={value}
      onChange={onChange}
      {...props}
    />
  )
}

export default InputBox
