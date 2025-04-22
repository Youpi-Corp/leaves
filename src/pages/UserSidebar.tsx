import React from 'react'

interface UserSideBarButtonProps {
  text: string
  icon: React.ReactNode
  onClick: () => void
  isActive?: boolean
}

interface UserSidebarProps {
  title: string
  position: 'left' | 'right'
  buttons: UserSideBarButtonProps[]
}

const UserSidebar: React.FC<UserSidebarProps> = ({
  title,
  position,
  buttons,
}) => {
  return (
    <div
      className={`fixed w-64 bg-white shadow-lg p-4 ${
        position === 'right' ? 'right-0' : 'left-0'
      }`}
      style={{ 
        top: 'var(--header-height, 4rem)',
        height: 'calc(100vh - var(--header-height, 4rem))'
      }}
    >
      <h1 className="font-bold text-neutral-700">{title}</h1>
      <div className="border-t border-gray-200 my-2"></div>
      <div className="flex flex-col gap-2 -ml-4">
        {buttons.map((button, index) => (
          <button
            key={`shelf-${index}`}
            className={`px-4 py-2 rounded-r-full hover:shadow-md transition-shadow duration-200 
              text-center flex items-center justify-start gap-2
              ${button.isActive ? 'bg-bfgreen-white text-bfgreen-base' : ''}`}
            onClick={button.onClick}
          >
            <div className="w-5 h-5 flex items-center justify-center">
              <span className={button.isActive ? 'text-bfgreen-base' : ''}>{button.icon}</span>
            </div> 
            <span>{button.text}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default UserSidebar
