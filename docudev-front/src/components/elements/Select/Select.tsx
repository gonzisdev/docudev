import { Option } from 'models/Common'
import { FocusEvent, forwardRef } from 'react'
import ReactSelect, {
	GroupBase,
	SelectInstance,
	components,
	Props as ReactSelectProps,
	DropdownIndicatorProps
} from 'react-select'
import { CaretDownIcon } from 'assets/svgs'
import './Select.css'

interface Props
	extends Omit<ReactSelectProps<Option, false, GroupBase<Option>>, 'onChange' | 'value'> {
	id: string
	value: string
	options: Option[]
	hasError?: boolean
	placeholder?: string
	className?: string
	variant?: 'rounded' | 'default'
	disabled?: boolean
	isSearchable?: boolean
	onChange: (value: string) => void
	onBlur?: (e: FocusEvent<HTMLElement>) => void
}

const Select = forwardRef<SelectInstance<Option, false>, Props>(
	(
		{
			id,
			value,
			options,
			hasError = false,
			placeholder,
			className,
			variant = 'default',
			onChange,
			onBlur,
			disabled,
			isSearchable = true
		},
		ref
	) => {
		const classNames = () => {
			let classes = 'select-container'
			if (className) classes += ` ${className}`
			if (variant === 'rounded') classes += ' rounded'
			if (hasError) classes += ' error'
			return classes
		}

		const DropdownIndicator: React.FC<DropdownIndicatorProps<Option, false, GroupBase<Option>>> = (
			props
		) => {
			return (
				<components.DropdownIndicator {...props}>
					<CaretDownIcon />
				</components.DropdownIndicator>
			)
		}

		return (
			<ReactSelect
				ref={ref}
				className={classNames()}
				classNamePrefix='select'
				id={id}
				name={id}
				value={options.find((option) => option.value === value)}
				onChange={(option) => onChange(option?.value || '')}
				onBlur={onBlur}
				options={options}
				placeholder={placeholder}
				isDisabled={disabled}
				isSearchable={isSearchable}
				components={{
					DropdownIndicator,
					IndicatorSeparator: () => null
				}}
			/>
		)
	}
)

export default Select
