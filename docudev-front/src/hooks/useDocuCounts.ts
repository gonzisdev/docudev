import { useQuery } from '@tanstack/react-query'
import { getDocuCountsService } from 'services/docu'
import { docuCountsQueryKey } from 'constants/queryKeys'
import { Team } from 'models/Team'

export const useDocuCounts = (teamId?: Team['_id']) => {
	return useQuery({
		queryKey: [docuCountsQueryKey, teamId],
		queryFn: () => getDocuCountsService(teamId ? teamId : undefined),
		refetchOnWindowFocus: 'always'
	})
}
