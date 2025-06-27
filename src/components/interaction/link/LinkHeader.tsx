import React from 'react'
import { Link } from 'react-router-dom'
import { LinkProps } from './LinkInternal'

const LinkHeader: React.FC<LinkProps> = ({ to = '', children }) => {
  return (
    <Link
      to={to}
      className="mr-8 cursor-pointer text-bfgreen-darker hover:text-bfgreen-dark transition-colors text-sm font-semibold"
    >
      {children}
    </Link>
  )
}

export default LinkHeader
