import { useState, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { ADMIN_TEAM_LIMIT } from 'constants/limits'
import { useAuthStore } from 'stores/authStore'
import { Team, TeamFormPayload } from 'models/Team'
import useTeams from 'hooks/useTeams'
import useTeam from 'hooks/useTeam'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Header from 'components/elements/Header/Header'
import Container from 'components/elements/Container/Container'
import Button from 'components/elements/Button/Button'
import TeamFormModal from './Modals/TeamFormModal'
import TeamDeleteModal from './Modals/TeamDeleteModal'
import Loading from 'components/elements/Loading/Loading'
import Card from 'components/elements/Card/Card'
import TeamCard from './TeamCard/TeamCard'
import Warning from 'components/elements/Warning/Warning'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import { EditIcon, TrashIcon } from 'assets/svgs'
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
	const [selectedTeamId, setSelectedTeamId] = useState<Team['_id']>('')
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

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
		teamId: selectedTeamId!
	})

	const ownedTeams =
		teams?.filter((team) => typeof team.owner === 'object' && team.owner._id === user?._id)
			.length || 0

	const validationSchema = z.object({
		name: z
			.string()
			.min(1, t('teams.validations.name.required'))
			.min(2, t('teams.validations.name.min_length')),
		description: z
			.string()
			.min(1, t('teams.validations.description.required'))
			.min(5, t('teams.validations.description.min_length'))
			.max(120, t('teams.validations.description.max_length')),
		color: z
			.string()
			.min(1, t('teams.validations.color.required'))
			.regex(/^#[0-9A-F]{6}$/i, t('teams.validations.color.invalid'))
			.max(7, t('teams.validations.color.max_length'))
	})

	const methods = useForm<TeamFormPayload>({
		defaultValues: {
			name: '',
			description: '',
			color: ''
		},
		resolver: zodResolver(validationSchema)
	})

	const handleSubmit = async (data: TeamFormPayload) => {
		if (isEditing && selectedTeamId) {
			await updateTeam(data)
		} else {
			await createTeam(data)
		}
		closeModal()
	}

	const openCreateModal = () => {
		setIsEditing(false)
		setIsModalOpen(true)
	}

	const openEditModal = (teamId: Team['_id']) => {
		setIsEditing(true)
		setSelectedTeamId(teamId)
		setIsModalOpen(true)
	}

	const closeModal = () => {
		setIsModalOpen(false)
		setSelectedTeamId('')
		setIsEditing(false)
		methods.reset({
			name: '',
			description: '',
			color: ''
		})
	}

	const openDeleteModal = (teamId: Team['_id']) => {
		setSelectedTeamId(teamId)
		setIsDeleteModalOpen(true)
	}

	const closeDeleteModal = () => {
		setSelectedTeamId('')
		setIsDeleteModalOpen(false)
	}

	const handleDeleteTeam = async () => {
		if (selectedTeamId) {
			await deleteTeam()
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
				description: team.description,
				color: team.color
			})
		}
	}, [team, isEditing])

	return (
		<DashboardLayout>
			{isLoadingTeams ? (
				<Loading />
			) : (
				<>
					<Header title={t('teams.title')}>
						{' '}
						<Button
							variant='secondary'
							onClick={openCreateModal}
							disabled={user?.role !== 'admin' || ownedTeams == ADMIN_TEAM_LIMIT}>
							{user?.role !== 'admin'
								? t('teams.create_team_disabled')
								: ownedTeams >= ADMIN_TEAM_LIMIT
									? t('teams.create_team_disabled_limit_reached')
									: t('teams.create_team')}
						</Button>
					</Header>
					<Container subtitle={t('teams.subtitle')}>
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
								{teams &&
								teams.filter(
									(team) => typeof team.owner === 'object' && team.owner._id === user?._id
								).length > 0 ? (
									<SwipeableList
										type={ListType.IOS}
										fullSwipe={true}
										threshold={0.3}
										className='teams-swipeable-list'>
										{teams
											.filter(
												(team) => typeof team.owner === 'object' && team.owner._id === user?._id
											)
											.map((team) => (
												<SwipeableListItem
													key={team._id}
													leadingActions={user?.role === 'admin' && leadingActions(team._id)}
													trailingActions={user?.role === 'admin' && trailingActions(team._id)}
													onSwipeStart={() => setIsSwiping(true)}
													onSwipeEnd={() => setIsSwiping(false)}>
													<TeamCard team={team} isAdmin={user?.role === 'admin'} />
												</SwipeableListItem>
											))}
									</SwipeableList>
								) : (
									<Card empty>{t('teams.no_owned_teams')}</Card>
								)}
							</div>
							<div className='collaborative-teams'>
								<h3>{t('teams.collaborative_teams_subtitle')}</h3>
								{teams &&
								teams.filter(
									(team) => typeof team.owner === 'object' && team.owner._id !== user?._id
								).length > 0 ? (
									<SwipeableList
										type={ListType.IOS}
										fullSwipe={true}
										threshold={0.5}
										className='teams-swipeable-list'>
										{teams
											?.filter(
												(team) => typeof team.owner === 'object' && team.owner._id !== user?._id
											)
											.map((team) => (
												<SwipeableListItem
													key={team._id}
													onSwipeStart={() => setIsSwiping(true)}
													onSwipeEnd={() => setIsSwiping(false)}>
													<TeamCard team={team} />
												</SwipeableListItem>
											))}
									</SwipeableList>
								) : (
									<Card empty>{t('teams.no_collaborative_teams')}</Card>
								)}
							</div>
						</div>
					</Container>
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
