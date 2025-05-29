import { ReactNode } from 'react'

export interface NavigationItem {
    id: string
    text: string
    icon: ReactNode
    path: string
    requiresAuth?: boolean
    requiresRole?: string[]
}

export interface UserNavigationProps {
    currentPath: string
    userRole?: string
}
