import React, { useState, useRef, useEffect } from 'react'
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
  const dropdownRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false)
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen])

  return (
    <div ref={dropdownRef} className="inline-flex">
      <Button onClick={() => setIsOpen(!isOpen)} {...props}>
        {children}
        <FaChevronDown
          className={`ml-4 transition-transform ${
            isOpen ? 'transform rotate-180' : ''
          }`}
        />
        {isOpen && dropdown}
      </Button>
    </div>
  )
}

export default ButtonDropdown
