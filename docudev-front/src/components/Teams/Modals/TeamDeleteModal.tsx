import { useTranslation } from 'react-i18next'
import ConfirmationModal from 'components/elements/ConfirmationModal/ConfirmationModal'

interface Props {
	isVisible: boolean
	toggleVisibility: () => void
	onConfirm: () => Promise<void>
	isLoading: boolean
}

const TeamDeleteModal = ({ isVisible, toggleVisibility, onConfirm, isLoading }: Props) => {
	const { t } = useTranslation()

	return (
		<ConfirmationModal
			isVisible={isVisible}
			toggleVisibility={toggleVisibility}
			title={t('teams.delete_team')}
			message={t('teams.delete_team_description')}
			onConfirm={onConfirm}
			isLoading={isLoading}
		/>
	)
}

export default TeamDeleteModal
