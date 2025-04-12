import { useEffect, useRef, useState, FocusEvent } from 'react'
import { formatNumber } from '../Form/formUtils'
import './NumberInput.css'

interface Props {
	id: string
	value: number
	placeholder?: string
	leftIcon?: React.ReactNode
	hasError?: boolean
	readOnly?: boolean
	onChange: (value: number) => void
	onBlur?: (e: FocusEvent<HTMLInputElement>) => void
}

const NumberInput = ({
	id,
	value,
	placeholder,
	leftIcon,
	hasError = false,
	readOnly = false,
	onChange,
	onBlur
}: Props) => {
	const [focused, setFocused] = useState(false)
	const inputRef = useRef<HTMLInputElement>(null)
	const [inputValue, setInputValue] = useState<string>(formatNumber(value.toString()))

	useEffect(() => {
		if (!focused) {
			setInputValue(formatNumber(value.toString()))
		}
	}, [value, focused])

	const handleFocus = () => {
		setFocused(true)
		setInputValue(value.toString())
	}

	const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
		setFocused(false)
		setInputValue(formatNumber(value.toString()))
		if (onBlur) onBlur(e)
	}

	const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		const { selectionStart } = e.target
		const rawValue = e.target.value.replace(/,/g, '')
		if (/^-?\d*\.?\d*$/.test(rawValue)) {
			const newValue = parseFloat(rawValue)
			onChange(isNaN(newValue) ? 0 : newValue)
			const formattedValue = formatNumber(rawValue)
			setInputValue(formattedValue)

			if (inputRef.current && selectionStart !== null) {
				const cursorPosition = selectionStart + (formattedValue.length - rawValue.length)
				setTimeout(() => {
					if (inputRef.current) {
						inputRef.current.setSelectionRange(cursorPosition, cursorPosition)
					}
				}, 0)
			}
		}
	}

	const classNames = () => {
		let classes = 'number-input-container'
		if (hasError) classes += ' error'
		return classes
	}

	return (
		<div className={classNames()}>
			{leftIcon && <div className='number-input-icon'>{leftIcon}</div>}
			<input
				ref={inputRef}
				className='number-input'
				id={id}
				name={id}
				type='text'
				value={focused && inputValue === '0' ? '' : inputValue}
				placeholder={placeholder ?? '0.00'}
				onFocus={handleFocus}
				onChange={handleChange}
				onBlur={handleBlur}
				readOnly={readOnly}
				disabled={readOnly}
			/>
		</div>
	)
}

export default NumberInput
