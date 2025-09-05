import React from 'react'
import {
  BaseWidgetProps,
  WidgetViewProps,
  WidgetEditProps,
  WidgetComponentInterface,
  WidgetMetadata,
} from '../../../types/WidgetTypes'
import { registerWidget } from '../WidgetRegistry'

/**
 * Props for the code widget
 */
export interface CodeWidgetProps extends BaseWidgetProps {
  code: string
  language?: string
  theme?: 'light' | 'dark' | 'system'
  showLineNumbers?: boolean
}

/**
 * Register CodeWidget props with the registry
 */
declare module '../../../types/WidgetPropsRegistry' {
  interface WidgetPropsRegistry {
    CodeWidget: CodeWidgetProps
  }
}

// Code Widget metadata
const codeWidgetMetadata: WidgetMetadata = {
  type: 'CodeWidget',
  displayName: 'Code Block',
  description: 'Display formatted code snippets with syntax highlighting',
  icon: 'code',
  category: 'Developer',
  version: '1.0.0',
  tags: ['code', 'programming', 'syntax', 'developer'],
}

/**
 * Language options for the code editor
 */
const languageOptions = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'csharp', label: 'C#' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'swift', label: 'Swift' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'bash', label: 'Bash/Shell' },
]

/**
 * Code Widget View Component
 * Displays code with syntax highlighting
 */
const CodeWidgetView: React.FC<WidgetViewProps<CodeWidgetProps>> = ({
  widgetData,
}) => {
  const { code, language, showLineNumbers, theme = 'light' } = widgetData

  // Determine theme class
  const themeClass =
    theme === 'system'
      ? 'bg-gray-100 dark:bg-gray-800 text-gray-800 dark:text-gray-100'
      : theme === 'dark'
      ? 'bg-gray-800 text-gray-100'
      : 'bg-gray-100 text-gray-800'

  // Create line numbers if enabled
  const lineNumbers = showLineNumbers
    ? code.split('\n').map((_, i) => (
        <div key={i} className="select-none text-gray-500 pr-4 text-right w-8">
          {i + 1}
        </div>
      ))
    : null

  return (
    <div className="font-mono text-sm rounded overflow-hidden">
      <div className="flex items-center justify-between px-4 py-2 bg-gray-200 dark:bg-gray-700">
        <span className="font-medium">
          {languageOptions.find((l) => l.value === language)?.label || language}
        </span>

        <div className="text-xs px-2 py-1 rounded bg-gray-300 dark:bg-gray-600">
          {language}
        </div>
      </div>

      <div className={`p-4 ${themeClass} overflow-x-auto`}>
        <div className="flex">
          {showLineNumbers && (
            <div className="flex flex-col mr-4 border-r border-gray-300 dark:border-gray-600">
              {lineNumbers}
            </div>
          )}
          <pre className="flex-1 whitespace-pre-wrap">
            <code>{code}</code>
          </pre>
        </div>
      </div>
    </div>
  )
}

/**
 * Code Widget Edit Component
 * Provides a form for editing code properties
 */
const CodeWidgetEdit: React.FC<WidgetEditProps<CodeWidgetProps>> = ({
  widgetData,
  onChange,
}) => {
  const handleCodeChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    onChange({
      ...widgetData,
      code: e.target.value,
    })
  }

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...widgetData,
      language: e.target.value,
    })
  }

  const handleShowLineNumbersChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    onChange({
      ...widgetData,
      showLineNumbers: e.target.checked,
    })
  }

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...widgetData,
      theme: e.target.value as 'light' | 'dark' | 'system',
    })
  }

  const handleLabelChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      label: e.target.value,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Title
        </label>
        <input
          type="text"
          value={widgetData.label}
          onChange={handleLabelChange}
          className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Code
        </label>
        <textarea
          value={widgetData.code}
          onChange={handleCodeChange}
          rows={8}
          className="w-full font-mono border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          placeholder="Enter your code here..."
        />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Language
          </label>
          <select
            value={widgetData.language}
            onChange={handleLanguageChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            {languageOptions.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Theme
          </label>
          <select
            value={widgetData.theme || 'light'}
            onChange={handleThemeChange}
            className="w-full border-gray-300 rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="light">Light</option>
            <option value="dark">Dark</option>
            <option value="system">System (auto)</option>
          </select>
        </div>
      </div>

      <div className="flex items-center">
        <input
          id="show-line-numbers"
          type="checkbox"
          checked={widgetData.showLineNumbers}
          onChange={handleShowLineNumbersChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
        />
        <label
          htmlFor="show-line-numbers"
          className="ml-2 block text-sm text-gray-700"
        >
          Show line numbers
        </label>
      </div>
    </div>
  )
}

// Create the CodeWidget interface implementation
const CodeWidget: WidgetComponentInterface<CodeWidgetProps> = {
  ViewComponent: CodeWidgetView,
  EditComponent: CodeWidgetEdit,
}

// Register the code widget
registerWidget<CodeWidgetProps>(codeWidgetMetadata, CodeWidget)

export { CodeWidget, CodeWidgetView, CodeWidgetEdit }
export default CodeWidget
