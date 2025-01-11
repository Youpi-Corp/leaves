import React from 'react'

interface ButtonProps extends React.HTMLAttributes<HTMLButtonElement> {
  icon?: React.ReactNode
  accent?: 'primary' | 'secondary' | 'tertiary' | 'none'
  children?: React.ReactNode
  className?: string
}

const Button: React.FC<ButtonProps> = ({
  icon,
  accent = 'primary',
  children,
  className,
  ...props
}) => {
  const accentClasses = {
    primary:
      'bg-bfgreen-base text-white hover:bg-bfgreen-dark focus:ring-4 ring-bfgreen-light',
    secondary:
      'bg-bfbrown-base text-white hover:bg-bfbrown-dark focus:ring-4 ring-bfbrown-light',
    tertiary:
      'bg-transparent text-bfbase-darkgrey border-2 border-bfbase-grey hover:bg-bfbase-darkgrey ' +
      'hover:text-white hover:border-bfbase-darkgrey focus:ring-4 ring-bfbase-lightgrey',
    none: '',
  }

  return (
    <button
      className={`flex items-center justify-center outline-none rounded-full font-semibold transition-all ${accentClasses[accent]} ${className}`}
      {...props}
    >
      <div className="mr-2">{icon}</div>
      {children}
    </button>
  )
}

export default Button
