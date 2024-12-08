// src/Page.tsx
import React, { useState } from 'react';
import WidgetFactory from '../components/widget/WidgetFactory';

const Page: React.FC = () => {
  //on remplacera ici par une requete pour recuperer le json qui remplira widgets
  const [widgets, setWidgets] = useState([
    {
      type: 'TextWidget',
      info: { label: 'Titre 1', text: 'Voici un texte intéressant sur la page', color: '#ff6347' },
    },
    {
      type: 'ImageWidget',
      info: { label: 'Image Widget 1', imageUrl: 'https://example.com/image1.jpg', color: '#f0f0f0' },
    },
    {
      type: 'ImageWidget',
      info: { label: 'Image Widget 2', imageUrl: 'https://example.com/image2.jpg', color: '#ffffff' },
    },
  ]);

  return (
    <div style={{ padding: '20px' }}>
      {widgets.map((widget, index) => (
        <div key={index} style={{ margin: '10px' }}>
          {WidgetFactory(widget.type, widget.info)} {}
        </div>
      ))}
    </div>
  );
};

export default Page;
