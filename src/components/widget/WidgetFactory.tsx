import React from 'react'
import { BaseWidgetProps } from '../../types/WidgetTypes'
import { getWidgetByType } from './WidgetRegistry'

// Import des widgets pour s'assurer qu'ils sont enregistrés
import './widgets/WidgetText'
import './widgets/WidgetImage'

const WidgetFactory = <T extends BaseWidgetProps>(
  type: string,
  info: T
): React.ReactNode => {
  const WidgetComponent = getWidgetByType<T>(type)

  if (!WidgetComponent) {
    console.warn(`Widget de type '${type}' n'est pas enregistré.`)
    return null
  }

  return <WidgetComponent info={{ ...info, type }} />
}

export default WidgetFactory
