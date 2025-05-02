import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { CREATE_DOCU_URL, EDIT_DOCU_URL, TEAMS_URL } from 'constants/routes'
import { useAuthStore } from 'stores/authStore'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import useTeam from 'hooks/useTeam'
import useDocu from 'hooks/useDocu'
import Button from 'components/elements/Button/Button'
import Header from 'components/elements/Header/Header'
import Container from 'components/elements/Container/Container'
import Loading from 'components/elements/Loading/Loading'
import Card from 'components/elements/Card/Card'
import DocuCard from 'components/Docus/DocuCard/DocuCard'
import Pagination from 'components/elements/Pagination/Pagination'
import Input from 'components/elements/Input/Input'
import Select from 'components/elements/Select/Select'
import DeleteDocuModal from 'components/Docus/Modals/DeleteDocuModal'
import { EditIcon, TrashIcon } from 'assets/svgs'
import { formatDateWithTime } from 'utils/dates'
import { getSortOptions, getUniqueOwners } from 'utils/filters'
import { debounce } from 'lodash'
import {
	SwipeableList,
	SwipeableListItem,
	SwipeAction,
	TrailingActions,
	Type as ListType,
	LeadingActions
} from 'react-swipeable-list'
import 'react-swipeable-list/dist/styles.css'
import UserPlaceholder from 'assets/images/user-placeholder.jpg'
import './Team.css'
import TeamInviteCollaboratorModal from '../Modals/TeamInviteCollaboratorModal'
import LeaveTeamModal from '../Modals/LeaveTeamModal'

