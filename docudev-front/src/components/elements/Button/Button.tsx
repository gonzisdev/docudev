import './Button.css'

interface BaseProps {
	className?: string
	children: React.ReactNode
	type?: 'button' | 'submit' | 'reset'
	variant?: 'primary' | 'secondary' | 'danger' | 'only-icon' | 'link'
	leftIcon?: React.ReactNode
	rightIcon?: React.ReactNode
	disabled?: boolean
	loading?: boolean
	noPadding?: boolean
	fullWidth?: boolean
}

interface ButtonWithOnClick extends BaseProps {
	type?: 'button'
	onClick: () => void
}

interface ButtonWithoutOnClick extends BaseProps {
	type: 'submit' | 'reset'
	onClick?: () => void
}

type Props = ButtonWithOnClick | ButtonWithoutOnClick

const Button = ({
	className,
	children,
	type = 'button',
	variant = 'primary',
	leftIcon,
	rightIcon,
	disabled = false,
	loading = false,
	noPadding = false,
	fullWidth = false,
	onClick
}: Props) => {
	const classnames = () => {
		let classes = 'button'
		if (className) classes += ` ${className}`
		classes += ` ${variant}`
		if (noPadding) classes += ' no-padding'
		if (disabled) classes += ' disabled'
		if (loading) classes += ' loading'
		if (fullWidth) classes += ' full-width'
		return classes
	}

	return (
		<button type={type} className={classnames()} onClick={() => !disabled && onClick && onClick()}>
			{loading ? (
				<div className={`button-loading ${variant === 'primary' ? 'white' : variant}`} />
			) : (
				<>
					{leftIcon && leftIcon}
					{children}
					{rightIcon && rightIcon}{' '}
				</>
			)}
		</button>
	)
}

export default Button
