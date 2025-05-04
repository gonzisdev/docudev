import { Dispatch, SetStateAction, useEffect, useState } from 'react'
import {
	ColumnDef,
	createColumnHelper,
	FilterFn,
	flexRender,
	getCoreRowModel,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	PaginationState,
	Row,
	RowData,
	RowSelectionState,
	useReactTable
} from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { RankingInfo } from '@tanstack/match-sorter-utils'
import DebouncedInput from 'components/elements/Table/DebouncedInput/DebouncedInput'
import {
	dateRangeFilter,
	fuzzyFilter,
	fuzzySort,
	numericFilter
} from 'components/elements/Table/utils/table-utils'
import { formatDate } from 'utils/dates'
import { FunnelSimpleIcon } from 'assets/svgs'
import TableFilter from 'components/elements/Table/TableFilter/TableFilter'
import Pagination from 'components/elements/Table/Pagination/Pagination'
import TableSelectionCheckbox from 'components/elements/Table/TableSelectionCheckbox/TableSelectionCheckbox'
import Loading from 'components/elements/Loading/Loading'
import './Table.css'
import Button from '../Button/Button'

declare module '@tanstack/react-table' {
	// eslint-disable-next-line @typescript-eslint/no-unused-vars
	interface ColumnMeta<TData extends RowData, TValue> {
		filterType?: 'text' | 'range' | 'select' | 'date' | 'numeric'
		filterOptions?: {
			label: string
			value: string
		}[]
		isFixed?: boolean
	}

	interface FilterFns {
		fuzzy: FilterFn<unknown>
		dateRange: FilterFn<unknown>
		numeric: FilterFn<unknown>
	}

	interface FilterMeta {
		itemRank: RankingInfo
	}
}

// ver problema de tipado en github: https://github.com/TanStack/table/discussions/5218
// eslint-disable-next-line @typescript-eslint/no-explicit-any
type ColumnDefType<T> = ColumnDef<T, any>

interface Props<T> {
	data: T[]
	columns: ColumnDefType<T>[]
	isLoading?: boolean
	enableRowSelection?: boolean
	onChangeRowSelection?: (selectedRows: Row<T>[]) => void
	setIsRemoveCollaboratorModalOpen: Dispatch<SetStateAction<boolean>>
}