const Team = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { teamId } = useParams()
	const { user } = useAuthStore()
	const {
		team,
		isLoadingTeam,
		errorTeam,
		teamDocus,
		pagination,
		isLoadingTeamDocus,
		filters: { searchTerm, setSearchTerm, ownerFilter, setOwnerFilter, sortOption, setSortOption },
		leaveTeam,
		isLeavingTeam,
		handlePageChange
	} = useTeam({ teamId })

	const [isSwiping, setIsSwiping] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [isInviteModalOpen, setIsInviteModalOpen] = useState(false)
	const [docuToDelete, setDocuToDelete] = useState<string | undefined>(undefined)
	const [isLeaveModalOpen, setIsLeaveModalOpen] = useState(false)
	const [inputSearchValue, setInputSearchValue] = useState(searchTerm)

	const { deleteDocu, isDeletingDocu } = useDocu(docuToDelete ? { docuId: docuToDelete } : {})

	const sortOptions = getSortOptions(t)
	const uniqueUsers = useMemo(() => getUniqueOwners(teamDocus), [teamDocus])

	const debouncedSearch = useCallback(
		debounce((value: string) => {
			setSearchTerm(value)
		}, 500),
		[setSearchTerm]
	)

	const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const value = e.target.value
		setInputSearchValue(value)
		debouncedSearch(value)
	}
	const handleOwnerFilterChange = (option: string) => setOwnerFilter(option)
	const handleSortChange = (option: string) => setSortOption(option)

	const openDeleteModal = (docuId: string) => {
		setDocuToDelete(docuId)
		setIsDeleteModalOpen(true)
	}
	const closeDeleteModal = () => {
		setDocuToDelete(undefined)
		setIsDeleteModalOpen(false)
	}
	const handleDeleteDocu = async () => {
		if (docuToDelete) {
			await deleteDocu()
			closeDeleteModal()
		}
	}

	const leadingActions = (docuId: string) => (
		<LeadingActions>
			<SwipeAction onClick={() => navigate(`${EDIT_DOCU_URL}/${docuId}`)}>
				<div className='swipe-action edit-action'>
					<EditIcon className='edit-icon' />
				</div>
			</SwipeAction>
		</LeadingActions>
	)

	const trailingActions = (docuId: string) => (
		<TrailingActions>
			<SwipeAction onClick={() => openDeleteModal(docuId)}>
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
		return () => {
			debouncedSearch.cancel()
		}
	}, [debouncedSearch])

	if (errorTeam) return <Navigate to={TEAMS_URL} />

	return (
		<DashboardLayout>
			{isLoadingTeamDocus || isLoadingTeam ? (
				<Loading />
			) : (
				<>
					<Header title={team?.name}>
						<div className='team-header-actions'>
							{typeof team?.owner === 'object' && team?.owner._id === user?._id && (
								<Button
									variant='link'
									onClick={() => setIsInviteModalOpen(true)}
									//TODO: disabled={COLLABORATORS LIMIT}
								>
									{t('team.invite')}
								</Button>
							)}
							{team?.collaborators?.some((c) => typeof c === 'object' && c._id === user?._id) && (
								<Button variant='link' onClick={() => setIsLeaveModalOpen(true)}>
									{t('team.leave_team')}
								</Button>
							)}
							<Button
								variant='secondary'
								onClick={() => navigate(CREATE_DOCU_URL)}
								//TODO: disabled={DOCS USER LIMIT}
							>
								{t('team.create_docu')}
							</Button>
						</div>
					</Header>
					<Container subtitle={team?.description}>
						<div className='team-info'>
							<div className='team-members-layout'>
								<div className='owner-container'>
									<span className='owner-label'>{t('docus.owner')}:</span>
									{typeof team?.owner === 'object' && (
										<span
											className='team-tag owner-tag'
											title={`${team.owner.name} ${team.owner.surname}`}>
											<img
												src={
													team.owner.image
														? `${import.meta.env.VITE_API_URL}/uploads/${team.owner.image}`
														: UserPlaceholder
												}
												alt={`${team.owner.name} ${team.owner.surname}`}
												className='user-avatar'
											/>
											{team.owner.name} {team.owner.surname}
										</span>
									)}
								</div>
								<div className='collaborators-container'>
									<span className='collaborators-label'>{t('team.collaborators')}:</span>
									<div className='collaborators-list'>
										{team?.collaborators && team.collaborators.length > 0 ? (
											team.collaborators.map((collaborator) =>
												typeof collaborator === 'object' ? (
													<span
														key={collaborator._id}
														className='team-tag'
														title={`${collaborator.name} ${collaborator.surname}`}>
														<img
															src={
																collaborator.image
																	? `${import.meta.env.VITE_API_URL}/uploads/${collaborator.image}`
																	: UserPlaceholder
															}
															alt={`${collaborator.name} ${collaborator.surname}`}
															className='user-avatar'
														/>
														{collaborator.name} {collaborator.surname}
													</span>
												) : null
											)
										) : (
											<span className='no-collaborators'>{t('team.no_collaborators')}</span>
										)}
									</div>
								</div>
							</div>
							<div className='team-dates'>
								{team?.createdAt && (
									<span className='date-item'>
										<span className='date-label'>{t('docus.created')}:</span>
										<span className='date-info'>{formatDateWithTime(team.createdAt)}</span>
									</span>
								)}
								{team?.updatedAt && (
									<span className='date-item'>
										<span className='date-label'>{t('docus.updated')}:</span>
										<span className='date-info'>{formatDateWithTime(team.updatedAt)}</span>
									</span>
								)}
							</div>
						</div>
						<div className='team-filters'>
							<Input
								id='search-input'
								type='text'
								placeholder={t('docus.search')}
								value={inputSearchValue}
								onChange={handleSearchChange}
							/>
							<Select
								id='owner-select'
								value={ownerFilter}
								options={uniqueUsers.map((user) => ({
									value: user._id,
									label: `${user.name} ${user.surname}`
								}))}
								placeholder={t('docus.filter_owner')}
								onChange={handleOwnerFilterChange}
								isClearable={true}
								isSearchable={true}
							/>
							<Select
								id='sort-select'
								value={sortOption}
								options={sortOptions}
								placeholder={t('docus.sort')}
								onChange={handleSortChange}
								isClearable={true}
								isSearchable={false}
							/>
						</div>
						{teamDocus && teamDocus.length > 0 ? (
							<>
								<SwipeableList
									type={ListType.IOS}
									fullSwipe={true}
									threshold={0.3}
									className='team-swipeable-list'>
									{teamDocus.map((docu) => (
										<SwipeableListItem
											key={docu._id}
											leadingActions={leadingActions(docu._id)}
											trailingActions={trailingActions(docu._id)}
											onSwipeStart={() => setIsSwiping(true)}
											onSwipeEnd={() => setIsSwiping(false)}>
											<DocuCard docu={docu} teamName={team?.name} />
										</SwipeableListItem>
									))}
								</SwipeableList>
								<Pagination
									pageCount={pagination.pages}
									currentPage={pagination.page - 1}
									onPageChange={handlePageChange}
								/>
							</>
						) : (
							<Card empty>{t('team.no_docus')}</Card>
						)}
					</Container>
				</>
			)}
			<DeleteDocuModal
				isVisible={isDeleteModalOpen}
				toggleVisibility={closeDeleteModal}
				onConfirm={handleDeleteDocu}
				isLoading={isDeletingDocu}
			/>
			<TeamInviteCollaboratorModal
				isVisible={isInviteModalOpen}
				toggleVisibility={() => setIsInviteModalOpen(!isInviteModalOpen)}
				teamId={teamId}
			/>
			<LeaveTeamModal
				isVisible={isLeaveModalOpen}
				toggleVisibility={() => setIsLeaveModalOpen(!isLeaveModalOpen)}
				onConfirm={() => leaveTeam()}
				isLoading={isLeavingTeam}
			/>
		</DashboardLayout>
	)
}

export default Team
