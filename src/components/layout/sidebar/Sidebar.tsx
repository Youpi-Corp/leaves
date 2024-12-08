import React, { FC } from 'react';

interface SidebarProps {
  title: string;
  position: 'left' | 'right';
  children: React.ReactNode;
}

const Sidebar: FC<SidebarProps> = ({ title, position, children }) => {
  return (
    <div
      className={`fixed top-0 h-screen w-64 bg-white shadow-lg p-4 ${
        position === 'right' ? 'right-0' : 'left-0'
      }`}
    >
      <h1 className="font-bold text-neutral-700">{title}</h1>
      <div className="border-t border-gray-200 my-2"></div>
      {children}
    </div>
  );
};

export default Sidebar;
