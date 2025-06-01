import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { SETTINGS_URL } from 'constants/routes'
import { useAuthStore } from 'stores/authStore'
import { useLanguageStore } from 'stores/languageStore'
import { User } from 'models/Auth'
import { Language } from 'models/Language'
import { toast } from 'sonner'
import { CaretDownIcon, CloseSessionIcon, SettingsIcon, StarIcon, LangIcon } from 'assets/svgs'
import UserPlaceholder from 'assets/images/user-placeholder.jpg'
import './DropdownMyAccount.css'
import i18n from './../../../i18n'

interface Props {
	user: User
	logout: () => void
}

const DropdownMyAccount = ({ user, logout }: Props) => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const dropdownRef = useRef<HTMLDivElement>(null)
	const { updatePlan } = useAuthStore()
	const { language, setLanguage } = useLanguageStore()

	const LANGUAGES = [
		{ code: 'es', label: t('general.spanish') },
		{ code: 'en', label: t('general.english') }
	]

	const [isDropdownOpen, setIsDropdownOpen] = useState(false)
	const [showLanguageSelect, setShowLanguageSelect] = useState(false)

	const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
		const lang = e.target.value as Language
		setLanguage(lang)
		i18n.changeLanguage(lang)
	}

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
					<div
						className='option language-option'
						onMouseEnter={() => setShowLanguageSelect(true)}
						onMouseLeave={() => setShowLanguageSelect(false)}>
						<LangIcon width='1.25rem' height='1.25rem' />
						{!showLanguageSelect ? (
							<span>{t('general.language')}</span>
						) : (
							<select
								value={language}
								onChange={handleLanguageChange}
								autoFocus
								onBlur={() => setShowLanguageSelect(false)}>
								{LANGUAGES.map((lang) => (
									<option key={lang.code} value={lang.code}>
										{lang.label}
									</option>
								))}
							</select>
						)}
					</div>
					<div className='option' onClick={handleUpdatePlan}>
						<StarIcon width='1.25rem' height='1.25rem' />
						<span>{t('general.update_plan')}</span>
					</div>
					<div className='option' onClick={() => navigate(SETTINGS_URL)}>
						<SettingsIcon width='1.25rem' height='1.25rem' />
						<span>{t('general.settings')}</span>
					</div>
					<div className='option' onClick={() => logout()}>
						<CloseSessionIcon width='1.25rem' height='1.25rem' />
						<span>{t('general.logout')}</span>
					</div>
				</div>
			)}
		</div>
	)
}

export default DropdownMyAccount
