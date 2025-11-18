import React from 'react'
import { useUserById } from '../../api/user/user.services'

interface UserDisplayProps {
    userId: number
    fallback?: string
}

const UserDisplay: React.FC<UserDisplayProps> = ({ userId, fallback = "Utilisateur" }) => {
    const { data: user, isLoading } = useUserById(userId)

    if (isLoading) {
        return <span className="text-gray-500">Chargement...</span>
    }

    return (
        <span>
            {user?.pseudo || `${fallback} ${userId}`}
        </span>
    )
}

export default UserDisplay