import './FormRowLayout.css'

interface Props {
	children: React.ReactNode
}

const FormRowLayout = ({ children }: Props) => {
	return <div className='form-row-layout'>{children}</div>
}

export default FormRowLayout
