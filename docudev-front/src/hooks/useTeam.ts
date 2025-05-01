import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { teamDocusQueryKey, teamQueryKey, teamsQueryKey } from 'constants/queryKeys'
import { Team, TeamFormPayload } from 'models/Team'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getDocusService } from 'services/docu'
import {
	createTeamService,
	deleteTeamService,
	getTeamService,
	updateTeamService
} from 'services/team'
import { toast } from 'sonner'

interface Props {
	teamId?: Team['_id']
	params?: {
		initialPage?: number
		limit?: number
	}
}

const useTeam = ({ teamId, params }: Props) => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	const [page, setPage] = useState(params?.initialPage || 1)
	const [searchTerm, setSearchTerm] = useState('')
	const [ownerFilter, setOwnerFilter] = useState<string>('')
	const [sortOption, setSortOption] = useState<string>('')

	const {
		data: team,
		isLoading: isLoadingTeam,
		error: errorTeam
	} = useQuery({
		queryKey: [teamQueryKey, teamId],
		queryFn: () => getTeamService(teamId!),
		enabled: !!teamId,
		refetchOnWindowFocus: 'always',
		retry: false
	})

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
		limit: params?.limit || 10,
		search: searchTerm,
		teamId,
		ownerId: ownerFilter || undefined,
		...getSortParams()
	}

	const { data: teamDocus, isLoading: isLoadingTeamDocus } = useQuery({
		queryKey: [teamDocusQueryKey, queryParams],
		queryFn: () => getDocusService(queryParams),
		refetchOnWindowFocus: 'always'
	})

	const handlePageChange = (selectedPage: { selected: number }) => {
		setPage(selectedPage.selected + 1)
	}

	const { mutateAsync: createTeam, isPending: isCreatingTeam } = useMutation({
		mutationFn: createTeamService,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [teamsQueryKey]
			})
			toast.success(t('teams.toast.success_title'), {
				description: t('teams.toast.success_description')
			})
		},
		onError: () => {
			toast.error(t('teams.toast.error_title'), {
				description: t('teams.toast.error_description')
			})
		}
	})

	const { mutateAsync: updateTeam, isPending: isUpdatingTeam } = useMutation({
		mutationFn: ({ teamId, data }: { teamId: Team['_id']; data: TeamFormPayload }) =>
			updateTeamService(teamId, data),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [teamsQueryKey]
			})
			queryClient.invalidateQueries({
				queryKey: [teamQueryKey, teamId]
			})
			toast.success(t('teams.toast.success_update_title'), {
				description: t('teams.toast.success_update_description')
			})
		},
		onError: () => {
			toast.error(t('teams.toast.error_update_title'), {
				description: t('teams.toast.error_update_description')
			})
		}
	})

	const { mutateAsync: deleteTeam, isPending: isDeletingTeam } = useMutation({
		mutationFn: ({ teamId }: { teamId: Team['_id'] }) => deleteTeamService(teamId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [teamsQueryKey]
			})
			queryClient.invalidateQueries({
				queryKey: [teamQueryKey, teamId]
			})
			toast.success(t('teams.toast.success_delete_title'), {
				description: t('teams.toast.success_delete_description')
			})
		},
		onError: () => {
			toast.error(t('teams.toast.error_delete_title'), {
				description: t('teams.toast.error_delete_description')
			})
		}
	})

	return {
		team,
		isLoadingTeam,
		errorTeam,
		createTeam,
		isCreatingTeam,
		updateTeam,
		isUpdatingTeam,
		deleteTeam,
		isDeletingTeam,
		teamDocus: teamDocus?.data || [],
		pagination: teamDocus?.pagination || { page: 1, pages: 1, total: 0, limit: 10 },
		isLoadingTeamDocus,
		filters: {
			searchTerm,
			setSearchTerm,
			ownerFilter,
			setOwnerFilter,
			sortOption,
			setSortOption
		},
		page,
		handlePageChange
	}
}

export default useTeam
