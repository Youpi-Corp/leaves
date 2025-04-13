/**
 * Widget Props Registry - Central type definitions for widget props
 *
 * This file creates the structure for TypeScript's module augmentation pattern
 * that allows widgets to define their props in their own files without
 * needing to modify the central WidgetTypes.ts file.
 */
import { BaseWidgetProps } from './WidgetTypes'

/**
 * This interface acts as a registry of all widget props
 * Each widget will extend this interface in their own file using
 * declaration merging/module augmentation
 */
export interface WidgetPropsRegistry {
  // Base record type with string index to satisfy the no-empty-interface rule
  // This allows widget components to extend it with their own props
  [widgetType: string]: BaseWidgetProps

  // Widget components will extend this registry using the 'declare module' syntax
  // For example:
  //
  // declare module '../../../types/WidgetPropsRegistry' {
  //   interface WidgetPropsRegistry {
  //     YourWidget: YourWidgetProps
  //   }
  // }
}

/**
 * Type helper to get the props type for a specific widget
 * Usage: WidgetPropsFor<'TextWidget'> gives you TextWidgetProps
 */
export type WidgetPropsFor<T extends keyof WidgetPropsRegistry> =
  WidgetPropsRegistry[T]
