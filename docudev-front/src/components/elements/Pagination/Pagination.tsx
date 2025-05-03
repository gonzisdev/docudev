import ReactPaginate from 'react-paginate'
import { useTranslation } from 'react-i18next'
import './Pagination.css'

interface Props {
	pageCount: number
	currentPage: number
	onPageChange: (selectedItem: { selected: number }) => void
	marginPagesDisplayed?: number
	pageRangeDisplayed?: number
}

const Pagination = ({
	pageCount,
	currentPage,
	onPageChange,
	marginPagesDisplayed = 2,
	pageRangeDisplayed = 5
}: Props) => {
	const { t } = useTranslation()

	if (pageCount <= 1) return null

	return (
		<ReactPaginate
			previousLabel={t('pagination.previous')}
			nextLabel={t('pagination.next')}
			breakLabel='...'
			pageCount={pageCount}
			marginPagesDisplayed={marginPagesDisplayed}
			pageRangeDisplayed={pageRangeDisplayed}
			onPageChange={onPageChange}
			containerClassName='pagination-container'
			activeClassName='active'
			previousClassName='pagination-previous'
			nextClassName='pagination-next'
			pageClassName='pagination-page'
			breakClassName='pagination-break'
			forcePage={currentPage}
		/>
	)
}

export default Pagination
