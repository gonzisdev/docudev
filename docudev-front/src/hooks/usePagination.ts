import { useState } from 'react'

interface Props<T> {
	data: T[] | null | undefined
	itemsPerPage: number
	initialPage?: number
}

const usePagination = <T>({ data, itemsPerPage, initialPage = 0 }: Props<T>) => {
	const [currentPage, setCurrentPage] = useState(initialPage)

	const pageCount = data ? Math.ceil(data.length / itemsPerPage) : 0
	const offset = currentPage * itemsPerPage
	const currentItems = data ? data.slice(offset, offset + itemsPerPage) : []

	const handlePageChange = ({ selected }: { selected: number }) => {
		setCurrentPage(selected)
	}

	return {
		currentItems,
		currentPage,
		setCurrentPage,
		pageCount,
		handlePageChange
	}
}

export default usePagination
