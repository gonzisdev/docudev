import './FormGroupLayout.css'

interface Props {
	title?: string
	children: React.ReactNode
}

const FormGroupLayout = ({ title, children }: Props) => {
	return (
		<div className='form-group-layout'>
			{title && <h4 className='form-group-title'>{title}</h4>}
			{children}
		</div>
	)
}

export default FormGroupLayout
