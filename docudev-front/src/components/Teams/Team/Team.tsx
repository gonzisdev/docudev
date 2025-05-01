import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { CREATE_DOCU_URL, DOCU_URL, EDIT_DOCU_URL, TEAMS_URL } from 'constants/routes'
import { DocuOwner } from 'models/Docu'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import useTeam from 'hooks/useTeam'
import useDocu from 'hooks/useDocu'
import Button from 'components/elements/Button/Button'
import Header from 'components/elements/Header/Header'
import Loading from 'components/elements/Loading/Loading'
import Card from 'components/elements/Card/Card'
import Pagination from 'components/elements/Pagination/Pagination'
import Input from 'components/elements/Input/Input'
import Select from 'components/elements/Select/Select'
import DeleteDocuModal from 'components/Docus/Modals/DeleteDocuModal'
import { EditIcon, TrashIcon, TwoArrowsIcon } from 'assets/svgs'
import { formatDateWithTime } from 'utils/dates'
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

const Team = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { teamId } = useParams()

	const {
		team,
		isLoadingTeam,
		errorTeam,
		teamDocus,
		pagination,
		isLoadingTeamDocus,
		filters: { searchTerm, setSearchTerm, ownerFilter, setOwnerFilter, sortOption, setSortOption },
		handlePageChange
	} = useTeam({ teamId })
	const [isSwiping, setIsSwiping] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [docuToDelete, setDocuToDelete] = useState<string | undefined>(undefined)
	const [inputSearchValue, setInputSearchValue] = useState(searchTerm)

	const { deleteDocu, isDeletingDocu } = useDocu(docuToDelete ? { docuId: docuToDelete } : {})

	const sortOptions = [
		{ value: 'title_asc', label: t('docus.sort_title_asc') },
		{ value: 'title_desc', label: t('docus.sort_title_desc') },
		{ value: 'created_asc', label: t('docus.sort_created_asc') },
		{ value: 'created_desc', label: t('docus.sort_created_desc') },
		{ value: 'updated_asc', label: t('docus.sort_updated_asc') },
		{ value: 'updated_desc', label: t('docus.sort_updated_desc') }
	]

	const uniqueUsers = useMemo(() => {
		if (!teamDocus) return []
		const userMap = new Map<string, DocuOwner>()
		teamDocus.forEach((docu) => {
			if (docu.owner && docu.owner._id) {
				userMap.set(docu.owner._id, docu.owner)
			}
		})
		return Array.from(userMap.values())
	}, [teamDocus])

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
			await deleteDocu({ docuId: docuToDelete })
			closeDeleteModal()
		}
	}

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
					<div className='team-header'>
						<Header title={team?.name} />
						<Button
							variant='secondary'
							className='team-create-button'
							onClick={() => navigate(CREATE_DOCU_URL)}
							//TODO: disabled={DOCS USER LIMIT}
						>
							{t('docus.create_docu')}
						</Button>
					</div>

					<div className='team-container'>
						<h2>{team?.description}</h2>
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
								<SwipeableList type={ListType.IOS} fullSwipe={true} threshold={0.3}>
									{teamDocus.map((docu) => (
										<SwipeableListItem
											key={docu._id}
											leadingActions={leadingActions(docu._id)}
											trailingActions={trailingActions(docu._id)}
											onSwipeStart={() => setIsSwiping(true)}
											onSwipeEnd={() => setIsSwiping(false)}>
											<Card className='docu-card'>
												<div className='docu-card-content'>
													<span
														className='docu-card-name'
														onClick={() => navigate(`${DOCU_URL}/${docu._id}`)}>
														{docu.title}
													</span>
													<div className='docu-card-details'>
														<div className='docu-card-info'>
															<div className='docu-card-left'>
																<span>
																	<span>{t('docus.owner')}:</span> {docu.owner.name}{' '}
																	{docu.owner.surname}
																</span>
																{docu.team && (
																	<span>
																		<span>{t('docus.team')}:</span>{' '}
																		<span className='team-tag'>{team?.name}</span>
																	</span>
																)}
															</div>
															<div className='docu-card-right'>
																<span>
																	<span>{t('docus.created')}:</span>{' '}
																	{formatDateWithTime(docu.createdAt)}
																</span>
																<span>
																	<span>{t('docus.updated')}:</span>{' '}
																	{formatDateWithTime(docu.updatedAt)}
																</span>
															</div>
														</div>
													</div>
												</div>
												<TwoArrowsIcon className='docu-card-swipe-hint' />
											</Card>
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
					</div>
				</>
			)}
			<DeleteDocuModal
				isVisible={isDeleteModalOpen}
				toggleVisibility={closeDeleteModal}
				onConfirm={handleDeleteDocu}
				isLoading={isDeletingDocu}
			/>
		</DashboardLayout>
	)
}

export default Team
