import {
    FaUser,
    FaListUl,
    FaPen,
    FaPenNib,
    FaShieldAlt,
    FaBookmark,
} from 'react-icons/fa'
import { NavigationItem } from '../types/navigation.types'

export const userNavigationItems: NavigationItem[] = [
    {
        id: 'profile',
        text: 'My Profile',
        icon: <FaUser />,
    path: '/profile',
        requiresAuth: true,
    },
    {
        id: 'subscriptions',
        text: 'Subscriptions',
        icon: <FaBookmark />,
    path: '/subscriptions',
        requiresAuth: true,
    },
    {
        id: 'data-privacy',
        text: 'Data and Privacy',
        icon: <FaListUl />,
    path: '/profile/data-privacy',
        requiresAuth: true,
    },
    {
        id: 'appearance',
        text: 'Appearance',
        icon: <FaPen />,
    path: '/profile/appearance',
        requiresAuth: true,
    },
    {
        id: 'create-content',
        text: 'Create Content',
        icon: <FaPenNib />,
    path: '/edition/dashboard/',
        requiresAuth: true,
    },
    {
        id: 'admin-panel',
        text: 'Admin Panel',
        icon: <FaShieldAlt />,
    path: '/admin',
        requiresAuth: true,
        requiresRole: ['admin'],
    },
]

export const getVisibleNavigationItems = (
    userRole?: string,
    isAuthenticated: boolean = true
): NavigationItem[] => {
    return userNavigationItems.filter((item) => {
        // Check authentication requirement
        if (item.requiresAuth && !isAuthenticated) {
            return false
        }

        // Check role requirement
        if (item.requiresRole && userRole) {
            return item.requiresRole.includes(userRole.toLowerCase())
        }

        // If no role requirement, show the item
        if (!item.requiresRole) {
            return true
        }

        return false
    })
}
