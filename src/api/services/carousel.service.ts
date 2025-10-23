import { Module, getPublicModulesQuery, getModulesByOwnerQuery, getInProgressModulesQuery, getTrendingModulesQuery } from '../module/module.queries'
import { userQuery } from '../user/user.queries'

export interface CarouselData {
    title: string
    modules: Module[]
}

/**
 * Service to fetch carousel data based on carousel type
 */
export class CarouselService {
    /**
     * Get carousel data based on carousel ID
     */
    static async getCarouselData(carouselId: string): Promise<CarouselData> {
        switch (carouselId) {
            case 'trending':
                return this.getTrendingModules()
            case 'featured':
                return this.getFeaturedModules()
            case 'recent':
                return this.getRecentModules()
            case 'continue':
                return this.getContinueModules()
            case 'personal':
            case 'personnal': // Handle typo for backward compatibility
                return this.getPersonalModules()
            case 'unfinished':
                return this.getUnfinishedModules()
            case 'public':
                return this.getPublicModules()
            default:
                return this.getPublicModules()
        }
    }

    /**
     * Get trending modules (most liked in the past week)
     */
    private static async getTrendingModules(): Promise<CarouselData> {
        try {
            const modules = await getTrendingModulesQuery()

            return {
                title: 'Trending This Week',
                modules: modules
            }
        } catch (error) {
            console.error('Error fetching trending modules:', error)
            return { title: 'Trending This Week', modules: [] }
        }
    }

    /**
     * Get featured modules (public modules for now)
     */
    private static async getFeaturedModules(): Promise<CarouselData> {
        try {
            const modules = await getPublicModulesQuery()
            // Sort by most recent and take first 10
            const featuredModules = modules
                .sort((a, b) => new Date(b.dtc || '').getTime() - new Date(a.dtc || '').getTime())
                .slice(0, 10)

            return {
                title: 'Featured Modules',
                modules: featuredModules
            }
        } catch (error) {
            console.error('Error fetching featured modules:', error)
            return { title: 'Featured Modules', modules: [] }
        }
    }

    /**
     * Get recent modules
     */
    private static async getRecentModules(): Promise<CarouselData> {
        try {
            const modules = await getPublicModulesQuery()
            // Sort by date modified, most recent first
            const recentModules = modules
                .sort((a, b) => new Date(b.dtm || '').getTime() - new Date(a.dtm || '').getTime())
                .slice(0, 10)

            return {
                title: 'Recently Updated',
                modules: recentModules
            }
        } catch (error) {
            console.error('Error fetching recent modules:', error)
            return { title: 'Recently Updated', modules: [] }
        }
    }

    /**
     * Get modules to continue (based on user progress)
     */
    private static async getContinueModules(): Promise<CarouselData> {
        try {
            // Get modules user has started but not completed
            const modules = await getInProgressModulesQuery()
            
            // Sort by most recently subscribed (if subscribed_at is available in future)
            // For now, just return the in-progress modules
            return {
                title: 'Continue Learning',
                modules: modules
            }
        } catch (error) {
            console.error('Error fetching continue modules:', error)
            // If user is not authenticated or there's an error, return empty
            return { title: 'Continue Learning', modules: [] }
        }
    }    /**
     * Get personal modules (user's own modules)
     */
    private static async getPersonalModules(): Promise<CarouselData> {
        try {
            // Get current user first
            const currentUser = await userQuery()

            // Fetch modules owned by the current user
            const modules = await getModulesByOwnerQuery(currentUser.id)

            return {
                title: 'Your Modules',
                modules: modules.slice(0, 10)
            }
        } catch (error) {
            console.error('Error fetching personal modules:', error)
            // Fallback to public modules if not authenticated
            try {
                const publicModules = await getPublicModulesQuery()
                return {
                    title: 'Public Modules',
                    modules: publicModules.slice(0, 10)
                }
            } catch (fallbackError) {
                console.error('Error fetching public modules as fallback:', fallbackError)
                return { title: 'Your Modules', modules: [] }
            }
        }
    }

    /**
     * Get unfinished modules (user's modules with incomplete progress)
     */
    private static async getUnfinishedModules(): Promise<CarouselData> {
        try {
            // Get current user first
            const currentUser = await userQuery()

            // Fetch modules owned by the current user
            // In future, this would filter based on completion status
            const modules = await getModulesByOwnerQuery(currentUser.id)

            return {
                title: 'Your Unfinished Modules',
                modules: modules.slice(0, 10)
            }
        } catch (error) {
            console.error('Error fetching unfinished modules:', error)
            return { title: 'Your Unfinished Modules', modules: [] }
        }
    }

    /**
     * Get public modules
     */
    private static async getPublicModules(): Promise<CarouselData> {
        try {
            const modules = await getPublicModulesQuery()

            return {
                title: 'Public Modules',
                modules: modules
            }
        } catch (error) {
            console.error('Error fetching public modules:', error)
            return { title: 'Public Modules', modules: [] }
        }
    }
}
