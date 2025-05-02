import { useEffect, useRef, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { SETTINGS_URL } from 'constants/routes'
import { CaretDownIcon, CloseSessionIcon, SettingsIcon, StarIcon } from 'assets/svgs'
import { User } from 'models/Auth'
import { useTranslation } from 'react-i18next'
import { useAuthStore } from 'stores/authStore'
import { toast } from 'sonner'
import UserPlaceholder from 'assets/images/user-placeholder.jpg'
import './DropdownMyAccount.css'

interface Props {
	user: User
	logout: () => void
}

const DropdownMyAccount = ({ user, logout }: Props) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const dropdownRef = useRef<HTMLDivElement>(null)
	const { updatePlan } = useAuthStore()

	const [isDropdownOpen, setIsDropdownOpen] = useState(false)

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

	const handleUpdatePlan = async () => {
		try {
			await updatePlan()
			toast.success(t('plan.toast.success_title'), {
				description: t('plan.toast.success_description')
			})
		} catch (error) {
			toast.error(t('plan.toast.error_title'), {
				description: t('plan.toast.error_description')
			})
		}
	}

	return (
		<div className='dropdown-my-account' ref={dropdownRef}>
			<div
				className={`dropdown-my-account-content ${isDropdownOpen ? ' opened' : ''}`}
				onClick={() => setIsDropdownOpen(!isDropdownOpen)}>
				<div className='dropdown-my-account-content-wrapper'>
					<img
						src={
							user?.image
								? `${import.meta.env.VITE_API_URL}/uploads/${user.image}`
								: UserPlaceholder
						}
						alt='user-placeholder'
					/>
					<span title={user.name}>{user.email}</span>
				</div>
				<CaretDownIcon />
			</div>

			{isDropdownOpen && (
				<div className='dropdown-my-account-options'>
					<div className='option' onClick={handleUpdatePlan}>
						<StarIcon width='20px' height='20px' />
						<span>{t('general.update_plan')}</span>
					</div>
					<div className='option' onClick={() => navigate(SETTINGS_URL)}>
						<SettingsIcon width='20px' height='20px' />
						<span>{t('general.settings')}</span>
					</div>
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
