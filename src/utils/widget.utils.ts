/**
 * Widget utility functions for determining widget capabilities and completion status
 */
import { BaseWidgetProps } from '../types/WidgetTypes'
import { getWidgetByType } from '../components/widget/WidgetRegistry'

// Type for widget content wrapper (as used in lessons)
interface WidgetContent {
    id: string
    type: string
    content: BaseWidgetProps
}

// Union type for both direct widgets and wrapped widgets
type WidgetLike = BaseWidgetProps | WidgetContent

/**
 * Extract the actual widget data from either a direct widget or wrapped widget
 */
function extractWidget(widget: WidgetLike): BaseWidgetProps {
    // Check if this is a wrapped widget (has content property)
    if ('content' in widget && widget.content &&
        typeof widget.content === 'object' &&
        'id' in widget.content && 'type' in widget.content) {
        return widget.content as BaseWidgetProps
    }
    return widget as BaseWidgetProps
}

/**
 * Check if a widget is interactive (requires user input for completion)
 */
export function isInteractiveWidget(widget: WidgetLike): boolean {
    const actualWidget = extractWidget(widget)
    const registryEntry = getWidgetByType(actualWidget.type)
    return registryEntry?.metadata.interactive === true
}

/**
 * Check if a widget has been completed/answered
 * For interactive widgets, this checks if they have answer data
 * For non-interactive widgets, this always returns true
 */
export function isWidgetCompleted(widget: WidgetLike, widgetAnswers: Record<string, unknown> = {}): boolean {
    // If it's not an interactive widget, consider it completed
    if (!isInteractiveWidget(widget)) {
        return true
    }

    // For interactive widgets, check if there's an answer recorded
    const widgetId = 'content' in widget ? widget.id : widget.id
    return widgetId in widgetAnswers
}

/**
 * Check if a widget has been completed with a correct answer
 * For interactive widgets, this checks if they have a correct answer
 * For non-interactive widgets, this always returns true
 */
export function isWidgetCompletedCorrectly(widget: WidgetLike, widgetAnswers: Record<string, boolean> = {}): boolean {
    // If it's not an interactive widget, consider it completed
    if (!isInteractiveWidget(widget)) {
        return true
    }

    // For interactive widgets, check if there's a correct answer recorded
    const widgetId = 'content' in widget ? widget.id : widget.id
    return widgetAnswers[widgetId] === true
}

/**
 * Get all interactive widgets from a list of widgets
 */
export function getInteractiveWidgets(widgets: WidgetLike[]): WidgetLike[] {
    return widgets.filter(isInteractiveWidget)
}

/**
 * Get completion status for all interactive widgets
 */
export function getInteractiveWidgetCompletion(
    widgets: WidgetLike[],
    widgetAnswers: Record<string, unknown> = {}
): { completed: number; total: number; isComplete: boolean } {
    const interactiveWidgets = getInteractiveWidgets(widgets)
    const completed = interactiveWidgets.filter(widget =>
        isWidgetCompleted(widget, widgetAnswers)
    ).length

    return {
        completed,
        total: interactiveWidgets.length,
        isComplete: completed === interactiveWidgets.length
    }
}

/**
 * Get completion status for all interactive widgets (only counting correct answers)
 */
export function getInteractiveWidgetCorrectCompletion(
    widgets: WidgetLike[],
    widgetAnswers: Record<string, boolean> = {}
): { completed: number; total: number; isComplete: boolean } {
    const interactiveWidgets = getInteractiveWidgets(widgets)
    const completed = interactiveWidgets.filter(widget =>
        isWidgetCompletedCorrectly(widget, widgetAnswers)
    ).length

    return {
        completed,
        total: interactiveWidgets.length,
        isComplete: completed === interactiveWidgets.length
    }
}

/**
 * Check if all interactive widgets in a lesson are completed
 */
export function areAllInteractiveWidgetsCompleted(
    widgets: WidgetLike[],
    widgetAnswers: Record<string, unknown> = {}
): boolean {
    const { isComplete } = getInteractiveWidgetCompletion(widgets, widgetAnswers)
    return isComplete
}

/**
 * Check if all interactive widgets in a lesson are completed with correct answers
 */
export function areAllInteractiveWidgetsCompletedCorrectly(
    widgets: WidgetLike[],
    widgetAnswers: Record<string, boolean> = {}
): boolean {
    const { isComplete } = getInteractiveWidgetCorrectCompletion(widgets, widgetAnswers)
    return isComplete
}
