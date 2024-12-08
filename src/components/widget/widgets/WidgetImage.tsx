// src/widgets/widgets/ImageWidget.tsx
import React from 'react';
import WidgetBase from '../WidgetBase';

interface ImageWidgetProps {
  info: {
    label: string;
    imageUrl: string;
    color?: string;
  };
}

const ImageWidget: React.FC<ImageWidgetProps> = ({ info }) => {
  return (
    <WidgetBase
      info={info}
      content={<img src={info.imageUrl} alt={info.label} style={{ maxWidth: '100%', height: 'auto' }} />}
    />
  );
};

export default ImageWidget;
