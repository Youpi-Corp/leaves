// Suppression de l'import inutile ReactNode
/**
 * Interface de base pour les propriétés de tous les widgets
 */
export interface BaseWidgetProps {
  id: string
  type: string
  label: string
  color?: string
}

/**
 * Type pour les constructeurs de widgets
 */
export type WidgetComponent<T extends BaseWidgetProps> = React.FC<{
  info: T
}>

/**
 * Interface pour le registre des widgets
 */
export interface WidgetRegistry {
  [key: string]: WidgetComponent<BaseWidgetProps>
}

/**
 * Props spécifiques pour le widget texte
 */
export interface TextWidgetProps extends BaseWidgetProps {
  text: string
}

/**
 * Props spécifiques pour le widget image
 */
export interface ImageWidgetProps extends BaseWidgetProps {
  imageUrl: string
}

/**
 * Props spécifiques pour le widget liste
 */
export interface ListWidgetProps extends BaseWidgetProps {
  items: string[]
  ordered?: boolean
}
