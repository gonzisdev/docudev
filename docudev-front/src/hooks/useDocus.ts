import { useQuery } from '@tanstack/react-query'
import { docusQueryKey } from 'constants/queryKeys'
import { getDocusService } from 'services/docu'

const useDocus = () => {
	const { data: docus, isLoading: isLoadingDocus } = useQuery({
		queryKey: [docusQueryKey],
		queryFn: () => getDocusService(),
		refetchOnWindowFocus: 'always'
	})

	return {
		docus,
		isLoadingDocus
	}
}

export default useDocus
