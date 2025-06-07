import { RowSelectionState, Table } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import { CaretDoubleRightIcon, CaretRightIcon } from 'assets/svgs'
import './Pagination.css'
import Select from 'components/elements/Select/Select'

interface Props<T> {
	table: Table<T>
	rowSelection: RowSelectionState
	hidePagination?: boolean
}

const TablePagination = <T,>({ table, rowSelection, hidePagination = false }: Props<T>) => {
	const { t } = useTranslation()
	const pageSizeOptions = [10, 20, 30, 40, 50].map((pageSize) => ({
		value: String(pageSize),
		label: t('table.show_rows', { count: pageSize })
	}))

	return (
		<div className='pagination-container-table'>
			<p className='pagination-rows-info'>
				{t('table.row_selection', {
					count: Object.keys(rowSelection).length,
					total: table.getPreFilteredRowModel().rows.length
				})}
			</p>
			{!hidePagination && (
				<>
					<Select
						id='pagination-size'
						value={String(table.getState().pagination.pageSize)}
						options={pageSizeOptions}
						onChange={(value) => table.setPageSize(Number(value))}
						disabled={false}
						hasError={false}
						placeholder={t('table.show_rows', { count: table.getState().pagination.pageSize })}
						isSearchable={false}
					/>
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
				</>
			)}
		</div>
	)
}

export default TablePagination
