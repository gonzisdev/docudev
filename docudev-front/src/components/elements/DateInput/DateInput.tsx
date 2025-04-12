import { es } from 'date-fns/locale'
import { format, isValid, parseISO } from 'date-fns'
import { FocusEvent, useEffect, useState } from 'react'
import DatePicker, { registerLocale } from 'react-datepicker'
import 'react-datepicker/dist/react-datepicker.css'
import './DateInput.css'
registerLocale('es', es)

export type dateType = 'date' | 'dateTime' | 'year'

interface Props {
	id: string
	type?: dateType
	value: string
	hasError?: boolean
	onChange: (date: string) => void
	onBlur?: (e: FocusEvent<HTMLInputElement>) => void
	placeholderText?: string
}

const DateInput = ({
	id,
	type = 'date',
	value,
	hasError = false,
	onChange,
	onBlur,
	placeholderText
}: Props) => {
	const [selectedDate, setSelectedDate] = useState<Date | null>(value ? new Date(value) : null)

	useEffect(() => {
		const date = parseISO(value)
		if (isValid(date)) {
			setSelectedDate(date)
		}
	}, [value])

	const handleChange = (date: Date | null) => {
		if (date && isValid(date)) {
			const formattedDate = format(date, dateFormat[type])
			onChange(formattedDate)
		}
		setSelectedDate(date)
	}

	const dateFormat = {
		date: 'dd/MM/yyyy',
		dateTime: 'dd/MM/yyyy HH:mm',
		year: 'yyyy'
	}

	const classNames = () => {
		let classes = 'date-input'
		if (hasError) classes += ' error'
		return classes
	}

	return (
		<DatePicker
			className={classNames()}
			id={id}
			name={id}
			selected={selectedDate}
			onChange={handleChange}
			onBlur={onBlur}
			dateFormat={dateFormat[type]}
			locale='es'
			timeIntervals={15}
			showIcon={false}
			placeholderText={placeholderText}
			showTimeSelect={type === 'dateTime'}
			showYearPicker={type === 'year'}
			showYearDropdown={type === 'date'}
			showMonthDropdown={type === 'date'}
		/>
	)
}

export default DateInput
