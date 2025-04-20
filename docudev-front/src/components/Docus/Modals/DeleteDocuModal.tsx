import { useTranslation } from 'react-i18next'
import ConfirmationModal from 'components/elements/ConfirmationModal/ConfirmationModal'

interface Props {
	isVisible: boolean
	toggleVisibility: () => void
	onConfirm: () => Promise<void>
	isLoading: boolean
}

const DeleteDocuModal = ({ isVisible, toggleVisibility, onConfirm, isLoading }: Props) => {
	const { t } = useTranslation()

	return (
		<ConfirmationModal
			isVisible={isVisible}
			toggleVisibility={toggleVisibility}
			title={t('delete_docu.title')}
			message={t('delete_docu.description')}
			onConfirm={onConfirm}
			isLoading={isLoading}
		/>
	)
}

export default DeleteDocuModal
