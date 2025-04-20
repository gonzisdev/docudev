import { useTranslation } from 'react-i18next'
import { UseFormReturn } from 'react-hook-form'
import { DocuFormPayload } from 'models/Docu'
import { Team } from 'models/Team'
import Modal from 'components/elements/Modal/Modal'
import Form from 'components/elements/Form/Form'
import FormInput from 'components/elements/Form/FormInput'
import FormSelect from 'components/elements/Form/FormSelect'
import Button from 'components/elements/Button/Button'
import Loading from 'components/elements/Loading/Loading'

interface Props {
	isVisible: boolean
	toggleVisibility: () => void
	methods: UseFormReturn<DocuFormPayload>
	docuId?: string
	teams?: Team[]
	isLoading: boolean
	isSubmitting: boolean
	onSubmit: (data: DocuFormPayload) => Promise<void>
}

const DocuFormModal = ({
	isVisible,
	toggleVisibility,
	methods,
	docuId,
	teams,
	isLoading,
	isSubmitting,
	onSubmit
}: Props) => {
	const { t } = useTranslation()

	return (
		<Modal
			isVisible={isVisible}
			toggleVisibility={toggleVisibility}
			title={docuId ? t('update_docu.title') : t('create_docu.title')}>
			{docuId && isLoading ? (
				<Loading />
			) : (
				<Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
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
						/>
					)}
					<footer>
						<Button type='submit' variant='secondary' loading={isSubmitting} fullWidth>
							{docuId ? t('update_docu.save_docu') : t('create_docu.title')}
						</Button>
					</footer>
				</Form>
			)}
		</Modal>
	)
}

export default DocuFormModal
