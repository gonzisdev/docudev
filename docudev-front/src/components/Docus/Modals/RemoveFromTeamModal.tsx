import { useTranslation } from 'react-i18next'
import ConfirmationModal from 'components/elements/ConfirmationModal/ConfirmationModal'

interface Props {
	isVisible: boolean
	toggleVisibility: () => void
	onConfirm: () => Promise<void>
	isLoading: boolean
	teamName?: string
}

const RemoveFromTeamModal = ({
	isVisible,
	toggleVisibility,
	onConfirm,
	isLoading,
	teamName
}: Props) => {
	const { t } = useTranslation()

	return (
		<ConfirmationModal
			isVisible={isVisible}
			toggleVisibility={toggleVisibility}
			title={t('remove_from_team.title')}
			message={t('remove_from_team.description', { teamName })}
			onConfirm={onConfirm}
			isLoading={isLoading}
		/>
	)
}

export default RemoveFromTeamModal
