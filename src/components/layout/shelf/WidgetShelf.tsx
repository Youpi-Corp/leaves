import DraggableWidget from '../../widget/DraggableWidget'

const WidgetShelf = ({ widgets }: { widgets: string[] }) => {
  return (
    <div className="grid grid-cols-2 gap-4">
      {widgets.map((widget, index) => (
        <DraggableWidget
          key={`shelf-${index}`}
          id={`shelf-${index}`}
          content={widget}
        />
      ))}
    </div>
  )
}

export default WidgetShelf
