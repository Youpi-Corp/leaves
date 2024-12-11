import DraggableWidget from '../../widget/DraggableWidget'

interface WidgetShelfProps {
  widgets: string[];
  onWidgetSelect: (widgetType: string) => void;
}

const WidgetShelf: React.FC<WidgetShelfProps> = ({ widgets, onWidgetSelect }) => {
  return (
    <div className="grid grid-cols-2 gap-4 p-4">
      {widgets.map((widget, index) => (
        <button
          key={`shelf-${index}`}
          className="p-4 bg-white rounded-lg shadow hover:shadow-md transition-shadow duration-200 text-center"
          onClick={() => onWidgetSelect(widget)}
        >
          {widget}
        </button>
      ))}
    </div>
  )
}

export default WidgetShelf
