import './Card.css'

interface Props {
	children: React.ReactNode
	className?: string
	empty?: boolean
	onClick?: () => void
}

const Card = ({ children, className, empty, onClick }: Props) => {
	return (
		<div
			className={`card-component ${className || ''} ${empty ? 'empty-state' : ''}`}
			onClick={onClick}>
			{children}
		</div>
	)
}

export default Card
