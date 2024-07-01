import { ChangeEvent, FC } from 'react'
import './InputBox.css'

interface InputBoxProps {
  value?: string
  type?: 'text' | 'password' | 'email'
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
}

const InputBox: FC<InputBoxProps> = ({ value, type, onChange }) => {
  return (
    <input className="input" type={type} value={value} onChange={onChange} />
  )
}

export default InputBox
