import './Header.css'

interface Props {
	title: string
}

const Header = ({ title }: Props) => {
	return (
		<header className='header'>
			<h1>{title}</h1>
		</header>
	)
}

export default Header
