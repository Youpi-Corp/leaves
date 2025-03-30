// src/widgets/widgets/TextWidget.tsx
import React from 'react'
import WidgetBase from '../WidgetBase'

interface TextWidgetProps {
  info: {
    label: string
    text: string
    color?: string
    id: string
  }
}

const TextWidget: React.FC<TextWidgetProps> = ({ info }) => {
  return <WidgetBase info={info} content={<p>{info.text}</p>} />
}

// TextWidget.defaultProps = {
//   info: {
//     label: 'Text Widget',
//     text: 'Default text',
//     color: '#000',
//   },
// };

export default TextWidget
