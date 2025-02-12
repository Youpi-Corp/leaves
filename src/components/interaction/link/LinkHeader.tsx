import React from 'react'
import { LinkProps } from './LinkInternal'

const LinkHeader: React.FC<LinkProps> = ({ to, children }) => {
  return (
    <a
      href={to}
      className="mr-8 cursor-pointer text-bfgreen-darker hover:text-bfgreen-dark transition-colors text-sm font-semibold"
    >
      {children}
    </a>
  )
}

export default LinkHeader
