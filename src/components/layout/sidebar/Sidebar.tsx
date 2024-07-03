import { FC, ReactNode } from 'react'

interface SidebarProps {
  title?: string
  position: 'left' | 'right'
  children?: ReactNode
}

const Sidebar: FC<SidebarProps> = ({ title, position, children }) => {
  return (
    <div
      className={`w-64 h-screen bg-white ${position === 'right' ? 'right-0' : ''} shadow-lg p-4`}
    >
      <h1 className="font-bold text-neutral-700">{title}</h1>
      <div className="border-t border-gray-200 my-2"></div>
      {children}
    </div>
  )
}

export default Sidebar
