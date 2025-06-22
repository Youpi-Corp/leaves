import { getCourseByIdQuery } from '../api/course/course.queries'

// Cache for lesson to module mapping
const lessonModuleCache = new Map<number, number>()

/**
 * Get the module ID for a given lesson ID
 * This helps with proper navigation fallbacks
 */
export const getModuleIdForLesson = async (lessonId: number): Promise<number | null> => {
    // Check cache first
    if (lessonModuleCache.has(lessonId)) {
        return lessonModuleCache.get(lessonId)!
    }

    try {
        const course = await getCourseByIdQuery(lessonId)
        if (course.module_id) {
            lessonModuleCache.set(lessonId, course.module_id)
            return course.module_id
        }
    } catch (error) {
        console.error('Error fetching module ID for lesson:', error)
    }

    return null
}

/**
 * Clear the cache when needed
 */
export const clearLessonModuleCache = () => {
    lessonModuleCache.clear()
}

/**
 * Get smart navigation fallback based on current path
 * This provides safe fallback routes to prevent navigation loops
 */
export const getNavigationFallback = (currentPath: string, history?: string[]): string => {
    // If we have history, avoid going back to a path that might create a loop
    const safeHistory = history || []

    // Helper function to check if a path would create a loop
    const wouldCreateLoop = (targetPath: string): boolean => {
        if (!safeHistory.length) return false

        // Count how many times this path appears in recent history
        const recentHistory = safeHistory.slice(-4) // Check last 4 entries
        const occurrences = recentHistory.filter(path => path === targetPath).length

        // If this path appears more than once in recent history, it might create a loop
        return occurrences > 1
    }

    // Lesson content -> Lesson view (but check for loops)
    const lessonContentMatch = currentPath.match(/^\/lesson\/(\d+)\/content$/)
    if (lessonContentMatch) {
        const lessonPath = `/lesson/${lessonContentMatch[1]}`
        if (!wouldCreateLoop(lessonPath)) {
            return lessonPath
        }
        // If lesson would create a loop, go to home
        return '/'
    }

    // Lesson view -> Try to go to associated module, or home if that would loop
    const lessonMatch = currentPath.match(/^\/lesson\/(\d+)$/)
    if (lessonMatch) {
        // For now, always go to home from lesson to break potential loops
        // In the future, we could try to get the module ID and go there
        return '/'
    }

    // Module view -> Home
    const moduleMatch = currentPath.match(/^\/module\/(\d+)$/)
    if (moduleMatch) {
        return '/'
    }

    // Module edition -> Dashboard
    const moduleEditionMatch = currentPath.match(/^\/edition\/dashboard\/(\d+)$/)
    if (moduleEditionMatch) {
        return '/edition/dashboard/'
    }

    // Editor with lesson ID -> Dashboard
    const editorLessonMatch = currentPath.match(/^\/edition\/editor\/(\d+)$/)
    if (editorLessonMatch) {
        return '/edition/dashboard/'
    }

    // Editor root -> Dashboard
    if (currentPath === '/edition/editor/' || currentPath === '/edition/editor') {
        return '/edition/dashboard/'
    }

    // Dashboard -> Home
    if (currentPath === '/edition/dashboard/' || currentPath === '/edition/dashboard') {
        return '/'
    }

    // Profile/subscriptions -> Home
    if (currentPath === '/profile' || currentPath === '/subscriptions') {
        return '/'
    }

    // Auth pages -> Home
    if (currentPath === '/login' || currentPath === '/register') {
        return '/'
    }

    // Default fallback - always go to home
    return '/'
}
