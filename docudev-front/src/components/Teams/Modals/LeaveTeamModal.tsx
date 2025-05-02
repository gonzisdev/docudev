import { useTranslation } from 'react-i18next'
import ConfirmationModal from 'components/elements/ConfirmationModal/ConfirmationModal'

interface Props {
	isVisible: boolean
	toggleVisibility: () => void
	onConfirm: () => Promise<boolean>
	isLoading: boolean
}

const LeaveTeamModal = ({ isVisible, toggleVisibility, onConfirm, isLoading }: Props) => {
	const { t } = useTranslation()

	return (
		<ConfirmationModal
			isVisible={isVisible}
			toggleVisibility={toggleVisibility}
			title={t('team.leave_team_title')}
			message={t('team.leave_team_description')}
			onConfirm={onConfirm}
			isLoading={isLoading}
		/>
	)
}

export default LeaveTeamModal
