import React from 'react'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  accent?: 'primary' | 'secondary' | 'tertiary' | 'none'
  disabled?: boolean
  children?: React.ReactNode
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  icon,
  accent = 'primary',
  disabled = false,
  children,
  className,
  ...props
}) => {
  const accentClasses = {
    primary:
      'bg-bfgreen-base text-white hover:bg-bfgreen-dark focus:ring-4 ring-bfgreen-light disabled:bg-bfgreen-light',
    secondary:
      'bg-bfbrown-base text-white hover:bg-bfbrown-dark focus:ring-4 ring-bfbrown-light',
    tertiary:
      'bg-transparent text-bfbase-darkgrey border-2 border-bfbase-grey hover:bg-bfbase-darkgrey ' +
      'hover:text-white hover:border-bfbase-darkgrey focus:ring-4 ring-bfbase-lightgrey',
    none: '',
  }

  return (
    <button
      disabled={disabled}
      className={`flex items-center justify-center outline-none rounded-full font-semibold transition-all disabled:cursor-not-allowed ${accentClasses[accent]} ${className}`}
      {...props}
    >
      <div className="mr-2">{icon}</div>
      {children}
    </button>
  )
}

export default Button
