import DraggableWidget from '../../widget/DraggableWidget'

const WidgetShelf = ({ widgets }: { widgets: string[] }) => {
  return (
    <div>
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
