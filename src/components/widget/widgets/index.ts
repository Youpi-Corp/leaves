/**
 * Dynamic widget loading system
 *
 * This file automatically discovers and registers all widget implementations
 * in the current directory. To add a new widget, simply create a new file
 * with the naming pattern *Widget.tsx and it will be automatically loaded.
 */

// Dynamic import of all widget files using Vite's import.meta.glob
// This automatically imports any file ending with Widget.tsx in this directory
const widgetModules = import.meta.glob('./*Widget.tsx', { eager: true })

// Log discovered widgets for debugging
console.log(
  'Discovered widgets:',
  Object.keys(widgetModules)
    .map((path) => {
      // Extract widget name from path (e.g., "./TextWidget.tsx" -> "TextWidget")
      const widgetName = path.split('/').pop()?.replace('.tsx', '')
      return widgetName
    })
    .filter(Boolean)
)

// The dynamic re-export approach using 'exports' doesn't work in ESM/browser environment
// Instead, we'll use explicit exports to ensure backward compatibility
// Each widget component self-registers with the widget registry,
// so no additional code is needed here for registration

// Export all widgets explicitly - this ensures TypeScript knows about these exports
export * from './TextWidget'
export * from './ImageWidget'
export * from './ListWidget'
export * from './CodeWidget'
export * from './CalendarWidget'
export * from '../quiz/MultipleChoiceWidget'

// Create a consolidated export for easier access to all widgets
export const widgetModulesMap = widgetModules
