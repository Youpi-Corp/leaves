import React, { createContext, useContext, useState, ReactNode } from 'react'
import { BaseWidgetProps } from '../types/WidgetTypes'
import { getWidgetByType } from '../components/widget/WidgetRegistry'

interface WidgetEditContextType {
  isOpen: boolean
  widgetData: BaseWidgetProps | null
  openEditModal: (widget: BaseWidgetProps, onSave: (updatedWidget: BaseWidgetProps) => void) => void
  closeEditModal: () => void
}

const WidgetEditContext = createContext<WidgetEditContextType | undefined>(undefined)

export const useWidgetEdit = () => {
  const context = useContext(WidgetEditContext)
  if (!context) {
    throw new Error('useWidgetEdit must be used within a WidgetEditProvider')
  }
  return context
}

interface WidgetEditProviderProps {
  children: ReactNode
}

export const WidgetEditProvider: React.FC<WidgetEditProviderProps> = ({ children }) => {
  const [isOpen, setIsOpen] = useState(false)
  const [widgetData, setWidgetData] = useState<BaseWidgetProps | null>(null)
  const [editedData, setEditedData] = useState<BaseWidgetProps | null>(null)
  const [onSaveCallback, setOnSaveCallback] = useState<((widget: BaseWidgetProps) => void) | null>(null)
  const [hasChanges, setHasChanges] = useState(false)

  const openEditModal = (widget: BaseWidgetProps, onSave: (updatedWidget: BaseWidgetProps) => void) => {
    setWidgetData(widget)
    setEditedData(widget)
    setOnSaveCallback(() => onSave)
    setHasChanges(false)
    setIsOpen(true)
    // Prevent body scroll when modal is open
    document.body.style.overflow = 'hidden'
  }

  const closeEditModal = (force = false) => {
    if (hasChanges && !force) {
      const confirmClose = window.confirm(
        'You have unsaved changes. Are you sure you want to close without saving?'
      )
      if (!confirmClose) {
        return
      }
    }
    
    setIsOpen(false)
    setWidgetData(null)
    setEditedData(null)
    setOnSaveCallback(null)
    setHasChanges(false)
    // Restore body scroll
    document.body.style.overflow = 'unset'
  }

  const handleDataChange = (newData: BaseWidgetProps) => {
    setEditedData(newData)
    setHasChanges(true)
  }

  const handleSave = () => {
    if (editedData && onSaveCallback && hasChanges) {
      onSaveCallback(editedData)
    }
    // Always close the modal when save is clicked, regardless of changes
    setHasChanges(false)
    closeEditModal(true)
  }

  const handleCancel = () => {
    closeEditModal(false)
  }

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      closeEditModal(false)
    }
  }

  // Handle Escape key
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        closeEditModal(false)
      }
    }

    if (isOpen) {
      document.addEventListener('keydown', handleEscape)
    }

    return () => {
      document.removeEventListener('keydown', handleEscape)
    }
  }, [isOpen, hasChanges])

  // Get widget implementation for rendering
  const widget = editedData ? getWidgetByType(editedData.type) : null

  return (
    <WidgetEditContext.Provider value={{ isOpen, widgetData, openEditModal, closeEditModal }}>
      {children}
      
      {/* Full-screen modal */}
      {isOpen && editedData && widget && (
        <div
          className="fixed inset-0 z-[9999] flex items-center justify-center bg-black/60 backdrop-blur-sm"
          onClick={handleBackdropClick}
        >
          <div className="bg-white rounded-xl shadow-2xl w-[95vw] h-[95vh] max-w-none flex flex-col overflow-hidden">
            {/* Modal Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gray-50">
              <div className="flex items-center space-x-3">
                <div className="p-3 bg-bfgreen-light rounded-xl">
                  <svg
                    className="w-6 h-6 text-bfgreen-dark"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
                    />
                  </svg>
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Edit {widget.metadata.displayName}
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">
                    {widget.metadata.description}
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                {hasChanges && (
                  <div className="flex items-center text-sm text-amber-600 mr-4">
                    <svg
                      className="w-4 h-4 mr-2"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Unsaved changes
                  </div>
                )}
                <button
                  onClick={handleCancel}
                  className="p-2 text-gray-400 hover:text-gray-600 hover:bg-gray-200 rounded-lg transition-colors"
                  aria-label="Close modal"
                >
                  <svg
                    className="w-6 h-6"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Modal Content */}
            <div className="flex-1 overflow-hidden flex">
              {/* Left Panel - Configuration */}
              <div className="w-1/2 border-r border-gray-200 flex flex-col bg-white">
                <div className="p-6 border-b border-gray-200 bg-gray-50">
                  <h3 className="text-lg font-semibold text-gray-900">Configuration</h3>
                  <p className="text-sm text-gray-600 mt-1">Edit widget properties and content</p>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="space-y-6">
                    <widget.component.EditComponent
                      widgetData={editedData}
                      onChange={handleDataChange}
                      onSave={handleSave}
                      onCancel={closeEditModal}
                    />
                  </div>
                </div>
              </div>

              {/* Right Panel - Preview */}
              <div className="w-1/2 flex flex-col bg-gray-50">
                <div className="p-6 border-b border-gray-200 bg-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900">Live Preview</h3>
                  <p className="text-sm text-gray-600 mt-1">See how your widget will look</p>
                </div>
                <div className="flex-1 overflow-y-auto p-6">
                  <div className="bg-white rounded-lg border border-gray-300 shadow-sm p-6 h-full">
                    <widget.component.ViewComponent
                      widgetData={editedData}
                      onEdit={undefined} // Disable edit action in preview
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="flex items-center justify-end p-6 border-t border-gray-200 bg-gray-50 space-x-4">
              <button
                onClick={handleCancel}
                className="px-6 py-2 border border-gray-300 rounded-lg shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-6 py-2 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-bfgreen-base hover:bg-bfgreen-dark transition-colors"
              >
                {hasChanges ? 'Save Changes' : 'Done'}
              </button>
            </div>
          </div>
        </div>
      )}
    </WidgetEditContext.Provider>
  )
}
