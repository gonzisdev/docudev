import { ChangeEvent, FocusEvent } from 'react'
import { Option } from 'models/Common'
import './RadioButtons.css'

interface Props {
	id: string
	options: Option[]
	value: string
	hasError?: boolean
	readOnly?: boolean
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	onBlur?: (e: FocusEvent<HTMLInputElement>) => void
}

const RadioButtons = ({
	id,
	options,
	value,
	hasError = false,
	readOnly = false,
	onChange,
	onBlur
}: Props) => {
	const classNames = () => {
		let classes = 'radio-button-container'
		if (hasError) classes += ' error'

		return classes
	}

	return (
		<div className='radio-button-wrapper'>
			{options.map((option) => (
				<label htmlFor={`${id}-${option.value}`} className={classNames()} key={option.value}>
					{option.label}
					<input
						type='radio'
						id={`${id}-${option.value}`}
						value={option.value}
						checked={value === option.value}
						onChange={onChange}
						readOnly={readOnly}
						onBlur={onBlur}
					/>
				</label>
			))}
		</div>
	)
}

export default RadioButtons
