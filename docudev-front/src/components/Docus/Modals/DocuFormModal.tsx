import { useTranslation } from 'react-i18next'
import { UseFormReturn } from 'react-hook-form'
import { Docu, DocuFormPayload } from 'models/Docu'
import { Team } from 'models/Team'
import { useAuthStore } from 'stores/authStore'
import Modal from 'components/elements/Modal/Modal'
import Form from 'components/elements/Form/Form'
import FormInput from 'components/elements/Form/FormInput'
import FormSelect from 'components/elements/Form/FormSelect'
import Button from 'components/elements/Button/Button'
import Loading from 'components/elements/Loading/Loading'
import Warning from 'components/elements/Warning/Warning'

interface Props {
	isVisible: boolean
	toggleVisibility: () => void
	methods: UseFormReturn<DocuFormPayload>

	teams?: Team[]
	isLoading: boolean
	isSubmitting: boolean
	onSubmit: (data: DocuFormPayload) => Promise<void>
	docu?: Docu
}

const DocuFormModal = ({
	isVisible,
	toggleVisibility,
	methods,
	docu,
	teams,
	isLoading,
	isSubmitting,
	onSubmit
}: Props) => {
	const { t } = useTranslation()
	const { user } = useAuthStore()

	const isDocumentOwner = docu && docu.owner?._id === user?._id

	return (
		<Modal
			isVisible={isVisible}
			toggleVisibility={toggleVisibility}
			title={docu?._id ? t('update_docu.title') : t('create_docu.title')}>
			{docu?._id && isLoading ? (
				<Loading />
			) : (
				<Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
					{docu?._id && (
						<Warning
							title={t('docus.warning.warning_title_save')}
							description={t('docus.warning.warning_description_save')}
						/>
					)}
					<FormInput
						id='title'
						label={t('docus.form.title')}
						placeholder={t('docus.form.title_placeholder')}
						required
					/>
					{teams && teams.length > 0 && (
						<FormSelect
							id='team'
							label={t('docus.form.team')}
							placeholder={t('docus.form.team_placeholder')}
							options={teams.map((team) => ({
								value: team._id,
								label: team.name
							}))}
							isClearable={true}
							disabled={docu?._id ? !isDocumentOwner : false}
							helperText={
								docu?._id && !isDocumentOwner
									? t('docus.team_change_restricted_description')
									: undefined
							}
						/>
					)}
					<footer>
						<Button type='submit' variant='secondary' loading={isSubmitting} fullWidth>
							{docu?._id ? t('update_docu.save_docu') : t('create_docu.title')}
						</Button>
					</footer>
				</Form>
			)}
		</Modal>
	)
}

export default DocuFormModal
