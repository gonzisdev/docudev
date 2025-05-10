import { useQuery } from '@tanstack/react-query'
import { statsQueryKey } from 'constants/queryKeys'
import { getUserStats } from 'services/stats'

export function useStats() {
	const { data: stats, isLoading: isLoadingStats } = useQuery({
		queryKey: [statsQueryKey],
		queryFn: () => getUserStats(),
		refetchOnWindowFocus: 'always'
	})

	return {
		stats,
		isLoadingStats
	}
}
