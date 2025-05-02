import './Container.css'

interface Props {
	children?: React.ReactNode
	subtitle?: string
}

const Container = ({ children, subtitle }: Props) => {
	return (
		<div className='container'>
			{subtitle && <h2>{subtitle}</h2>}
			{children}
		</div>
	)
}

export default Container
