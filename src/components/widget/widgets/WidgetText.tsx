// src/widgets/widgets/TextWidget.tsx
import React from 'react'
import WidgetBase from '../WidgetBase'
import { TextWidgetProps } from '../../../types/WidgetTypes'
import { registerWidget } from '../WidgetRegistry'

const TextWidget: React.FC<{ info: TextWidgetProps }> = ({ info }) => {
  return <WidgetBase info={info} content={<p>{info.text}</p>} />
}

// Enregistrement automatique du widget
registerWidget('TextWidget', TextWidget)

export default TextWidget
