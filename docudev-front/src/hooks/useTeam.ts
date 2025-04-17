import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { teamQueryKey, teamsQueryKey } from 'constants/queryKeys'
import { Team, TeamFormPayload } from 'models/Team'
import { useTranslation } from 'react-i18next'
import {
	createTeamService,
	deleteTeamService,
	getTeamService,
	updateTeamService
} from 'services/team'
import { toast } from 'sonner'

interface Props {
	teamId?: Team['_id']
}

const useTeam = ({ teamId }: Props) => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	const { data: team, isLoading: isLoadingTeam } = useQuery({
		queryKey: [teamQueryKey, teamId],
		queryFn: () => getTeamService(teamId!),
		enabled: !!teamId,
		refetchOnWindowFocus: 'always'
	})

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
		createTeam,
		isCreatingTeam,
		updateTeam,
		isUpdatingTeam,
		deleteTeam,
		isDeletingTeam
	}
}

export default useTeam
