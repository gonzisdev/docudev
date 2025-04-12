import { CaretDownIcon, CloseSessionIcon } from 'assets/svgs'
import { User } from 'models/Auth'
import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import UserPlaceholder from 'assets/images/user-placeholder.jpg'
import './DropdownMyAccount.css'

interface Props {
	user: User
	logout: () => void
}

const DropdownMyAccount = ({ user, logout }: Props) => {
	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const dropdownRef = useRef<HTMLDivElement>(null)
	const { t } = useTranslation()

	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
				setIsDropdownOpen(false)
			}
		}
		if (isDropdownOpen) {
			document.addEventListener('mousedown', handleClickOutside)
		}

		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [isDropdownOpen])

	return (
		<div className='dropdown-my-account' ref={dropdownRef}>
			<div
				className={`dropdown-my-account-content ${isDropdownOpen ? ' opened' : ''}`}
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
				<div className='dropdown-my-account-content-wrapper'>
					<img src={user.image || UserPlaceholder} alt='user-placeholder' />
					<span title={user.name}>{user.email}</span>
				</div>
				<CaretDownIcon />
			</div>

			{isDropdownOpen && (
				<div className='dropdown-my-account-options'>
					<div className='option' onClick={() => logout()}>
						<CloseSessionIcon width='20px' height='20px' />
						<span>{t('general.logout')}</span>
					</div>
				</div>
			)}
		</div>
	)
}

export default DropdownMyAccount
