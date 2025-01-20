// src/widgets/WidgetBase.tsx
import React from 'react';

interface WidgetBaseProps {
  info: {
    label: string;
    text?: string;
    color?: string;
  };
  content: React.ReactNode;
}

const WidgetBase: React.FC<WidgetBaseProps> = ({ info: WidgetInfo, content: WidgetContent }) => {
  return (
    <div style={{ padding: '16px', border: '1px solid #ccc', backgroundColor: '#fff' }}>
      <h4>{WidgetInfo.label}</h4>
      <div style={{ color: WidgetInfo.color || '#000' }}>{WidgetContent}</div>
    </div>
  );
};

export default WidgetBase;
