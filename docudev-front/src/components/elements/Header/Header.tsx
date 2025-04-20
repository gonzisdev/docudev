import './Header.css'

interface Props {
	title: string | React.ReactNode
}

const Header = ({ title }: Props) => {
	return (
		<header className='header'>
			<h1>{title}</h1>
		</header>
	)
}

export default Header
