import { useTranslation } from 'react-i18next'
import { UseFormReturn } from 'react-hook-form'
import { DOCU_LIMIT } from 'constants/limits'
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
import { useDocuCounts } from 'hooks/useDocuCounts'

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
	const { data: userDocusCount } = useDocuCounts()

	const selectedTeam = methods.watch('team')
	const isCreatingWithoutTeam = !docu?._id && !selectedTeam
	const personalDocsCount = userDocusCount?.amount || 0
	const isPersonalLimitReached = personalDocsCount >= DOCU_LIMIT

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
					{isCreatingWithoutTeam && isPersonalLimitReached && (
						<Warning
							title={t('docus.warning.warning_title_docu_limit')}
							description={t('docus.warning.warning_description_docu_limit')}
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
							options={teams.map((team) => {
								const teamDocusCount = team.docus.length || 0
								const isAtLimit = teamDocusCount >= DOCU_LIMIT
								const isNotAdminTeamOwner = !(
									typeof team.owner === 'object' && team.owner.role === 'admin'
								)
								const labelSuffix = isAtLimit
									? ` (${t('docus.form.team_limit_reached')})`
									: isNotAdminTeamOwner
										? ` (${t('docus.form.team_no_admin_plan')})`
										: ''
								return {
									value: team._id,
									label: `${team.name}${labelSuffix}`,
									isDisabled: isNotAdminTeamOwner || isAtLimit
								}
							})}
							isClearable={true}
							disabled={docu?._id ? docu && docu.owner?._id !== user?._id : false}
							helperText={t('docus.team_change_restricted_description')}
						/>
					)}
					<footer>
						<Button
							type='submit'
							variant='secondary'
							loading={isSubmitting}
							fullWidth
							disabled={isCreatingWithoutTeam && isPersonalLimitReached}>
							{docu?._id ? t('update_docu.save_docu') : t('create_docu.title')}
						</Button>
					</footer>
				</Form>
			)}
		</Modal>
	)
}

export default DocuFormModal
