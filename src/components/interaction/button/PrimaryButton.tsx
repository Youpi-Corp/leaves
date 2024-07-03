import { FC, ReactNode } from 'react'

export interface ButtonProps {
  children?: ReactNode
  className?: string
  onClick?: () => void
}

const PrimaryButton: FC<ButtonProps> = ({ children, className, onClick }) => {
  return (
    <button
      className={`py-2 w-24 text-sm font-semibold shadow-sm
      text-white focus:outline-none bg-bfgreen-base rounded-md hover:bg-bfgreen-base-light
      focus:z-10 focus:ring-2 focus:ring-bfgreen-light transition-all ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default PrimaryButton
