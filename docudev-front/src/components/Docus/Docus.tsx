import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { CREATE_DOCU_URL, DOCU_URL, EDIT_DOCU_URL } from 'constants/routes'
import { DocuOwner } from 'models/Docu'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import useTeams from 'hooks/useTeams'
import useDocus from 'hooks/useDocus'
import useDocu from 'hooks/useDocu'
import Button from 'components/elements/Button/Button'
import Header from 'components/elements/Header/Header'
import Loading from 'components/elements/Loading/Loading'
import Card from 'components/elements/Card/Card'
import Pagination from 'components/elements/Pagination/Pagination'
import Input from 'components/elements/Input/Input'
import Select from 'components/elements/Select/Select'
import DeleteDocuModal from './Modals/DeleteDocuModal'
import { EditIcon, TrashIcon, TwoArrowsIcon } from 'assets/svgs'
import { formatDateWithTime } from 'utils/dates'
import { findTeamName } from 'utils/team'
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
import './Docus.css'

const Docus = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const {
		docus,
		pagination,
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
		handlePageChange
	} = useDocus()

	const { teams, isLoadingTeams } = useTeams()
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
		if (!docus) return []
		const userMap = new Map<string, DocuOwner>()
		docus.forEach((docu) => {
			if (docu.owner && docu.owner._id) {
				userMap.set(docu.owner._id, docu.owner)
			}
		})
		return Array.from(userMap.values())
	}, [docus])

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

	const handleTeamFilterChange = (option: string) => setTeamFilter(option)
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

	return (
		<DashboardLayout>
			{isLoadingDocus || isLoadingTeams ? (
				<Loading />
			) : (
				<>
					<div className='docus-header'>
						<Header title={t('docus.title')} />
						<Button
							variant='secondary'
							className='docus-create-button'
							onClick={() => navigate(CREATE_DOCU_URL)}
							//TODO: disabled={DOCS USER LIMIT}
						>
							{t('docus.create_docu')}
						</Button>
					</div>

					<div className='docus-container'>
						<h2>{t('docus.subtitle')}</h2>
						<div className='docus-filters'>
							<Input
								id='search-input'
								type='text'
								placeholder={t('docus.search')}
								value={inputSearchValue}
								onChange={handleSearchChange}
							/>
							<Select
								id='team-select'
								value={teamFilter}
								options={
									teams?.map((team) => ({
										value: team._id,
										label: team.name
									})) || []
								}
								placeholder={t('docus.filter_team')}
								onChange={handleTeamFilterChange}
								isClearable={true}
								isSearchable={true}
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
						{docus && docus.length > 0 ? (
							<>
								<SwipeableList type={ListType.IOS} fullSwipe={true} threshold={0.3}>
									{docus.map((docu) => (
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
																		<span className='team-tag'>
																			{findTeamName(teams!, docu.team)}
																		</span>
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
							<Card empty>{t('docus.no_docus')}</Card>
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

export default Docus
