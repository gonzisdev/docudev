import { compareItems, rankItem } from '@tanstack/match-sorter-utils'
import { FilterFn, Row, SortingFn, sortingFns } from '@tanstack/react-table'

// Define a custom fuzzy filter function that will apply ranking info to rows (using match-sorter utils)
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fuzzyFilter: FilterFn<any> = (row, columnId, value, addMeta) => {
	// Rank the item
	const itemRank = rankItem(row.getValue(columnId), value)

	// Store the itemRank info
	addMeta({
		itemRank
	})

	// Return if the item should be filtered in/out
	return itemRank.passed
}

// Define a custom fuzzy sort function that will sort by rank if the row has ranking information
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const fuzzySort: SortingFn<any> = (rowA, rowB, columnId) => {
	let dir = 0

	// Only sort by rank if the column has ranking information
	const rankA = rowA.columnFiltersMeta[columnId]?.itemRank
	const rankB = rowB.columnFiltersMeta[columnId]?.itemRank

	if (rankA !== undefined && rankB !== undefined) {
		dir = compareItems(rankA, rankB)
	}

	// Provide an alphanumeric fallback for when the item ranks are equal
	return dir === 0 ? sortingFns.alphanumeric(rowA, rowB, columnId) : dir
}

export const dateRangeFilter: FilterFn<unknown> = (row, columnId, value) => {
	const date: [Date | undefined, Date | undefined] = value
	const dateFrom = date[0]
	const dateTo = date[1]

	let rowValue: Date | string = row.getValue(columnId)
	if (!(rowValue instanceof Date)) rowValue = new Date(rowValue)

	if (!dateFrom && !dateTo) return true
	if (!dateFrom && dateTo) return rowValue <= dateTo
	if (!dateTo && dateFrom) return rowValue >= dateFrom

	if (dateFrom && dateTo) return rowValue >= dateFrom && rowValue <= dateTo

	return false
}

export const numericFilter: FilterFn<unknown> = (
	row: Row<unknown>,
	columnId: string,
	filterValue: string | number
): boolean => {
	const cellValue = row.getValue(columnId)
	if (cellValue == null) return false
	const cellValueStr = cellValue.toString()
	const filterValueStr = filterValue.toString()
	return cellValueStr.includes(filterValueStr)
}
