import React from 'react'

interface MobileOverlayProps {
  isVisible: boolean
  onClose: () => void
}

const MobileOverlay: React.FC<MobileOverlayProps> = ({
  isVisible,
  onClose,
}) => {
  if (!isVisible) return null

  return (
    <div
      className="fixed inset-0 z-40 bg-black opacity-50 lg:hidden"
      onClick={onClose}
      aria-hidden="true"
    />
  )
}

export default MobileOverlay
