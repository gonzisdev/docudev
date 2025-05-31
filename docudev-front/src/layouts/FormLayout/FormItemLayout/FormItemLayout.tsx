import { useState, useRef } from 'react'
import { InfoIcon } from 'assets/svgs'
import './FormItemLayout.css'

interface Props {
	id: string
	label?: string
	errorMessage?: string
	required?: boolean
	children: React.ReactNode
	icon?: React.ReactNode
	helperText?: string
}

const FormItemLayout = ({
	id,
	label,
	errorMessage,
	required = false,
	children,
	icon,
	helperText
}: Props) => {
	const [showTooltip, setShowTooltip] = useState(false)
	const [tooltipPosition, setTooltipPosition] = useState({ top: 0, left: 0 })
	const iconRef = useRef<HTMLDivElement>(null)

	const labelClassNames = () => {
		let classes = 'form-item-label'
		if (errorMessage) classes += ' error'
		return classes
	}

	const handleMouseEnter = () => {
		if (iconRef.current) {
			const rect = iconRef.current.getBoundingClientRect()
			setTooltipPosition({
				top: rect.top - 45,
				left: rect.left + rect.width / 2
			})
		}
		setShowTooltip(true)
	}

	const handleMouseLeave = () => {
		setShowTooltip(false)
	}

	return (
		<div className='form-item-layout'>
			{label && (
				<label className={labelClassNames()} htmlFor={id}>
					{label}
					{required && <span className='form-item-required'>*</span>}
					{helperText && (
						<div className='form-tooltip-container' ref={iconRef}>
							<InfoIcon
								className='form-tooltip-icon'
								onMouseEnter={handleMouseEnter}
								onMouseLeave={handleMouseLeave}
								width={16}
								height={16}
							/>
						</div>
					)}
					{icon}
				</label>
			)}
			{children}
			{errorMessage && <span className='form-item-error'>{errorMessage}</span>}
			{showTooltip && helperText && (
				<div
					className='form-tooltip-fixed'
					style={{
						top: tooltipPosition.top,
						left: tooltipPosition.left
					}}>
					{helperText}
				</div>
			)}
		</div>
	)
}

export default FormItemLayout
