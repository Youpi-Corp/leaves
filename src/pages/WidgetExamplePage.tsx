import React from 'react'

/**
 * Simple debug version of the Widget Example Page
 */
const WidgetExamplePage: React.FC = () => {
  return (
    <div className="container mx-auto py-8 px-4">
      <div className="mb-8 text-center">
        <h1 className="text-3xl font-bold mb-2">Widget System Debug Page</h1>
        <p className="text-gray-600">
          This is a simple debug page to help diagnose the blank page issue.
        </p>
      </div>

      <div className="max-w-4xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <p className="mb-4">
          If you can see this text, the basic routing is working correctly.
        </p>

        <div className="p-4 border border-yellow-200 bg-yellow-50 rounded mb-4">
          <h2 className="font-bold text-yellow-800 mb-2">Debugging Steps:</h2>
          <ol className="list-decimal pl-5 space-y-2">
            <li>Check console for JavaScript errors</li>
            <li>
              Verify all dependencies are installed (uuid, react-markdown)
            </li>
            <li>Resolve the duplicate widget files in the project</li>
          </ol>
        </div>
      </div>
    </div>
  )
}

export default WidgetExamplePage
