import './Card.css'

interface Props {
	children: React.ReactNode
	className?: string
	empty?: boolean
}

const Card = ({ children, className, empty }: Props) => {
	return (
		<div className={`card-component ${className || ''} ${empty ? 'empty-state' : ''}`}>
			{children}
		</div>
	)
}

export default Card
