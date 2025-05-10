import { Team } from 'models/Team'
import './Header.css'

interface Props {
	title: string | React.ReactNode
	children?: React.ReactNode
	color?: Team['color']
}

const Header = ({ title, children, color }: Props) => {
	return (
		<header className='header'>
			<h1 style={{ color: color }}>{title}</h1>
			{children}
		</header>
	)
}

export default Header
