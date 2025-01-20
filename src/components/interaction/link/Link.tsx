import React from 'react'

export interface LinkProps
  extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  to?: string
  children?: React.ReactNode
  className?: string
}

const Link: React.FC<LinkProps> = ({ to, children, className }) => {
  return (
    <a
      className={`text-bfgreen-base font-medium underline hover:text-bfgreen-dark transition-colors ${className}`}
      href={to}
    >
      {children}
    </a>
  )
}

export default Link
