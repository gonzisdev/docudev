import { useState, useEffect } from 'react'
import { ADMIN_TEAM_LIMIT } from 'constants/limits'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Header from 'components/elements/Header/Header'
import Button from 'components/elements/Button/Button'
import TeamFormModal from './Modals/TeamFormModal'
import TeamDeleteModal from './Modals/TeamDeleteModal'
import Loading from 'components/elements/Loading/Loading'
import Card from 'components/elements/Card/Card'
import Warning from 'components/elements/Warning/Warning'
import useTeams from 'hooks/useTeams'
import useTeam from 'hooks/useTeam'
import { EditIcon, TrashIcon, TwoArrowsIcon } from 'assets/svgs'
import { useAuthStore } from 'stores/authStore'
import { Team, TeamFormPayload } from 'models/Team'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import {
	SwipeableList,
	SwipeableListItem,
	SwipeAction,
	TrailingActions,
	Type as ListType,
	LeadingActions
} from 'react-swipeable-list'
import 'react-swipeable-list/dist/styles.css'
import './Teams.css'

const Teams = () => {
	const { t } = useTranslation()
	const { teams, isLoadingTeams } = useTeams()
	const { user } = useAuthStore()

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isEditing, setIsEditing] = useState(false)
	const [selectedTeamId, setSelectedTeamId] = useState<Team['_id'] | undefined>(undefined)

	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [teamToDelete, setTeamToDelete] = useState<Team['_id'] | undefined>(undefined)

	const [isSwiping, setIsSwiping] = useState(false)

	const {
		team,
		isLoadingTeam,
		createTeam,
		isCreatingTeam,
		updateTeam,
		isUpdatingTeam,
		deleteTeam,
		isDeletingTeam
	} = useTeam({
		teamId: selectedTeamId
	})

	const ownedTeams = teams?.filter((team) => team.owner === user?._id).length || 0

	const validationSchema = z.object({
		name: z
			.string()
			.min(1, t('teams.validations.name.required'))
			.min(2, t('teams.validations.name.min_length')),
		description: z
			.string()
			.min(1, t('teams.validations.description.required'))
			.min(5, t('teams.validations.description.min_length'))
			.max(120, t('teams.validations.description.max_length'))
	})

	const methods = useForm<TeamFormPayload>({
		defaultValues: {
			name: '',
			description: ''
		},
		resolver: zodResolver(validationSchema)
	})

	const handleSubmit = async (data: TeamFormPayload) => {
		if (isEditing && selectedTeamId) {
			await updateTeam({ teamId: selectedTeamId, data })
		} else {
			await createTeam(data)
		}
		closeModal()
	}

	const openCreateModal = () => {
		setIsEditing(false)
		setSelectedTeamId(undefined)
		setIsModalOpen(true)
	}

	const openEditModal = (teamId: string) => {
		setIsEditing(true)
		setSelectedTeamId(teamId)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setSelectedTeamId(undefined)
		setIsEditing(false)
		methods.reset({
			name: '',
			description: ''
		})
	}

	const openDeleteModal = (teamId: string) => {
		setTeamToDelete(teamId)
		setIsDeleteModalOpen(true)
	}

	const closeDeleteModal = () => {
		setTeamToDelete(undefined)
		setIsDeleteModalOpen(false)
	}

	const handleDeleteTeam = async () => {
		if (teamToDelete) {
			await deleteTeam({ teamId: teamToDelete })
			closeDeleteModal()
		}
	}

	const leadingActions = (teamId: Team['_id']) => (
		<LeadingActions>
			<SwipeAction onClick={() => openEditModal(teamId)}>
				<div className='swipe-action edit-action'>
					<EditIcon className='edit-icon' />
				</div>
			</SwipeAction>
		</LeadingActions>
	)

	const trailingActions = (teamId: Team['_id']) => (
		<TrailingActions>
			<SwipeAction onClick={() => openDeleteModal(teamId)}>
				<div className='swipe-action delete-action'>
					<TrashIcon className='trash-icon' />
				</div>
			</SwipeAction>
		</TrailingActions>
	)

	useEffect(() => {
		isSwiping ? document.body.classList.add('swiping') : document.body.classList.remove('swiping')
		return () => {
			document.body.classList.remove('swiping')
		}
	}, [isSwiping])

	useEffect(() => {
		if (isEditing && team) {
			methods.reset({
				name: team.name,
				description: team.description
			})
		}
	}, [team, isEditing])

	return (
		<DashboardLayout>
			{isLoadingTeams ? (
				<Loading />
			) : (
				<>
					<div className='teams-header'>
						<Header title={t('teams.title')} />
						<Button
							variant='secondary'
							className='teams-create-button'
							onClick={openCreateModal}
							disabled={user?.role !== 'admin' || ownedTeams == ADMIN_TEAM_LIMIT}>
							{user?.role !== 'admin'
								? t('teams.create_team_disabled')
								: ownedTeams >= ADMIN_TEAM_LIMIT
									? t('teams.create_team_disabled_limit_reached')
									: t('teams.create_team')}
						</Button>
					</div>
					<div className='teams-container'>
						<h2>{t('teams.subtitle')}</h2>
						{user?.role !== 'admin' && (
							<Warning
								title={t('teams.warning.warning_title')}
								description={t('teams.warning.warning_description')}
							/>
						)}
						{ownedTeams >= ADMIN_TEAM_LIMIT && (
							<Warning
								title={t('teams.warning.warning_title_limit')}
								description={t('teams.warning.warning_description_limit')}
							/>
						)}
						<div className='teams-grid'>
							<div className='user-owned-teams'>
								<h3>{t('teams.my_teams_subtitle')}</h3>
								{teams && teams.filter((team) => team.owner === user?._id).length > 0 ? (
									<SwipeableList type={ListType.IOS} fullSwipe={true} threshold={0.3}>
										{teams
											.filter((team) => team.owner === user?._id)
											.map((team) => (
												<SwipeableListItem
													key={team._id}
													leadingActions={user?.role === 'admin' && leadingActions(team._id)}
													trailingActions={user?.role === 'admin' && trailingActions(team._id)}
													onSwipeStart={() => setIsSwiping(true)}
													onSwipeEnd={() => setIsSwiping(false)}>
													<Card className='team-card'>
														<div className='team-card-content'>
															<span className='team-card-name'>{team.name}</span>
															<span className='team-card-description'>{team.description}</span>
														</div>
														{user?.role === 'admin' && (
															<TwoArrowsIcon className='team-card-swipe-hint' />
														)}
													</Card>
												</SwipeableListItem>
											))}
										{teams
											.filter((team) => team.owner === user?._id)
											.map((team) => (
												<SwipeableListItem
													key={team._id}
													leadingActions={user?.role === 'admin' && leadingActions(team._id)}
													trailingActions={user?.role === 'admin' && trailingActions(team._id)}
													onSwipeStart={() => setIsSwiping(true)}
													onSwipeEnd={() => setIsSwiping(false)}>
													<Card className='team-card'>
														<div className='team-card-content'>
															<span className='team-card-name'>{team.name}</span>
															<span className='team-card-description'>{team.description}</span>
														</div>
														{user?.role === 'admin' && (
															<TwoArrowsIcon className='team-card-swipe-hint' />
														)}
													</Card>
												</SwipeableListItem>
											))}
									</SwipeableList>
								) : (
									<Card empty>{t('teams.no_owned_teams')}</Card>
								)}
							</div>
							<div className='collaborative-teams'>
								<h3>{t('teams.collaborative_teams_subtitle')}</h3>
								{teams && teams.filter((team) => team.owner !== user?._id).length > 0 ? (
									<SwipeableList type={ListType.IOS} fullSwipe={true} threshold={0.5}>
										{teams
											?.filter((team) => team.owner !== user?._id)
											.map((team) => (
												<SwipeableListItem
													key={team._id}
													onSwipeStart={() => setIsSwiping(true)}
													onSwipeEnd={() => setIsSwiping(false)}>
													<Card className='team-card'>
														<div className='team-card-content'>
															<span className='team-card-name'>{team.name}</span>
															<span className='team-card-description'>{team.description}</span>
														</div>
													</Card>
												</SwipeableListItem>
											))}
									</SwipeableList>
								) : (
									<Card empty>{t('teams.no_collaborative_teams')}</Card>
								)}
							</div>
						</div>
					</div>
				</>
			)}
			<TeamFormModal
				isVisible={isModalOpen}
				toggleVisibility={closeModal}
				methods={methods}
				isEditing={isEditing}
				isLoadingTeam={isLoadingTeam}
				isSubmitting={isCreatingTeam || isUpdatingTeam}
				onSubmit={handleSubmit}
			/>
			<TeamDeleteModal
				isVisible={isDeleteModalOpen}
				toggleVisibility={closeDeleteModal}
				onConfirm={handleDeleteTeam}
				isLoading={isDeletingTeam}
			/>
		</DashboardLayout>
	)
}

export default Teams
