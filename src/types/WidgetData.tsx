import { BaseWidgetProps } from './WidgetTypes'

interface WidgetData extends BaseWidgetProps {
  id: string
  type: string
  content: string
  position: {
    x: number
    y: number
  }
  size: {
    width: number
    height: number
  }
  // Champs dynamiques pour tous types de données spécifiques aux widgets
  [key: string]: string | number | boolean | object | Array<unknown> | undefined
}

export default WidgetData
