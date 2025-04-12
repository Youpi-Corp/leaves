// src/Page.tsx
import React, { useState } from 'react'
import WidgetFactory from '../components/widget/WidgetFactory'
import {
  TextWidgetProps,
  ImageWidgetProps,
  ListWidgetProps,
} from '../types/WidgetTypes'

// Importation des widgets pour s'assurer qu'ils sont enregistrés
import '../components/widget/widgets/WidgetText'
import '../components/widget/widgets/WidgetImage'
import '../components/widget/widgets/WidgetList'

const Page: React.FC = () => {
  // Dans un vrai cas d'usage, ces données viendraient d'une API
  const [widgets] = useState([
    {
      id: 'text-1',
      type: 'TextWidget',
      label: 'Titre 1',
      text: 'Voici un texte intéressant sur la page',
      color: '#ff6347',
    } as TextWidgetProps,
    {
      id: 'image-1',
      type: 'ImageWidget',
      label: 'Image Widget 1',
      imageUrl: 'https://via.placeholder.com/350x150?text=Image+1',
      color: '#f0f0f0',
    } as ImageWidgetProps,
    {
      id: 'image-2',
      type: 'ImageWidget',
      label: 'Image Widget 2',
      imageUrl: 'https://via.placeholder.com/350x150?text=Image+2',
      color: '#ffffff',
    } as ImageWidgetProps,
    {
      id: 'list-1',
      type: 'ListWidget',
      label: 'Liste à puces',
      items: ['Premier élément', 'Deuxième élément', 'Troisième élément'],
      ordered: false,
      color: '#4682b4',
    } as ListWidgetProps,
  ])

  return (
    <div style={{ padding: '20px' }}>
      {widgets.map((widget, index) => (
        <div key={index} style={{ margin: '10px' }}>
          {WidgetFactory(widget.type, widget)}
        </div>
      ))}
    </div>
  )
}

export default Page
