import React from 'react'

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string
  children?: React.ReactNode
  accent?: 'primary' | 'secondary' | 'none'
  className?: string
}

const Link: React.FC<LinkProps> = ({
  to,
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
    <a
      className={`${accentStyles[accent]} cursor-pointer transition-colors ${className}`}
      href={to}
    >
      {children}
    </a>
  )
}

export default Link
