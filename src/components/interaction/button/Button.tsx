import { FC, ReactNode } from 'react'
import './Button.css'

interface ButtonProps {
  style: 'primary' | 'secondary' | 'tertiary'
  children: ReactNode
  onClick?: () => void
}

const Button: FC<ButtonProps> = ({ style, children, onClick }) => {
  return (
    <button onClick={onClick} className={`button button-${style}`}>
      {children}
    </button>
  )
}

export default Button
