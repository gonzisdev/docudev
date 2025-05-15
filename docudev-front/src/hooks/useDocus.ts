import { useQuery } from '@tanstack/react-query'
import { docusQueryKey } from 'constants/queryKeys'
import { getDocusService } from 'services/docu'
import { useState } from 'react'

interface Props {
	initialPage?: number
	limit?: number
}

const useDocus = (params?: Props) => {
	const [page, setPage] = useState(params?.initialPage || 1)
	const [searchTerm, setSearchTerm] = useState('')
	const [teamFilter, setTeamFilter] = useState<string>('')
	const [ownerFilter, setOwnerFilter] = useState<string>('')
	const [sortOption, setSortOption] = useState<string>('')

	const getSortParams = () => {
		if (!sortOption) return {}

		const [field, direction] = sortOption.split('_')
		return {
			sortField: field === 'title' ? 'title' : field === 'created' ? 'createdAt' : 'updatedAt',
			sortDirection: direction
		}
	}

	const queryParams = {
		page,
		limit: params?.limit !== undefined ? params.limit : 10,
		search: searchTerm,
		teamId: teamFilter || undefined,
		ownerId: ownerFilter || undefined,
		...getSortParams()
	}

	const { data, isLoading: isLoadingDocus } = useQuery({
		queryKey: [docusQueryKey, queryParams],
		queryFn: () => getDocusService(queryParams),
		refetchOnWindowFocus: 'always'
	})

	const handlePageChange = (selectedPage: { selected: number }) => {
		setPage(selectedPage.selected + 1)
	}

	return {
		docus: data?.data || [],
		pagination: data?.pagination || { page: 1, pages: 1, total: 0, limit: 10 },
		isLoadingDocus,
		filters: {
			searchTerm,
			setSearchTerm,
			teamFilter,
			setTeamFilter,
			ownerFilter,
			setOwnerFilter,
			sortOption,
			setSortOption
		},
		page,
		handlePageChange
	}
}

export default useDocus
