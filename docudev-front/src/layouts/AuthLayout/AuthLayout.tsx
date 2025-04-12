import { Logo } from 'assets/svgs'
import './AuthLayout.css'

interface Props {
	children: React.ReactNode
}

const AuthLayout = ({ children }: Props) => {
	return (
		<div className='auth-layout'>
			<div className='auth-layout__card-container'>
				<div className='auth-layout__card'>
					<Logo className='auth-layout__logo' />
					{children}
				</div>
			</div>
		</div>
	)
}

export default AuthLayout
