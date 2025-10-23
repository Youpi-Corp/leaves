import React from 'react'

export interface LinkExternalProps {
  href: string
  children?: React.ReactNode
  accent?: 'primary' | 'secondary' | 'none'
  className?: string
}

const LinkExternal: React.FC<LinkExternalProps> = ({
  href,
  children,
  accent = 'primary',
  className = '',
}) => {
  const accentStyles = {
    primary: 'text-bfgreen-base hover:text-bfgreen-dark',
    secondary: 'text-bfbrown-base hover:text-bfbrown-dark',
    none: '',
  }

  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`${accentStyles[accent]} font-medium cursor-pointer transition-colors ${className}`}
    >
      {children}
    </a>
  )
}

export default LinkExternal
