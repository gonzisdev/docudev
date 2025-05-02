import './Header.css'

interface Props {
	title: string | React.ReactNode
	children?: React.ReactNode
}

const Header = ({ title, children }: Props) => {
	return (
		<header className='header'>
			<h1>{title}</h1>
			{children}
		</header>
	)
}

export default Header
