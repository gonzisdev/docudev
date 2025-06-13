import { useState, useEffect, useMemo, useCallback } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { useAuthStore } from 'stores/authStore'
import { CREATE_DOCU_URL, EDIT_DOCU_URL } from 'constants/routes'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import useTeams from 'hooks/useTeams'
import useDocus from 'hooks/useDocus'
import useDocu from 'hooks/useDocu'
import Button from 'components/elements/Button/Button'
import Header from 'components/elements/Header/Header'
import Container from 'components/elements/Container/Container'
import Loading from 'components/elements/Loading/Loading'
import Card from 'components/elements/Card/Card'
import DocuCard from './DocuCard/DocuCard'
import Pagination from 'components/elements/Pagination/Pagination'
import Input from 'components/elements/Input/Input'
import Select from 'components/elements/Select/Select'
import DeleteDocuModal from './Modals/DeleteDocuModal'
import { getSortOptions, getUniqueOwners } from 'utils/filters'
import { EditIcon, TrashIcon } from 'assets/svgs'
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
	const { user } = useAuthStore()
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

	const sortOptions = getSortOptions(t)
	const uniqueUsers = useMemo(() => getUniqueOwners(docus), [docus])

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

	return (
		<DashboardLayout>
			{isLoadingDocus || isLoadingTeams ? (
				<Loading />
			) : (
				<>
					<Header title={t('docus.title')}>
						{' '}
						<Button variant='secondary' onClick={() => navigate(CREATE_DOCU_URL)}>
							{t('docus.create_docu')}
						</Button>
					</Header>
					<Container subtitle={t('docus.subtitle')}>
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
								<SwipeableList
									type={ListType.IOS}
									fullSwipe={true}
									threshold={0.3}
									className='docus-swipeable-list'>
									{docus.map((docu) => (
										<SwipeableListItem
											key={docu._id}
											leadingActions={leadingActions(docu._id)}
											trailingActions={docu.owner._id === user?._id && trailingActions(docu._id)}
											onSwipeStart={() => setIsSwiping(true)}
											onSwipeEnd={() => setIsSwiping(false)}>
											<DocuCard docu={docu} />
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
					</Container>
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
