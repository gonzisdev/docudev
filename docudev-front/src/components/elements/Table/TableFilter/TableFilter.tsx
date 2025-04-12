import { useRef, useState } from 'react'
import { Column } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import DebouncedInput from 'components/elements/Table/DebouncedInput/DebouncedInput'
import './TableFilter.css'

interface Props<T> {
	column: Column<T>
}

const TableFilter = <T,>({ column }: Props<T>) => {
	const { t } = useTranslation()

	const columnFilterValue = column.getFilterValue()
	const { filterType, filterOptions } = column.columnDef.meta ?? {}

	const [startDate, setStartDate] = useState('')
	const [endDate, setEndDate] = useState('')
	const filterRef = useRef<HTMLDivElement>(null)

	const resetFilter = () => {
		column.setFilterValue(undefined)
		setStartDate('')
		setEndDate('')
	}

	return (
		<div className='table-filter-container' ref={filterRef}>
			<div className='table-filter-wrapper' onClick={(e) => e.stopPropagation()}>
				{filterType === 'range' ? (
					<div className='table-filter-range'>
						<DebouncedInput
							type='number'
							className='table-filter numeric'
							value={(columnFilterValue as [number, number])?.[0] ?? ''}
							onChange={(value) =>
								column.setFilterValue((old: [number, number]) => [value, old?.[1]])
							}
							placeholder={t('table.min')}
						/>
						<DebouncedInput
							type='number'
							className='table-filter numeric'
							value={(columnFilterValue as [number, number])?.[1] ?? ''}
							onChange={(value) =>
								column.setFilterValue((old: [number, number]) => [old?.[0], value])
							}
							placeholder={t('table.max')}
						/>
					</div>
				) : filterType === 'select' ? (
					<select
						className='table-filter'
						onChange={(e) => column.setFilterValue(e.target.value)}
						value={columnFilterValue?.toString()}>
						{filterOptions?.map((option) => (
							<option key={option.value} value={option.value}>
								{option.label}
							</option>
						))}
					</select>
				) : filterType === 'date' ? (
					<div className='table-filter-range'>
						<input
							type='date'
							className='table-filter'
							value={startDate ? startDate : ''}
							onChange={(e) => {
								const { value } = e.target
								const startDateValue = new Date(value)
								const endDateValue = endDate ? new Date(endDate) : undefined
								column.setFilterValue([startDateValue, endDateValue])
								setStartDate(value)
							}}
						/>
						<input
							type='date'
							className='table-filter'
							value={endDate ? endDate : ''}
							onChange={(e) => {
								const { value } = e.target
								const startDateValue = startDate ? new Date(startDate) : undefined
								const endDateValue = new Date(value)
								column.setFilterValue([startDateValue, endDateValue])
								setEndDate(value)
							}}
						/>
					</div>
				) : (
					<DebouncedInput
						className='table-filter'
						type='text'
						value={(columnFilterValue ?? '') as string}
						onChange={column.setFilterValue}
						placeholder={`${t('table.search')}...`}
					/>
				)}
				{!!columnFilterValue ? (
					<button className='table-filter-reset' onClick={resetFilter}>
						{t('table.reset')}
					</button>
				) : (
					<div className='table-filter-reset-empty' />
				)}
			</div>
		</div>
	)
}

export default TableFilter
