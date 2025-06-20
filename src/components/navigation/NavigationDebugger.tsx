import React, { useState } from 'react'
import { useNavigation } from '../../contexts/NavigationContext'

interface NavigationDebuggerProps {
  className?: string
}

const NavigationDebugger: React.FC<NavigationDebuggerProps> = ({
  className = '',
}) => {
  const [isVisible, setIsVisible] = useState(false)
  const { navigationState, goBack, goForward, clearHistory } = useNavigation()

  // Only show in development mode
  const isDevelopment = import.meta.env.DEV

  if (!isDevelopment) {
    return null
  }

  return (
    <div className={`fixed bottom-4 right-4 z-50 ${className}`}>
      <button
        onClick={() => setIsVisible(!isVisible)}
        className="bg-blue-600 text-white px-3 py-2 rounded-md text-sm shadow-lg hover:bg-blue-700"
      >
        🧭 Nav Debug
      </button>

      {isVisible && (
        <div className="absolute bottom-full right-0 mb-2 bg-white border border-gray-300 rounded-lg shadow-xl p-4 min-w-80 max-h-96 overflow-auto">
          <div className="flex justify-between items-center mb-3">
            <h3 className="font-semibold text-gray-800">Navigation State</h3>
            <button
              onClick={() => setIsVisible(false)}
              className="text-gray-500 hover:text-gray-700"
            >
              ✕
            </button>
          </div>

          <div className="space-y-3 text-sm">
            <div>
              <strong>Current Index:</strong> {navigationState.currentIndex}
            </div>

            <div>
              <strong>Can Go Back:</strong>{' '}
              <span
                className={
                  navigationState.canGoBack ? 'text-green-600' : 'text-red-600'
                }
              >
                {navigationState.canGoBack ? 'Yes' : 'No'}
              </span>
            </div>

            <div>
              <strong>Can Go Forward:</strong>{' '}
              <span
                className={
                  navigationState.canGoForward
                    ? 'text-green-600'
                    : 'text-red-600'
                }
              >
                {navigationState.canGoForward ? 'Yes' : 'No'}
              </span>
            </div>

            <div>
              <strong>History ({navigationState.history.length}):</strong>
              <div className="mt-1 max-h-32 overflow-y-auto">
                {navigationState.history.map((path, index) => (
                  <div
                    key={index}
                    className={`py-1 px-2 text-xs rounded ${
                      index === navigationState.currentIndex
                        ? 'bg-blue-100 border-l-2 border-blue-500 font-medium'
                        : 'bg-gray-50'
                    }`}
                  >
                    {index}: {path}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <strong>Breadcrumbs:</strong>
              <div className="mt-1 space-y-1">
                {navigationState.breadcrumbs.map((crumb, index) => (
                  <div
                    key={index}
                    className={`text-xs px-2 py-1 rounded ${
                      crumb.isActive
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-50 text-gray-600'
                    }`}
                  >
                    {crumb.label} → {crumb.path}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex gap-2 pt-2 border-t">
              <button
                onClick={() => goBack()}
                disabled={!navigationState.canGoBack}
                className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
              >
                ← Back
              </button>
              <button
                onClick={goForward}
                disabled={!navigationState.canGoForward}
                className="px-2 py-1 text-xs bg-gray-200 rounded disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-300"
              >
                Forward →
              </button>
              <button
                onClick={clearHistory}
                className="px-2 py-1 text-xs bg-red-200 text-red-800 rounded hover:bg-red-300"
              >
                Clear
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default NavigationDebugger
