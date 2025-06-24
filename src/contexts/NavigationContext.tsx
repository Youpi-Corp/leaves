import React, {
  createContext,
  useContext,
  useState,
  useEffect,
  ReactNode,
} from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { getNavigationFallback } from '../services/navigation.service'

interface BreadcrumbItem {
  label: string
  path: string
  isActive?: boolean
}

interface NavigationState {
  history: string[]
  currentIndex: number
  breadcrumbs: BreadcrumbItem[]
  canGoBack: boolean
  canGoForward: boolean
}

interface NavigationContextType {
  navigationState: NavigationState
  goBack: (fallbackPath?: string) => void
  goForward: () => void
  goHome: () => void
  goToModule: (moduleId: number) => void
  goToLesson: (lessonId: number) => void
  goToLessonContent: (lessonId: number) => void
  goToLogin: () => void
  navigateWithBreadcrumb: (path: string) => void
  clearHistory: () => void
  buildBreadcrumbs: (currentPath: string) => BreadcrumbItem[]
}

const NavigationContext = createContext<NavigationContextType | undefined>(
  undefined
)

export const useNavigation = () => {
  const context = useContext(NavigationContext)
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider')
  }
  return context
}

interface NavigationProviderProps {
  children: ReactNode
}

export const NavigationProvider: React.FC<NavigationProviderProps> = ({
  children,
}) => {
  const navigate = useNavigate()
  const location = useLocation()

  const [navigationState, setNavigationState] = useState<NavigationState>({
    history: [],
    currentIndex: -1,
    breadcrumbs: [],
    canGoBack: false,
    canGoForward: false,
  })
  // Build breadcrumbs based on current path
  const buildBreadcrumbs = (currentPath: string): BreadcrumbItem[] => {
    // Handle specific route patterns
    if (currentPath === '/') {
      return [{ label: 'Home', path: '/', isActive: true }]
    }

    // Module view pattern
    const moduleMatch = currentPath.match(/^\/module\/(\d+)$/)
    if (moduleMatch) {
      const moduleId = moduleMatch[1]
      return [
        { label: 'Home', path: '/' },
        { label: 'Module', path: `/module/${moduleId}`, isActive: true },
      ]
    }

    // Lesson view pattern
    const lessonMatch = currentPath.match(/^\/lesson\/(\d+)$/)
    if (lessonMatch) {
      const lessonId = lessonMatch[1]
      // We'll need to get the module ID from the lesson data
      // For now, provide a fallback to home
      return [
        { label: 'Home', path: '/' },
        { label: 'Lesson', path: `/lesson/${lessonId}`, isActive: true },
      ]
    }

    // Lesson content pattern
    const lessonContentMatch = currentPath.match(/^\/lesson\/(\d+)\/content$/)
    if (lessonContentMatch) {
      const lessonId = lessonContentMatch[1]
      return [
        { label: 'Home', path: '/' },
        { label: 'Lesson', path: `/lesson/${lessonId}` },
        {
          label: 'Content',
          path: `/lesson/${lessonId}/content`,
          isActive: true,
        },
      ]
    }

    // Edition dashboard
    if (currentPath === '/edition/dashboard/') {
      return [
        { label: 'Home', path: '/' },
        { label: 'Dashboard', path: '/edition/dashboard/', isActive: true },
      ]
    }

    // Module edition pattern
    const moduleEditionMatch = currentPath.match(
      /^\/edition\/dashboard\/(\d+)$/
    )
    if (moduleEditionMatch) {
      const moduleId = moduleEditionMatch[1]
      return [
        { label: 'Home', path: '/' },
        { label: 'Dashboard', path: '/edition/dashboard/' },
        {
          label: 'Edit Module',
          path: `/edition/dashboard/${moduleId}`,
          isActive: true,
        },
      ]
    }

    // Course editor patterns
    if (currentPath === '/edition/editor/') {
      return [
        { label: 'Home', path: '/' },
        { label: 'Dashboard', path: '/edition/dashboard/' },
        { label: 'Editor', path: '/edition/editor/', isActive: true },
      ]
    }

    const editorMatch = currentPath.match(/^\/edition\/editor\/(\d+)$/)
    if (editorMatch) {
      const lessonId = editorMatch[1]
      return [
        { label: 'Home', path: '/' },
        { label: 'Dashboard', path: '/edition/dashboard/' },
        {
          label: 'Editor',
          path: `/edition/editor/${lessonId}`,
          isActive: true,
        },
      ]
    } // Profile and subscriptions
    if (currentPath === '/profile') {
      return [
        { label: 'Home', path: '/' },
        { label: 'Profile', path: '/profile', isActive: true },
      ]
    }

    if (currentPath === '/subscriptions') {
      return [
        { label: 'Home', path: '/' },
        { label: 'Subscriptions', path: '/subscriptions', isActive: true },
      ]
    }

    // Admin panel
    if (currentPath === '/admin') {
      return [
        { label: 'Home', path: '/' },
        { label: 'Admin Panel', path: '/admin', isActive: true },
      ]
    }

    // Default fallback
    return [
      { label: 'Home', path: '/' },
      { label: 'Current Page', path: currentPath, isActive: true },
    ]
  } // Update navigation state when location changes
  useEffect(() => {
    const currentPath = location.pathname

    setNavigationState((prev) => {
      // If this is the first navigation or coming from a fresh start
      if (prev.history.length === 0) {
        return {
          ...prev,
          history: [currentPath],
          currentIndex: 0,
          breadcrumbs: buildBreadcrumbs(currentPath),
          canGoBack: false,
          canGoForward: false,
        }
      }

      // Check if this is a back/forward navigation
      const currentEntry = prev.history[prev.currentIndex]

      // If the current path is the same as what we expect, no change
      if (currentEntry === currentPath) {
        return {
          ...prev,
          breadcrumbs: buildBreadcrumbs(currentPath),
        }
      }

      // Check if this path exists in history after current index (forward navigation)
      const forwardIndex = prev.history.findIndex(
        (path, index) => index > prev.currentIndex && path === currentPath
      )

      if (forwardIndex !== -1) {
        // This is forward navigation
        return {
          ...prev,
          currentIndex: forwardIndex,
          breadcrumbs: buildBreadcrumbs(currentPath),
          canGoBack: forwardIndex > 0,
          canGoForward: forwardIndex < prev.history.length - 1,
        }
      }

      // Check if this path exists in history before current index (back navigation)
      const backIndex = prev.history.findIndex(
        (path, index) => index < prev.currentIndex && path === currentPath
      )

      if (backIndex !== -1) {
        // This is back navigation
        return {
          ...prev,
          currentIndex: backIndex,
          breadcrumbs: buildBreadcrumbs(currentPath),
          canGoBack: backIndex > 0,
          canGoForward: true, // We can go forward since we went back
        }
      }

      // This is a new navigation - truncate history from current index and add new entry
      const newHistory = [
        ...prev.history.slice(0, prev.currentIndex + 1),
        currentPath,
      ]
      const newIndex = newHistory.length - 1

      // Limit history size to prevent memory issues
      const maxHistorySize = 10
      if (newHistory.length > maxHistorySize) {
        newHistory.shift()
        return {
          ...prev,
          history: newHistory,
          currentIndex: newHistory.length - 1,
          breadcrumbs: buildBreadcrumbs(currentPath),
          canGoBack: newHistory.length > 1,
          canGoForward: false,
        }
      }

      return {
        ...prev,
        history: newHistory,
        currentIndex: newIndex,
        breadcrumbs: buildBreadcrumbs(currentPath),
        canGoBack: newIndex > 0,
        canGoForward: false, // New navigation clears forward history
      }
    })
  }, [location.pathname]) // Proper back navigation that prevents cycles
  const goBack = (fallbackPath?: string) => {
    const { history, currentIndex } = navigationState
    const currentPath = location.pathname

    console.log('Navigation Debug:', {
      currentPath,
      history,
      currentIndex,
      fallbackPath,
    })

    // If we can go back in history, do it
    if (currentIndex > 0) {
      const previousPath = history[currentIndex - 1]

      // Make sure the previous path is different and valid
      if (previousPath && previousPath !== currentPath) {
        console.log('Going back to:', previousPath)
        navigate(previousPath)
        return
      }
    } // Use provided fallback or smart fallback
    const defaultFallback =
      fallbackPath || getNavigationFallback(currentPath, history)
    console.log('Using fallback:', defaultFallback)

    // Clear history and navigate to fallback to prevent further loops
    setNavigationState((prev) => ({
      ...prev,
      history: [defaultFallback],
      currentIndex: 0,
      canGoBack: false,
      canGoForward: false,
    }))

    navigate(defaultFallback)
  }
  const goForward = () => {
    const { history, currentIndex } = navigationState

    // If we can go forward in history, do it
    if (currentIndex < history.length - 1) {
      const nextPath = history[currentIndex + 1]

      if (nextPath) {
        console.log('Going forward to:', nextPath)
        navigate(nextPath)
      }
    }
  }

  const goHome = () => navigate('/')

  const goToModule = (moduleId: number) => navigate(`/module/${moduleId}`)

  const goToLesson = (lessonId: number) => navigate(`/lesson/${lessonId}`)

  const goToLessonContent = (lessonId: number) =>
    navigate(`/lesson/${lessonId}/content`)

  const goToLogin = () => navigate('/login')
  const navigateWithBreadcrumb = (path: string) => {
    navigate(path)
  }
  const clearHistory = () => {
    const currentPath = location.pathname
    setNavigationState((prev) => ({
      ...prev,
      history: [currentPath],
      currentIndex: 0,
      canGoBack: false,
      canGoForward: false,
    }))
  }
  const contextValue: NavigationContextType = {
    navigationState,
    goBack,
    goForward,
    goHome,
    goToModule,
    goToLesson,
    goToLessonContent,
    goToLogin,
    navigateWithBreadcrumb,
    clearHistory,
    buildBreadcrumbs,
  }

  return (
    <NavigationContext.Provider value={contextValue}>
      {children}
    </NavigationContext.Provider>
  )
}
