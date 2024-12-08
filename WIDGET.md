# Widget System Documentation

---

## **Overview**

The widget system is designed to create modular, reusable, and dynamic components for building educational content pages. Each widget is defined by a **type** and associated **info** (data), allowing flexibility and scalability. Widgets can be added directly in code, loaded from a JSON configuration file, or fetched from an API.

---

## **Key Concepts**

### Widget
A **widget** is a self-contained React component representing a unit of content, such as text, images, or other customizable elements.

### WidgetBase
The base component shared by all widgets. It handles common properties like labels, styles (e.g., colors), and layouts.

### WidgetFactory
A factory function responsible for dynamically creating widgets based on their **type** and injecting their corresponding **info**.

---

## **How It Works**

### **Widget Structure**

A widget consists of:
1. **Type**: Specifies the kind of widget (e.g., `TextWidget`, `ImageWidget`).
2. **Info**: A set of properties that define the widget's content and behavior.

#### Example Widget Object:

```json
{
  "type": "TextWidget",
  "info": {
    "label": "Example Text Widget",
    "text": "This is a text widget example.",
    "color": "#ff6347"
  }
}
```

### **Widget Factory**

The `WidgetFactory` dynamically renders a widget based on its type:

```tsx
import React from 'react';
import TextWidget from './widgets/TextWidget';
import ImageWidget from './widgets/ImageWidget';

const WidgetFactory = (type: string, info: any) => {
  switch (type) {
    case 'TextWidget':
      return <TextWidget info={info} />;
    case 'ImageWidget':
      return <ImageWidget info={info} />;
    default:
      return null;
  }
};

export default WidgetFactory;
````

## **Usage**

### Creating a Page with Widgets

Widgets can be statically defined in a React component.

```tsx
import React, { useState } from 'react'; import WidgetFactory from './widgets/WidgetFactory';  const Page: React.FC = () => {   const [widgets] = useState([     {       type: 'TextWidget',       info: { label: 'Text Example', text: 'Hello World!', color: '#ff6347' },     },     {       type: 'ImageWidget',       info: { label: 'Image Example', imageUrl: 'https://example.com/image.jpg', color: '#f0f0f0' },     },   ]);    return (     <div>       {widgets.map((widget, index) => (         <div key={index}>{WidgetFactory(widget.type, widget.info)}</div>       ))}     </div>   ); };  export default Page;`
```

### Loading Widgets from JSON

You can load widgets dynamically from a JSON file or API.

#### Example JSON File (`widgets.json`):

```json

[   {     "type": "TextWidget",     "info": {       "label": "Dynamic Text",       "text": "This widget was loaded from JSON.",       "color": "#00aaff"     }   },   {     "type": "ImageWidget",     "info": {       "label": "Dynamic Image",       "imageUrl": "https://example.com/image2.jpg",       "color": "#abcdef"     }   } ]`

```

#### Loading and Rendering Widgets:

``` tsx
import React, { useEffect, useState } from 'react'; import WidgetFactory from './widgets/WidgetFactory';  const Page: React.FC = () => {   const [widgets, setWidgets] = useState([]);    useEffect(() => {     const fetchWidgets = async () => {       const response = await fetch('/path/to/widgets.json');       const data = await response.json();       setWidgets(data);     };     fetchWidgets();   }, []);    return (     <div>       {widgets.map((widget, index) => (         <div key={index}>{WidgetFactory(widget.type, widget.info)}</div>       ))}     </div>   ); };  export default Page;`
```

## **Extending the Widget System**

1. **Add a New Widget Type**:
    
    - Create a new component (e.g., `VideoWidget`).
    - Add its rendering logic in the `WidgetFactory`.
2. **Customize WidgetBase**:
    
    - Modify the `WidgetBase` to include additional styling or features shared across widgets.
3. **Dynamic Configuration**:
    
    - Use JSON or API endpoints to configure widgets dynamically without modifying the codebase.

---

## **Key Benefits**

- **Scalability**: New widgets can be added with minimal changes.
- **Reusability**: Widgets can be reused across pages or applications.
- **Flexibility**: Widgets can be statically defined, loaded from JSON, or fetched via API.
- **Maintainability**: Centralized widget logic simplifies updates and debugging.

---

## **Future Enhancements**

- **Drag-and-Drop Layouts**: Allow users to reposition and resize widgets interactively.
- **Widget Editor**: A UI for creating and editing widget configurations.
- **Performance Optimization**: Add lazy loading for widgets with heavy resources.

---

Feel free to contribute or open an issue on GitHub! 🚀