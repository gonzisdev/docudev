import { useTranslation } from 'react-i18next'
import ConfirmationModal from 'components/elements/ConfirmationModal/ConfirmationModal'

interface Props {
	isVisible: boolean
	toggleVisibility: () => void
	onConfirm: () => Promise<boolean>
}

const AccountDeleteModal = ({ isVisible, toggleVisibility, onConfirm }: Props) => {
	const { t } = useTranslation()

	return (
		<ConfirmationModal
			isVisible={isVisible}
			toggleVisibility={toggleVisibility}
			title={t('settings.delete_account')}
			message={t('settings.delete_account_description')}
			onConfirm={onConfirm}
		/>
	)
}

export default AccountDeleteModal
