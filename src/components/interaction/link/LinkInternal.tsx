import React from 'react'
import { Link } from 'react-router-dom'

export interface LinkProps {
  to?: string
  children?: React.ReactNode
  accent?: 'primary' | 'secondary' | 'none'
  className?: string
}

const LinkInternal: React.FC<LinkProps> = ({
  to = '',
  children,
  accent = 'primary',
  className,
}) => {
  const accentStyles = {
    primary: 'text-bfgreen-base hover:text-bfgreen-dark',
    secondary: 'text-bfbrown-base hover:text-bfbrown-dark',
    none: '',
  }

  return (
    <Link
      className={`${accentStyles[accent]} font-medium cursor-pointer transition-colors ${className}`}
      to={to}
    >
      {children}
    </Link>
  )
}

export default LinkInternal
