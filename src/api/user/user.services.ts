import { keepPreviousData, useQuery } from '@tanstack/react-query'
import { userQuery } from './user.queries'

export const useCurrentUser = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: userQuery,
    retry: false,
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 60,
    placeholderData: keepPreviousData,
  })
}
