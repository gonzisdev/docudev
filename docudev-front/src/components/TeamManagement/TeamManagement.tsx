import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useAuthStore } from 'stores/authStore'
import { ADMIN_TEAM_LIMIT, TEAM_MEMBER_LIMIT } from 'constants/limits'
import { Team, TeamFormPayload } from 'models/Team'
import { User } from 'models/Auth'
import { Option } from 'models/Common'
import useTeams from 'hooks/useTeams'
import useTeam from 'hooks/useTeam'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Table from 'components/elements/Table/Table'
import TableActionLayout from 'components/elements/Table/TableActionLayout/TableActionLayout'
import Header from 'components/elements/Header/Header'
import Card from 'components/elements/Card/Card'
import Container from 'components/elements/Container/Container'
import Select from 'components/elements/Select/Select'
import Loading from 'components/elements/Loading/Loading'
import Button from 'components/elements/Button/Button'
import Warning from 'components/elements/Warning/Warning'
import TeamFormModal from 'components/Teams/Modals/TeamFormModal'
import TeamDeleteModal from 'components/Teams/Modals/TeamDeleteModal'
import TeamInviteCollaboratorModal from 'components/Teams/Modals/TeamInviteCollaboratorModal'
import TeamRemoveCollaboratorModal from 'components/Teams/Modals/TeamRemoveCollaboratorModal'
import { createColumnHelper } from '@tanstack/react-table'
import { TrashIcon } from 'assets/svgs'
import UserPlaceholder from 'assets/images/user-placeholder.jpg'
import { zodResolver } from '@hookform/resolvers/zod'
import z from 'zod'
import './TeamManagement.css'

