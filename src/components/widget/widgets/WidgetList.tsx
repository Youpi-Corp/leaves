import React from 'react'
import WidgetBase from '../WidgetBase'
import { ListWidgetProps } from '../../../types/WidgetTypes'
import { registerWidget } from '../WidgetRegistry'

const ListWidget: React.FC<{ info: ListWidgetProps }> = ({ info }) => {
  const ListComponent = info.ordered ? 'ol' : 'ul'

  return (
    <WidgetBase
      info={info}
      content={
        <ListComponent
          className={info.ordered ? 'list-decimal pl-5' : 'list-disc pl-5'}
        >
          {info.items.map((item, index) => (
            <li key={index}>{item}</li>
          ))}
        </ListComponent>
      }
    />
  )
}

// Enregistrement automatique du widget
registerWidget('ListWidget', ListWidget)

export default ListWidget
