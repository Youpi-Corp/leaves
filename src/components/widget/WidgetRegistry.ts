/**
 * Enhanced Widget Registry with plugin system for scalable widget management
 */
import {
  BaseWidgetProps,
  WidgetComponentInterface,
  WidgetMetadata,
  WidgetRegistryEntry,
} from '../../types/WidgetTypes'

/**
 * Global widget registry to store all available widgets
 */
class WidgetRegistryManager {
  // Using unknown as the base type for heterogeneous widget type storage
  private registry: Map<string, unknown> = new Map()
  private eventListeners: Map<string, Array<(...args: unknown[]) => void>> =
    new Map()

  /**
   * Register a new widget
   */
  register<T extends BaseWidgetProps>(
    metadata: WidgetMetadata,
    component: WidgetComponentInterface<T>
  ): void {
    if (this.registry.has(metadata.type)) {
      console.warn(
        `Widget type '${metadata.type}' is already registered. It will be replaced.`
      )
    }

    this.registry.set(metadata.type, {
      metadata,
      component,
    } as WidgetRegistryEntry<T>)

    // Trigger event listeners
    this.triggerEvent('register', metadata.type)
  }

  /**
   * Get a widget by its type
   */
  getWidget<T extends BaseWidgetProps>(
    type: string
  ): WidgetRegistryEntry<T> | undefined {
    return this.registry.get(type) as WidgetRegistryEntry<T> | undefined
  }

  /**
   * Get all available widget types
   */
  getAvailableWidgetTypes(): string[] {
    return Array.from(this.registry.keys())
  }

  /**
   * Get all widgets metadata
   */
  getAllWidgetsMetadata(): WidgetMetadata[] {
    return Array.from(this.registry.values()).map(
      (entry) => (entry as WidgetRegistryEntry<BaseWidgetProps>).metadata
    )
  }

  /**
   * Get widgets by category
   */
  getWidgetsByCategory(category: string): WidgetMetadata[] {
    return this.getAllWidgetsMetadata().filter(
      (metadata) => metadata.category === category
    )
  }

  /**
   * Get widgets by tag
   */
  getWidgetsByTag(tag: string): WidgetMetadata[] {
    return this.getAllWidgetsMetadata().filter((metadata) =>
      metadata.tags?.includes(tag)
    )
  }

  /**
   * Search widgets by name or description
   */
  searchWidgets(query: string): WidgetMetadata[] {
    const searchTerm = query.toLowerCase()
    return this.getAllWidgetsMetadata().filter(
      (metadata) =>
        metadata.displayName.toLowerCase().includes(searchTerm) ||
        metadata.description.toLowerCase().includes(searchTerm) ||
        metadata.tags?.some((tag) => tag.toLowerCase().includes(searchTerm))
    )
  }

  /**
   * Add event listener
   */
  addEventListener(
    event: string,
    callback: (...args: unknown[]) => void
  ): void {
    if (!this.eventListeners.has(event)) {
      this.eventListeners.set(event, [])
    }
    this.eventListeners.get(event)?.push(callback)
  }

  /**
   * Remove event listener
   */
  removeEventListener(
    event: string,
    callback: (...args: unknown[]) => void
  ): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      const index = listeners.indexOf(callback)
      if (index !== -1) {
        listeners.splice(index, 1)
      }
    }
  }

  /**
   * Trigger event
   */
  private triggerEvent(event: string, ...args: unknown[]): void {
    const listeners = this.eventListeners.get(event)
    if (listeners) {
      listeners.forEach((callback) => callback(...args))
    }
  }
}

// Export singleton instance
export const widgetRegistry = new WidgetRegistryManager()

/**
 * Helper function for registering widgets in a type-safe way
 */
export function registerWidget<T extends BaseWidgetProps>(
  metadata: WidgetMetadata,
  component: WidgetComponentInterface<T>
): void {
  widgetRegistry.register(metadata, component)
}

/**
 * Helper hooks and utilities for widget management
 */
export function getWidgetByType<T extends BaseWidgetProps>(
  type: string
): WidgetRegistryEntry<T> | undefined {
  return widgetRegistry.getWidget<T>(type)
}

export default widgetRegistry
