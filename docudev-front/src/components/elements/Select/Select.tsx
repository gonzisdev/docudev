import { Option } from 'models/Common'
import { FocusEvent, forwardRef, useEffect, useState } from 'react'
import ReactSelect, {
	GroupBase,
	SelectInstance,
	components,
	Props as ReactSelectProps,
	DropdownIndicatorProps
} from 'react-select'
import { CaretDownIcon } from 'assets/svgs'
import './Select.css'
import { useTranslation } from 'react-i18next'

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
	isClearable?: boolean
	noOptionsMessage?: (obj: { inputValue: string }) => React.ReactNode
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
			isSearchable = true,
			isClearable = false,
			noOptionsMessage
		},
		ref
	) => {
		const { t } = useTranslation()
		const [menuPortalTarget, setMenuPortalTarget] = useState<HTMLElement | null>(null)

		const classNames = () => {
			let classes = 'select-container'
			if (className) classes += ` ${className}`
			if (variant === 'rounded') classes += ' rounded'
			if (hasError) classes += ' error'
			return classes
		}

		const handleNoOptionsMessage = (obj: { inputValue: string }) => {
			if (typeof noOptionsMessage === 'function') {
				return noOptionsMessage(obj)
			}
			if (typeof noOptionsMessage === 'string') {
				return noOptionsMessage
			}
			return t('general.no_options')
		}

		useEffect(() => {
			setMenuPortalTarget(document.body)
		}, [])

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
				isOptionDisabled={(option) => option.isDisabled || false}
				placeholder={placeholder}
				isDisabled={disabled}
				isSearchable={isSearchable}
				isClearable={isClearable}
				menuPortalTarget={menuPortalTarget}
				menuPosition='fixed'
				noOptionsMessage={handleNoOptionsMessage}
				styles={{
					menuPortal: (base) => ({ ...base, zIndex: 9999 })
				}}
				components={{
					DropdownIndicator,
					IndicatorSeparator: () => null
				}}
			/>
		)
	}
)

export default Select
