import { useQuery } from '@tanstack/react-query'
import { teamsQueryKey } from 'constants/queryKeys'
import { getTeamsService } from 'services/team'

const useTeam = () => {
	const { data: teams, isLoading: isLoadingTeams } = useQuery({
		queryKey: [teamsQueryKey],
		queryFn: getTeamsService,
		refetchOnWindowFocus: 'always'
	})

	return {
		teams,
		isLoadingTeams
	}
}

export default useTeam