const Table = <T,>({
	data,
	columns,
	isLoading = false,
	enableRowSelection = false,
	onChangeRowSelection,
	setIsRemoveCollaboratorModalOpen
}: Props<T>) => {
	const { t } = useTranslation()

	const [pagination, setPagination] = useState<PaginationState>({
		pageIndex: 0,
		pageSize: 10
	})
	const [globalFilter, setGlobalFilter] = useState('')
	const [rowSelection, setRowSelection] = useState<RowSelectionState>({})
	const [isFilterVisible, setIsFilterVisible] = useState(false)

	const [columnsMapped, setColumnsMapped] = useState<ColumnDefType<T>[]>([])

	const table = useReactTable({
		data,
		columns: columnsMapped,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		onPaginationChange: setPagination,
		onRowSelectionChange: setRowSelection,
		onGlobalFilterChange: setGlobalFilter,
		globalFilterFn: 'fuzzy', //apply fuzzy filter to the global filter (most common use case for fuzzy filter)
		enableRowSelection,
		defaultColumn: {
			enableColumnFilter: true,
			enableGlobalFilter: true
		},
		filterFns: {
			fuzzy: fuzzyFilter,
			dateRange: dateRangeFilter,
			numeric: numericFilter
		},
		state: {
			pagination,
			rowSelection,
			globalFilter
		}
	})

	const emptyRows = table.getRowCount() <= 0
	const emptyRowsOrLoading = emptyRows || isLoading
	const filtersActiveCount = table
		.getState()
		.columnFilters.filter((filter) => filter.id !== 'globalFilter').length

	const hasSelectedRows = Object.keys(rowSelection).length > 0

	const addSelectionColumn = (columns: ColumnDefType<T>[]) => {
		const columnHelper = createColumnHelper<T>()
		columns.unshift(
			columnHelper.display({
				id: 'select',
				header: ({ table }) => (
					<TableSelectionCheckbox
						checked={table.getIsAllRowsSelected()}
						indeterminate={table.getIsSomeRowsSelected()}
						onChange={table.getToggleAllRowsSelectedHandler()}
					/>
				),
				cell: ({ row }) => {
					return (
						<TableSelectionCheckbox
							checked={row.getIsSelected()}
							disabled={!row.getCanSelect()}
							indeterminate={row.getIsSomeSelected()}
							onChange={row.getToggleSelectedHandler()}
						/>
					)
				},
				meta: {
					isFixed: true
				}
			})
		)
	}

	useEffect(() => {
		const newColumnsMapped = columns.map((column) => {
			if (column.enableGlobalFilter) {
				column.filterFn = 'fuzzy'
				column.sortingFn = fuzzySort
			} else if (column.enableColumnFilter) {
				column.enableColumnFilter = false
			}
			if (column.meta?.filterType === 'date') {
				column.filterFn = 'dateRange'
				column.cell = (info) => formatDate(info.getValue())
			}
			if (column.meta?.filterType === 'numeric') {
				column.filterFn = 'numeric'
			}
			return column
		})

		if (enableRowSelection) {
			addSelectionColumn(newColumnsMapped)
		}
		setColumnsMapped(newColumnsMapped)
	}, [enableRowSelection, columns])

	useEffect(() => {
		const selectedRows = table.getRowModel().rows.filter((row) => row.getIsSelected())
		onChangeRowSelection && onChangeRowSelection(selectedRows)
	}, [table.getState().rowSelection])

	return (
		<div className='table-and-pagination-wrapper'>
			<div className='table-container'>
				<header className='table-header'>
					<h3>{`${t('table.results')} (${table.getRowCount()})`}</h3>
					<div className='table-search-filters'>
						{hasSelectedRows && (
							<Button
								className='table-action-button danger'
								onClick={() => setIsRemoveCollaboratorModalOpen(true)}>
								{t('table.remove_collaborators')}
							</Button>
						)}
						<DebouncedInput
							type='text'
							placeholder={t('table.search')}
							value={globalFilter ?? ''}
							onChange={(value) => setGlobalFilter(String(value))}
						/>
						<button
							className={`table-filter-button${isFilterVisible ? ' active' : ''}${filtersActiveCount ? '' : ' hide-count'}`}
							data-count={filtersActiveCount}
							onClick={() => setIsFilterVisible(!isFilterVisible)}>
							<FunnelSimpleIcon />
						</button>
					</div>
				</header>
				<div className={`table-overflow-container${emptyRowsOrLoading ? ' empty-rows' : ''}`}>
					<table className='table'>
						<thead>
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										const isFixed = header.column.columnDef.meta?.isFixed
										const isFirstColumn = header.column.getIsFirstColumn()
										const isLastColumn = header.column.getIsLastColumn()
										const canSort = header.column.getCanSort()

										const classnames = () => {
											let classes = ''
											if (canSort) classes += ' sortable'
											if (isFixed && isFirstColumn && !emptyRowsOrLoading) classes += ' fixed-first'
											if (isFixed && isLastColumn && !emptyRowsOrLoading) classes += ' fixed-last'
											return classes
										}

										return (
											<th key={header.id} colSpan={header.colSpan} className={classnames()}>
												<div
													className='th-wrapper'
													onClick={header.column.getToggleSortingHandler()}>
													{flexRender(header.column.columnDef.header, header.getContext())}
													{{
														asc: ' 🔼',
														desc: ' 🔽'
													}[header.column.getIsSorted() as string] ?? null}{' '}
												</div>
											</th>
										)
									})}
								</tr>
							))}
							{table.getHeaderGroups().map((headerGroup) => (
								<tr key={headerGroup.id}>
									{headerGroup.headers.map((header) => {
										const isFixed = header.column.columnDef.meta?.isFixed
										const isFirstColumn = header.column.getIsFirstColumn()
										const isLastColumn = header.column.getIsLastColumn()

										const classnames = () => {
											let classes = 'filter'
											if (isFixed && isFirstColumn && !emptyRowsOrLoading) classes += ' fixed-first'
											if (isFixed && isLastColumn && !emptyRowsOrLoading) classes += ' fixed-last'
											return classes
										}

										return (
											<th key={header.id} colSpan={header.colSpan} className={classnames()}>
												{header.column.getCanFilter() && isFilterVisible ? (
													<TableFilter column={header.column} />
												) : null}
											</th>
										)
									})}
								</tr>
							))}
						</thead>
						<tbody>
							{!emptyRowsOrLoading
								? table.getRowModel().rows.map((row) => {
										return (
											<tr key={row.id}>
												{row.getVisibleCells().map((cell) => {
													const isFixed = cell.column.columnDef.meta?.isFixed
													const isFirstColumn = cell.column.getIsFirstColumn()
													const isLastColumn = cell.column.getIsLastColumn()

													const classnames = () => {
														let classes = ''
														if (isFixed && isFirstColumn) classes += ' fixed-first'
														if (isFixed && isLastColumn) classes += ' fixed-last'
														return classes
													}

													return (
														<td key={cell.id} className={classnames()}>
															{flexRender(cell.column.columnDef.cell, cell.getContext())}
														</td>
													)
												})}
											</tr>
										)
									})
								: null}
						</tbody>
					</table>
				</div>
				{isLoading ? (
					<div className='table-empty'>
						<Loading />
					</div>
				) : emptyRows ? (
					<div className='table-empty'>
						<h2>{t('table.empty_title')}</h2>
						<p>{t('table.empty_description')}</p>
					</div>
				) : null}
			</div>
			<Pagination table={table} rowSelection={rowSelection} />
		</div>
	)
}

export default Table
