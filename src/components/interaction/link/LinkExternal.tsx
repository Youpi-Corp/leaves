import React from 'react'

export interface LinkExternalProps {
  href: string
  children?: React.ReactNode
  className?: string
}

const LinkExternal: React.FC<LinkExternalProps> = ({
  href,
  children,
  className = '',
}) => {
  return (
    <a
      href={href}
      target="_blank"
      rel="noopener noreferrer"
      className={`mr-8 cursor-pointer text-bfgreen-darker hover:text-bfgreen-dark transition-colors text-sm font-semibold ${className}`}
    >
      {children}
    </a>
  )
}

export default LinkExternal
