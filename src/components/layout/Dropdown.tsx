import React from 'react'
import { Link } from 'react-router-dom'

interface DropdownProps {
  className?: string
  children?: React.ReactNode
}

interface DropdownItemProps extends React.HTMLAttributes<HTMLAnchorElement> {
  className?: string
  to?: string
  icon?: React.ReactNode
  children?: React.ReactNode
}

const Dropdown: React.FC<DropdownProps> = ({ className, children }) => {
  return (
    <div
      className={`flex flex-col bg-white absolute shadow-xl rounded-xl p-3 ${className}`}
    >
      {children}
    </div>
  )
}

const DropdownItem: React.FC<DropdownItemProps> = ({
  className,
  icon,
  to = '',
  children,
}) => {
  return (
    <Link
      to={to}
      className={`flex items-center p-3 rounded-xl w-full hover:bg-bfbase-lightgrey text-bfbase-darkgrey transition-colors ${className}`}
    >
      {icon && (
        <div className="w-6 mr-2 flex items-center justify-center">{icon}</div>
      )}
      {children}
    </Link>
  )
}

export { Dropdown, DropdownItem }
