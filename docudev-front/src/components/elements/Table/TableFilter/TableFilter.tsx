import { useRef, useState, useEffect } from 'react'
import { Column } from '@tanstack/react-table'
import { useTranslation } from 'react-i18next'
import DebouncedInput from 'components/elements/Table/DebouncedInput/DebouncedInput'
import Select from 'components/elements/Select/Select'
import DateInput from 'components/elements/DateInput/DateInput'
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
	const [resetKey, setResetKey] = useState(0)
	const filterRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (!columnFilterValue) {
			setStartDate('')
			setEndDate('')
		}
	}, [columnFilterValue])

	const resetFilter = () => {
		column.setFilterValue(undefined)
		setStartDate('')
		setEndDate('')
		setResetKey((prev) => prev + 1)
	}

	return (
		<div className='table-filter-container' ref={filterRef}>
			<div className='table-filter-wrapper' onClick={(e) => e.stopPropagation()}>
				{filterType === 'range' ? (
					<div className='table-filter-range'>
						<DebouncedInput
							key={`min-${column.id}-${resetKey}`}
							id={`min-${column.id}`}
							type='number'
							value={(columnFilterValue as [number, number])?.[0] ?? ''}
							onChange={(value) =>
								column.setFilterValue((old: [number, number]) => [value, old?.[1]])
							}
							placeholder={t('table.min')}
						/>
						<DebouncedInput
							key={`max-${column.id}-${resetKey}`}
							id={`max-${column.id}`}
							type='number'
							value={(columnFilterValue as [number, number])?.[1] ?? ''}
							onChange={(value) =>
								column.setFilterValue((old: [number, number]) => [old?.[0], value])
							}
							placeholder={t('table.max')}
						/>
					</div>
				) : filterType === 'select' ? (
					<Select
						key={`select-${column.id}-${resetKey}`}
						id={`select-${column.id}`}
						value={columnFilterValue?.toString() || ''}
						options={filterOptions || []}
						onChange={(value) => column.setFilterValue(value)}
						placeholder={t('table.select')}
						isSearchable={false}
					/>
				) : filterType === 'date' ? (
					<div className='table-filter-range'>
						<DateInput
							key={`start-date-${column.id}-${resetKey}`}
							id={`start-date-${column.id}`}
							type='date'
							value={startDate}
							onChange={(date) => {
								setStartDate(date)
								const startDateValue = date ? new Date(date) : undefined
								const endDateValue = endDate ? new Date(endDate) : undefined
								column.setFilterValue([startDateValue, endDateValue])
							}}
							placeholderText={t('table.start_date')}
						/>
						<DateInput
							key={`end-date-${column.id}-${resetKey}`}
							id={`end-date-${column.id}`}
							type='date'
							value={endDate}
							onChange={(date) => {
								setEndDate(date)
								const startDateValue = startDate ? new Date(startDate) : undefined
								const endDateValue = date ? new Date(date) : undefined
								column.setFilterValue([startDateValue, endDateValue])
							}}
							placeholderText={t('table.end_date')}
						/>
					</div>
				) : (
					<DebouncedInput
						key={`filter-${column.id}-${resetKey}`}
						id={`filter-${column.id}`}
						type='text'
						value={(columnFilterValue ?? '') as string}
						onChange={(value) => column.setFilterValue(value)}
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
