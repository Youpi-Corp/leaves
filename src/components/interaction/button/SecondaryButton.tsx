import { FC } from 'react'
import { ButtonProps } from './PrimaryButton'

const SecondaryButton: FC<ButtonProps> = ({ children, className, onClick }) => {
  return (
    <button
      className={`py-2 min-w-24 text-sm font-semibold shadow-sm text-neutral-700 active:scale-95
       hover:text-bfgreen-dark bg-white rounded-md hover:bg-gray-50 transition-all ${className}`}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

export default SecondaryButton
