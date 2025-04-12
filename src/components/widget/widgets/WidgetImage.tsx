import React from 'react'
import WidgetBase from '../WidgetBase'
import { ImageWidgetProps } from '../../../types/WidgetTypes'
import { registerWidget } from '../WidgetRegistry'

const ImageWidget: React.FC<{ info: ImageWidgetProps }> = ({ info }) => {
  return (
    <WidgetBase
      info={info}
      content={
        <img
          src={info.imageUrl}
          alt={info.label}
          style={{ maxWidth: '100%', height: 'auto' }}
        />
      }
    />
  )
}

// Enregistrement automatique du widget
registerWidget('ImageWidget', ImageWidget)

export default ImageWidget
