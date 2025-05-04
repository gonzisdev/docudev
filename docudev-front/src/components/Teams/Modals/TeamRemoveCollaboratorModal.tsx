import { useTranslation } from 'react-i18next'
import ConfirmationModal from 'components/elements/ConfirmationModal/ConfirmationModal'

interface Props {
	isVisible: boolean
	toggleVisibility: () => void
	onConfirm: () => Promise<void>
	isLoading: boolean
}

const TeamRemoveCollaboratorModal = ({
	isVisible,
	toggleVisibility,
	onConfirm,
	isLoading
}: Props) => {
	const { t } = useTranslation()

	return (
		<ConfirmationModal
			isVisible={isVisible}
			toggleVisibility={toggleVisibility}
			title={t('team.remove_collaborator_title')}
			message={t('team.remove_collaborator_description')}
			onConfirm={onConfirm}
			isLoading={isLoading}
		/>
	)
}

export default TeamRemoveCollaboratorModal
