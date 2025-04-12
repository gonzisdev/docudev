import './FormItemLayout.css'

interface Props {
	id: string
	label?: string
	errorMessage?: string
	required?: boolean
	children: React.ReactNode
	icon?: React.ReactNode
}

const FormItemLayout = ({ id, label, errorMessage, required = false, children, icon }: Props) => {
	const labelClassNames = () => {
		let classes = 'form-item-label'
		if (errorMessage) classes += ' error'

		return classes
	}

	return (
		<div className='form-item-layout'>
			{label && (
				<label className={labelClassNames()} htmlFor={id}>
					{label}
					{required ? <span className='form-item-required'>*</span> : ''}
					{icon}
				</label>
			)}
			{children}
			{errorMessage && <span className='form-item-error'>{errorMessage}</span>}
		</div>
	)
}

export default FormItemLayout
