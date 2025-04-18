import { useQuery } from '@tanstack/react-query'
import { useAuthStore } from '../stores/authStore'
import { userQueryKey } from 'constants/queryKeys'

export function useUser() {
	const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
	const refreshUser = useAuthStore((state) => state.refreshUser)

	return useQuery({
		queryKey: [userQueryKey],
		queryFn: () => refreshUser(),
		enabled: isAuthenticated,
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 5 * 60 * 1000, // 5 minutes
		refetchOnWindowFocus: 'always'
	})
}
