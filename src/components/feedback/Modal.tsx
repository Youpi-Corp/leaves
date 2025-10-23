import React, { useEffect, ReactNode } from 'react'

interface ModalProps {
  isOpen: boolean
  onClose: () => void
  children: ReactNode
  className?: string
  closeOnBackdropClick?: boolean
  closeOnEscape?: boolean
}

/**
 * Modal - A reusable modal wrapper component with consistent styling
 * Features:
 * - Semi-transparent black background (bg-black/50)
 * - Centered content with responsive sizing
 * - Optional close on backdrop click
 * - Optional close on Escape key
 * - Prevents body scroll when open
 * - Consistent z-index across all modals
 */
const Modal: React.FC<ModalProps> = ({
  isOpen,
  onClose,
  children,
  className = '',
  closeOnBackdropClick = true,
  closeOnEscape = true,
}) => {
  useEffect(() => {
    if (isOpen) {
      // Prevent body scroll when modal is open
      document.body.style.overflow = 'hidden'
    } else {
      // Re-enable body scroll when modal is closed
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (closeOnEscape && e.key === 'Escape') {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, closeOnEscape, onClose])

  const handleBackdropClick = (e: React.MouseEvent<HTMLDivElement>) => {
    if (closeOnBackdropClick && e.target === e.currentTarget) {
      onClose()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm overflow-y-auto"
      onClick={handleBackdropClick}
      role="dialog"
      aria-modal="true"
      onWheel={(e) => e.stopPropagation()}
      onTouchMove={(e) => e.stopPropagation()}
    >
      <div
        className={`bg-white rounded-lg shadow-2xl max-h-[90vh] overflow-y-auto my-auto ${className}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  )
}

export default Modal
