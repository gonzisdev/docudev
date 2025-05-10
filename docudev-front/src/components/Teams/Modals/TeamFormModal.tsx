import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { UseFormReturn } from 'react-hook-form'
import { TeamFormPayload } from 'models/Team'
import { HexColorPicker } from 'react-colorful'
import { colors } from 'constants/colors'
import Modal from 'components/elements/Modal/Modal'
import Form from 'components/elements/Form/Form'
import FormInput from 'components/elements/Form/FormInput'
import Button from 'components/elements/Button/Button'
import Loading from 'components/elements/Loading/Loading'
import './TeamFormModal.css'

interface Props {
	isVisible: boolean
	toggleVisibility: () => void
	methods: UseFormReturn<TeamFormPayload>
	isEditing: boolean
	isLoadingTeam: boolean
	isSubmitting: boolean
	onSubmit: (data: TeamFormPayload) => Promise<void>
}

const TeamFormModal = ({
	isVisible,
	toggleVisibility,
	methods,
	isEditing,
	isLoadingTeam,
	isSubmitting,
	onSubmit
}: Props) => {
	const { t } = useTranslation()
	const { register, watch, setValue } = methods
	const currentColor = watch('color') || colors.warning

	useEffect(() => {
		register('color')

		if (!watch('color')) {
			setValue('color', colors.warning)
		}
	}, [register, setValue, watch])

	return (
		<Modal
			isVisible={isVisible}
			toggleVisibility={toggleVisibility}
			title={isEditing ? t('teams.update_team') : t('teams.create_team')}>
			{isEditing && isLoadingTeam ? (
				<Loading />
			) : (
				<Form methods={methods} onSubmit={methods.handleSubmit(onSubmit)}>
					<FormInput
						id='name'
						label={t('teams.name')}
						placeholder={t('teams.name_placeholder')}
						required
					/>
					<FormInput
						id='description'
						label={t('teams.description')}
						placeholder={t('teams.description_placeholder')}
						required
					/>
					<div className='form-group'>
						<label>{t('teams.color')}</label>
						<div className='color-picker-container'>
							<HexColorPicker color={currentColor} onChange={(color) => setValue('color', color)} />
							<div className='color-preview' style={{ backgroundColor: currentColor }}>
								<span>{currentColor}</span>
							</div>
						</div>
					</div>
					<footer>
						<Button type='submit' variant='secondary' loading={isSubmitting} fullWidth>
							{isEditing ? t('teams.save_team') : t('teams.create_team')}
						</Button>
					</footer>
				</Form>
			)}
		</Modal>
	)
}

export default TeamFormModal
