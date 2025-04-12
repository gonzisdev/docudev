import { RowSelectionState, Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { CaretDoubleRightIcon, CaretRightIcon } from 'assets/svgs'
import './Pagination.css'

interface Props<T> {
	table: Table<T>
	rowSelection: RowSelectionState
}

const TablePagination = <T,>({ table, rowSelection }: Props<T>) => {
	const { t } = useTranslation()

	return (
		<div className='pagination-container'>
			<p className='pagination-rows-info'>
				{t('table.row_selection', {
					count: Object.keys(rowSelection).length,
					total: table.getPreFilteredRowModel().rows.length
				})}
			</p>
			<select
				className='pagination-select'
				value={table.getState().pagination.pageSize}
				onChange={(e) => {
					table.setPageSize(Number(e.target.value))
				}}>
				{[10, 20, 30, 40, 50].map((pageSize) => (
					<option key={pageSize} value={pageSize}>
						{t('table.show_rows', { count: pageSize })}
					</option>
				))}
			</select>
			<div className='pagination'>
				<div className='pagination-arrows'>
					<button
						className='pagination-arrow-button'
						onClick={table.firstPage}
						disabled={!table.getCanPreviousPage()}>
						<CaretDoubleRightIcon />
					</button>
					<button
						className='pagination-arrow-button left'
						onClick={table.previousPage}
						disabled={!table.getCanPreviousPage()}>
						<CaretRightIcon />
					</button>
					<button
						className='pagination-arrow-button'
						onClick={table.nextPage}
						disabled={!table.getCanNextPage()}>
						<CaretRightIcon />
					</button>
					<button
						className='pagination-arrow-button right'
						onClick={table.lastPage}
						disabled={!table.getCanNextPage()}>
						<CaretDoubleRightIcon />
					</button>
				</div>
				<p className='pagination-info'>
					{t('table.page_info', {
						page: table.getState().pagination.pageIndex + 1,
						total: table.getPageCount()
					})}
				</p>
			</div>
		</div>
	)
}

export default TablePagination
