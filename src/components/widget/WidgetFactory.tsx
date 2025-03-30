import React from 'react'
import TextWidget from './widgets/WidgetText'
import ImageWidget from './widgets/WidgetImage'

const WidgetFactory = (type: string, info: any) => {
  switch (type) {
    case 'TextWidget':
      return <TextWidget info={info} />
    case 'ImageWidget':
      return <ImageWidget info={info} />
    default:
      return null
  }
}

export default WidgetFactory
