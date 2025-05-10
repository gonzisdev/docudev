import { useTranslation } from 'react-i18next'
import { NotificationFormPayload } from 'models/Notification'
import { useForm } from 'react-hook-form'
import { Team } from 'models/Team'
import useNotifications from 'hooks/useNotifications'
import Modal from 'components/elements/Modal/Modal'
import Form from 'components/elements/Form/Form'
import FormInput from 'components/elements/Form/FormInput'
import Button from 'components/elements/Button/Button'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'

interface Props {
	isVisible: boolean
	toggleVisibility: () => void
	teamId?: Team['_id']
}

const TeamInviteCollaboratorModal = ({ isVisible, toggleVisibility, teamId }: Props) => {
	const { t } = useTranslation()
	const { sendInvite, isSendingInvite } = useNotifications({})

	const validationSchema = z.object({
		email: z
			.string()
			.min(1, t('team.validations.email.required'))
			.email(t('team.validations.email.invalid'))
	})

	const methods = useForm<NotificationFormPayload>({
		defaultValues: {
			email: ''
		},
		resolver: zodResolver(validationSchema)
	})

	const submit = async (data: NotificationFormPayload) => {
		const payload = {
			email: data.email,
			teamId
		}
		await sendInvite(payload)
		toggleVisibility()
	}

	return (
		<Modal isVisible={isVisible} toggleVisibility={toggleVisibility} title={t('team.invite')}>
			<Form methods={methods} onSubmit={methods.handleSubmit(submit)}>
				<FormInput
					id='email'
					label={t('team.email')}
					placeholder={t('team.email_placeholder')}
					required
				/>
				<footer>
					<Button type='submit' variant='secondary' loading={isSendingInvite} fullWidth>
						{t('team.send_invite')}
					</Button>
				</footer>
			</Form>
		</Modal>
	)
}

export default TeamInviteCollaboratorModal
