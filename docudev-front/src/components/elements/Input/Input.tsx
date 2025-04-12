import { InputType } from 'models/Common'
import { ChangeEvent, FocusEvent, ReactNode, useState, forwardRef } from 'react'
import { EyeIcon, EyeCloseIcon } from 'assets/svgs'
import Button from 'components/elements/Button/Button'
import './Input.css'

export interface BaseProps {
	id: string
	value: string
	placeholder?: string
	leftIcon?: ReactNode
	rightIcon?: ReactNode
	hasError?: boolean
	readOnly?: boolean
	maxLength?: number
}

interface InputProps extends BaseProps {
	type?: InputType
	numberOfLines?: never
	onChange: (e: ChangeEvent<HTMLInputElement>) => void
	onBlur?: (e: FocusEvent<HTMLInputElement>) => void
}

interface TextareaProps extends BaseProps {
	numberOfLines: number
	type?: never
	onChange: (e: ChangeEvent<HTMLTextAreaElement>) => void
	onBlur?: (e: FocusEvent<HTMLTextAreaElement>) => void
}

type Props = InputProps | TextareaProps

type Ref = HTMLInputElement | HTMLTextAreaElement

const Input = forwardRef<Ref, Props>(
	(
		{
			id,
			value,
			type = 'text',
			placeholder,
			leftIcon,
			rightIcon,
			hasError = false,
			readOnly = false,
			numberOfLines,
			maxLength,
			onChange,
			onBlur
		},
		ref
	) => {
		const [showPassword, setShowPassword] = useState(false)

		const classNames = () => {
			let classes = 'input-container'
			if (hasError) classes += ' error'
			if (numberOfLines) classes += ' textarea'
			if (readOnly) classes += ' readonly'

			return classes
		}

		return (
			<div className={classNames()}>
				{leftIcon && <div className='input-icon left'>{leftIcon}</div>}
				{numberOfLines ? (
					<textarea
						className='input'
						ref={ref as React.Ref<HTMLTextAreaElement>}
						id={id}
						name={id}
						value={value}
						placeholder={placeholder}
						onChange={onChange as (e: ChangeEvent<HTMLTextAreaElement>) => void}
						onBlur={onBlur as (e: FocusEvent<HTMLTextAreaElement>) => void}
						readOnly={readOnly}
						disabled={readOnly}
						rows={numberOfLines}
						maxLength={maxLength}
					/>
				) : (
					<input
						className='input'
						ref={ref as React.Ref<HTMLInputElement>}
						id={id}
						name={id}
						type={type === 'password' ? (showPassword ? 'text' : 'password') : type}
						value={value}
						placeholder={placeholder}
						onChange={onChange as (e: ChangeEvent<HTMLInputElement>) => void}
						onBlur={onBlur as (e: FocusEvent<HTMLInputElement>) => void}
						readOnly={readOnly}
						disabled={readOnly}
						maxLength={maxLength}
					/>
				)}
				{type === 'password' ? (
					<Button
						className='input-icon-left'
						onClick={() => setShowPassword(!showPassword)}
						type='button'
						variant='only-icon'>
						{showPassword ? <EyeIcon /> : <EyeCloseIcon />}
					</Button>
				) : null}
				{rightIcon && <div className='input-icon right'>{rightIcon}</div>}
			</div>
		)
	}
)

export default Input