const TeamManagement = () => {
	const { t } = useTranslation()

	const [selectedTeamId, setSelectedTeamId] = useState<Team['_id']>('')

	const [teamOptions, setTeamOptions] = useState<Option[]>([])
	const [collaborators, setCollaborators] = useState<User[]>([])
	const [isEditing, setIsEditing] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
	const [isRemoveCollaboratorModalOpen, setIsRemoveCollaboratorModalOpen] = useState(false)
	const [selectedCollaboratorIds, setSelectedCollaboratorIds] = useState<
		User['_id'] | User['_id'][]
	>('')
	const [tableKey, setTableKey] = useState(0)

	const { user } = useAuthStore()

	const { teams, isLoadingTeams } = useTeams()
	const {
		team,
		isLoadingTeam,
		createTeam,
		isCreatingTeam,
		updateTeam,
		isUpdatingTeam,
		deleteTeam,
		isDeletingTeam,
		removeCollaborator,
		isRemovingCollaborator,
		removeCollaborators,
		isRemovingCollaborators
	} = useTeam({ teamId: selectedTeamId })

	const ownedTeams =
		teams?.filter((team) => typeof team.owner === 'object' && team.owner._id === user?._id)
			.length || 0

	const teamMembersCount = (collaborators?.length || 0) + 1

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
			const newTeam = await createTeam(data)
			setSelectedTeamId(newTeam._id)
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
		setIsDeleteModalOpen(false)
	}

	const handleDeleteTeam = async () => {
		if (selectedTeamId) {
			await deleteTeam()
			setSelectedTeamId('')
			closeDeleteModal()
		}
	}

	const handleTeamChange = (value: Team['_id']) => setSelectedTeamId(value)

	const handleRemoveCollaborator = async () => {
		if (selectedCollaboratorIds) {
			if (Array.isArray(selectedCollaboratorIds)) {
				await removeCollaborators(selectedCollaboratorIds as User['_id'][])
				setTableKey((prevKey) => prevKey + 1)
			} else {
				await removeCollaborator(selectedCollaboratorIds as User['_id'])
			}
			setSelectedCollaboratorIds('')
			setIsRemoveCollaboratorModalOpen(false)
		}
	}

	const columnHelper = createColumnHelper<User>()

	const columns = [
		columnHelper.accessor((row) => row, {
			id: 'avatar',
			header: t('team_management.image'),
			cell: (info) => {
				const user = info.getValue()
				return (
					<div className='user-avatar-cell'>
						<img
							src={
								user.image
									? `${import.meta.env.VITE_API_URL}/uploads/${user.image}`
									: UserPlaceholder
							}
							alt={`${user.name} avatar`}
							className='user-avatar'
						/>
					</div>
				)
			}
		}),
		columnHelper.accessor('name', {
			header: t('team_management.name')
		}),
		columnHelper.accessor('surname', {
			header: t('team_management.surname')
		}),
		columnHelper.accessor('email', {
			header: t('team_management.email')
		}),
		columnHelper.accessor('phone', {
			header: t('team_management.phone')
		}),
		columnHelper.accessor('status', {
			header: t('team_management.status'),
			cell: (info) => {
				const status = info.getValue()
				return <div className={`status-tag ${status}`}>{t(`team_management.${status}`)}</div>
			},
			meta: {
				filterType: 'select',
				filterOptions: [
					{ label: t('team_management.all'), value: '' },
					{ label: t('team_management.active'), value: 'active' },
					{ label: t('team_management.inactive'), value: 'inactive' },
					{ label: t('team_management.suspended'), value: 'suspended' }
				]
			}
		}),
		columnHelper.display({
			id: 'actions',
			header: t('team_management.actions'),
			cell: (info) => {
				return (
					<div className='table-actions'>
						<TableActionLayout
							onClick={() => {
								setSelectedCollaboratorIds(info.row.original._id)
								setIsRemoveCollaboratorModalOpen(true)
							}}>
							<TrashIcon className='delete-icon' />
						</TableActionLayout>
					</div>
				)
			},
			meta: {
				isFixed: true
			}
		})
	]

	useEffect(() => {
		if (teams && teams.length > 0) {
			const ownerTeams = teams.filter(
				(team) => typeof team.owner === 'object' && team.owner._id === user?._id
			)
			const options = ownerTeams.map((team) => ({
				value: team._id,
				label: team.name
			}))
			setTeamOptions(options)
			!selectedTeamId && options.length > 0 && setSelectedTeamId(options[0].value)
		}
	}, [teams])

	useEffect(() => {
		team && team.collaborators ? setCollaborators(team.collaborators) : setCollaborators([])
	}, [team])

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
			{isLoadingTeams && isLoadingTeam ? (
				<Loading />
			) : (
				<>
					<Header title={t('team_management.title')}>
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
					<Container subtitle={t('team_management.subtitle')}>
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
						{isLoadingTeams ? null : ownedTeams > 0 ? (
							<div className='team-management-menu'>
								<Select
									id='team-selector'
									value={selectedTeamId}
									options={teamOptions}
									onChange={handleTeamChange}
									placeholder={t('team_management.select_team_placeholder')}
									className='team-select'
									disabled={teamOptions.length === 0}
								/>
								<div className='team-management-actions'>
									<Button
										variant='link'
										onClick={() => setIsInviteModalOpen(true)}
										disabled={teamMembersCount >= TEAM_MEMBER_LIMIT}>
										{t('team.invite')}
									</Button>
									<Button variant='primary' onClick={() => openEditModal(selectedTeamId)}>
										{t('team_management.update_team')}
									</Button>
									<Button variant='danger' onClick={() => openDeleteModal(selectedTeamId)}>
										{t('team_management.delete_team')}
									</Button>
								</div>
							</div>
						) : (
							<Card empty>{t('teams.no_owned_teams')}</Card>
						)}
					</Container>
					{isLoadingTeams
						? null
						: ownedTeams > 0 && (
								<Table
									key={tableKey}
									data={collaborators}
									columns={columns}
									isLoading={isLoadingTeam || isRemovingCollaborator || isRemovingCollaborators}
									setIsRemoveCollaboratorModalOpen={setIsRemoveCollaboratorModalOpen}
									enableRowSelection
									onChangeRowSelection={(rows) =>
										setSelectedCollaboratorIds(rows.map((row) => row.original._id))
									}
									hidePagination
								/>
							)}
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
			<TeamInviteCollaboratorModal
				isVisible={isInviteModalOpen}
				toggleVisibility={() => setIsInviteModalOpen(!isInviteModalOpen)}
				teamId={selectedTeamId}
			/>
			<TeamRemoveCollaboratorModal
				isVisible={isRemoveCollaboratorModalOpen}
				toggleVisibility={() => setIsRemoveCollaboratorModalOpen(false)}
				onConfirm={handleRemoveCollaborator}
				isLoading={isRemovingCollaborators}
			/>
		</DashboardLayout>
	)
}

export default TeamManagement
