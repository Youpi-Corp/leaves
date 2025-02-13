import React from 'react'
import { FaInfoCircle, FaCheckCircle, FaTimesCircle } from 'react-icons/fa'

interface AlertBoxProps {
  title?: string
  type?: 'success' | 'info' | 'error'
  children?: React.ReactNode
  className?: string
}

const alertStyles = {
  success: {
    icon: FaCheckCircle,
    bgColor: 'bg-bfgreen-lighter',
    textColor: 'text-bfgreen-base',
  },
  info: {
    icon: FaInfoCircle,
    bgColor: 'bg-bfblue-light',
    textColor: 'text-bfblue-base',
  },
  error: {
    icon: FaTimesCircle,
    bgColor: 'bg-bfred-light',
    textColor: 'text-bfred-base',
  },
}

const AlertBox: React.FC<AlertBoxProps> = ({
  title,
  type = 'info',
  children,
  className,
}) => {
  const style = alertStyles[type]
  const Icon = style.icon

  return (
    <div
      className={`flex flex-row items-center px-6 py-4
      rounded-xl ${style.bgColor} ${className}`}
    >
      <Icon className={`text-4xl ${style.textColor}`} />
      <div className="ml-6 flex flex-col">
        <h1 className={`text-lg font-bold ${style.textColor}`}>{title}</h1>
        <p className={style.textColor}>{children}</p>
      </div>
    </div>
  )
}

export default AlertBox
