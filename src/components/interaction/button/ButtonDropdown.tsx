import React, { useState } from 'react'
import { ButtonProps } from './Button'
import Button from './Button'
import { FaChevronDown } from 'react-icons/fa'

interface ButtonDropdownProps extends ButtonProps {
  dropdown: React.ReactNode
}

const ButtonDropdown: React.FC<ButtonDropdownProps> = ({
  children,
  dropdown,
  ...props
}) => {
  const [isOpen, setIsOpen] = useState(false)

  return (
    <Button onClick={() => setIsOpen(!isOpen)} {...props}>
      {children}
      <FaChevronDown
        className={`ml-4 transition-transform ${
          isOpen ? 'transform rotate-180' : ''
        }`}
      />
      {isOpen && dropdown}
    </Button>
  )
}

export default ButtonDropdown
