import {
  BaseWidgetProps,
  WidgetComponent,
  WidgetRegistry,
} from '../../types/WidgetTypes'

/**
 * Registre global des widgets - tous les widgets disponibles seront enregistrés ici
 */
const widgetRegistry: WidgetRegistry = {}

/**
 * Fonction pour enregistrer un nouveau type de widget
 * @param type - Le type de widget (clé unique pour identifier le widget)
 * @param component - Le composant React implémentant le widget
 */
export function registerWidget<T extends BaseWidgetProps>(
  type: string,
  component: WidgetComponent<T>
): void {
  if (widgetRegistry[type]) {
    console.warn(
      `Widget de type '${type}' est déjà enregistré. Il sera remplacé.`
    )
  }

  widgetRegistry[type] =
    component as unknown as WidgetComponent<BaseWidgetProps>
}

/**
 * Fonction pour récupérer tous les types de widgets enregistrés
 * @returns Un tableau contenant tous les types de widgets disponibles
 */
export function getAvailableWidgetTypes(): string[] {
  return Object.keys(widgetRegistry)
}

/**
 * Fonction pour récupérer un widget par son type
 * @param type - Le type de widget à récupérer
 * @returns Le composant widget correspondant au type ou undefined s'il n'existe pas
 */
export function getWidgetByType<T extends BaseWidgetProps>(
  type: string
): WidgetComponent<T> | undefined {
  return widgetRegistry[type] as WidgetComponent<T> | undefined
}

export default widgetRegistry
