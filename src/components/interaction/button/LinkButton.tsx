import { FC } from 'react'
import { ButtonProps } from './PrimaryButton'

const LinkButton: FC<ButtonProps> = ({ children, className, onClick }) => {
  return (
    <button
      className={`py-2 w-24 text-sm font-semibold text-bfgreen-dark rounded-md
        hover:bg-bfgreen-light active:text-bfgreen-base active:scale-95 transition-all ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default LinkButton
