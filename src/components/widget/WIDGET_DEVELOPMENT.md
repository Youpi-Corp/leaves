# Widget Development Guide

This document provides guidelines and instructions for creating custom widgets for the Brainforest platform. The widget system is designed to be extensible and community-friendly, allowing developers to create and share their own widgets.

## Table of Contents

1. [Widget Architecture](#widget-architecture)
2. [Creating a Basic Widget](#creating-a-basic-widget)
3. [View and Edit Modes](#view-and-edit-modes)
4. [Widget Registration](#widget-registration)
5. [Best Practices](#best-practices)
6. [Styling Guidelines](#styling-guidelines)
7. [Testing Your Widget](#testing-your-widget)
8. [Contributing](#contributing)

## Widget Architecture

The widget system is built around several key components:

- **Widget Types**: TypeScript interfaces that define the props and structure of widgets
- **Widget Container**: A wrapper component that provides common behaviors (drag, edit/view modes)
- **Widget Registry**: A central registry where widgets are registered and discovered
- **Widget Factory**: Creates widget instances based on their registered types
- **Widget Picker**: UI component for users to browse and add widgets

Each widget consists of:

1. A TypeScript interface extending `BaseWidgetProps`
2. A View component for displaying content
3. An Edit component for modifying content
4. Metadata for discovery and documentation

## Creating a Basic Widget

### 1. Define the Widget Props

First, define your widget's props by extending the `BaseWidgetProps` interface:

```typescript
// In types/WidgetTypes.ts or your own file
export interface MyCustomWidgetProps extends BaseWidgetProps {
  mainContent: string
  showHeader: boolean
  headerText?: string
  // Add any other properties your widget needs
}
```

### 2. Create View and Edit Components

Create separate components for view and edit modes:

```tsx
// View Component - Renders the widget content
const MyCustomWidgetView: React.FC<WidgetViewProps<MyCustomWidgetProps>> = ({
  widgetData,
}) => {
  const { mainContent, showHeader, headerText } = widgetData

  return (
    <div className="my-custom-widget">
      {showHeader && headerText && <h3>{headerText}</h3>}
      <div>{mainContent}</div>
    </div>
  )
}

// Edit Component - Provides UI for editing the widget
const MyCustomWidgetEdit: React.FC<WidgetEditProps<MyCustomWidgetProps>> = ({
  widgetData,
  onChange,
  onSave,
  onCancel,
}) => {
  // Create handlers for input changes
  const handleMainContentChange = (
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) => {
    onChange({
      ...widgetData,
      mainContent: e.target.value,
    })
  }

  const handleShowHeaderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...widgetData,
      showHeader: e.target.checked,
    })
  }

  // Add more handlers for other properties

  return (
    <div className="space-y-4">
      {/* Form fields for editing */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Main Content
        </label>
        <textarea
          value={widgetData.mainContent}
          onChange={handleMainContentChange}
          className="w-full border-gray-300 rounded-md"
          rows={5}
        />
      </div>

      <div className="flex items-center">
        <input
          type="checkbox"
          checked={widgetData.showHeader}
          onChange={handleShowHeaderChange}
          className="h-4 w-4 text-blue-600 focus:ring-blue-500"
          id="show-header"
        />
        <label htmlFor="show-header" className="ml-2 text-sm text-gray-700">
          Show Header
        </label>
      </div>

      {/* Add more form fields as needed */}

      {/* Save/Cancel buttons */}
      <div className="pt-2 flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={onSave}
          className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700"
        >
          Save
        </button>
      </div>
    </div>
  )
}
```

### 3. Create the Widget Implementation

Combine the view and edit components:

```tsx
// Create the widget interface implementation
const MyCustomWidget: WidgetComponentInterface<MyCustomWidgetProps> = {
  ViewComponent: MyCustomWidgetView,
  EditComponent: MyCustomWidgetEdit,
}
```

### 4. Define Widget Metadata and Register

```tsx
// Define metadata for the widget
const myCustomWidgetMetadata: WidgetMetadata = {
  type: 'MyCustomWidget',
  displayName: 'My Custom Widget',
  description: 'A description of what this widget does',
  icon: 'custom-icon',
  category: 'Custom',
  version: '1.0.0',
  tags: ['custom', 'example'],
}

// Register the widget
registerWidget<MyCustomWidgetProps>(myCustomWidgetMetadata, MyCustomWidget)

export { MyCustomWidget, MyCustomWidgetView, MyCustomWidgetEdit }
export default MyCustomWidget
```

## View and Edit Modes

Every widget has two modes:

1. **View Mode**: How users see the widget in normal usage
2. **Edit Mode**: UI for modifying the widget's content and properties

When creating these components, remember:

- **View should be optimized for reading/consuming**: Focus on clarity and performance
- **Edit should be intuitive**: Provide good defaults and immediate visual feedback
- **Validate inputs**: Prevent users from entering invalid data
- **Preview changes**: Where possible, show how changes will look

## Widget Registration

All widgets must be registered with the `widgetRegistry` to be discoverable. The registration includes:

- **Type**: A unique identifier for the widget
- **Metadata**: Information about the widget for discovery and documentation
- **Component Interface**: The ViewComponent and EditComponent implementations

```typescript
registerWidget<MyWidgetProps>(myWidgetMetadata, MyWidgetComponentInterface)
```

## Best Practices

1. **Keep widgets focused**: Each widget should do one thing well
2. **Make properties type-safe**: Use TypeScript interfaces for props
3. **Use composition**: Break complex widgets into smaller components
4. **Provide good defaults**: Make widgets work well out-of-the-box
5. **Support accessibility**: Use semantic HTML and ARIA attributes
6. **Optimize performance**: Minimize rerenders, especially for view mode
7. **Add proper documentation**: Include examples and prop descriptions

## Styling Guidelines

- Use Tailwind CSS for styling to maintain consistency
- Follow the design system's color palette and spacing
- Ensure your widget looks good at different screen sizes
- Maintain consistent padding and margins with other widgets
- Use the theme variables for colors and typography
- Avoid fixed dimensions where possible

## Testing Your Widget

Before contributing a widget:

1. Test in both view and edit modes
2. Verify drag-and-drop behavior works
3. Test with different content sizes
4. Ensure your widget renders properly on different devices
5. Write unit tests for your widget's logic
6. Test edge cases (empty data, very large content, etc.)

## Contributing

To contribute your widget to the main repository:

1. Fork the repository
2. Create a feature branch for your widget
3. Add your widget following the guidelines in this document
4. Add tests and documentation
5. Submit a pull request

We review all contributions and may provide feedback for improvements before merging.

---

Happy widget development! If you have questions or need help, please reach out to the community on our Discord or open an issue on GitHub.
