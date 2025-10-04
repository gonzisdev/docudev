import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { useAuthStore } from 'stores/authStore'
import { MAX_FILE_SIZE } from 'constants/limits'
import { UserAccountPayload } from 'models/Auth'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Header from 'components/elements/Header/Header'
import Form from 'components/elements/Form/Form'
import Button from 'components/elements/Button/Button'
import FormInput from 'components/elements/Form/FormInput'
import FormFileInput from 'components/elements/Form/FormFileInput'
import AccountDeleteModal from './Modals/AccountDeleteModal'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { toast } from 'sonner'
import UserPlaceholder from 'assets/images/user-placeholder.jpg'
import './Settings.css'

const Settings = () => {
	const { t } = useTranslation()
	const [loading, setLoading] = useState(false)
	const [previewImage, setPreviewImage] = useState<string | null>(null)
	const [isDeleteModalVisible, setDeleteModalVisible] = useState(false)

	const { user, updateAccount, deleteAccount } = useAuthStore()

	const validationSchema = z.object({
		name: z
			.string()
			.min(1, t('settings.validations.name.required'))
			.min(2, t('settings.validations.name.min_length')),
		surname: z
			.string()
			.min(1, t('settings.validations.surname.required'))
			.min(2, t('settings.validations.surname.min_length')),
		email: z
			.string()
			.min(1, t('settings.validations.email.required'))
			.email(t('settings.validations.email.invalid')),
		image: z
			.any()
			.refine(
				(file) => !file || (file instanceof File && file.size <= MAX_FILE_SIZE),
				t('settings.validations.image.size_limit')
			)
			.refine((file) => {
				if (!file || !(file instanceof File)) return true
				const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp']
				return allowedTypes.includes(file.type)
			}, t('settings.validations.image.type_invalid'))
			.optional()
			.nullable(),
		phone: z
			.string()
			.refine((val) => !val || val.length >= 7, {
				message: t('settings.validations.phone.min_length')
			})
			.refine((val) => !val || val.length <= 20, {
				message: t('settings.validations.phone.max_length')
			})
			.refine((val) => !val || /^[0-9+\s()-]+$/.test(val), {
				message: t('settings.validations.phone.format')
			})
			.optional()
			.nullable()
	})

	const methods = useForm<UserAccountPayload>({
		defaultValues: {
			name: user?.name || '',
			surname: user?.surname || '',
			email: user?.email || '',
			image: undefined,
			phone: user?.phone || ''
		},
		resolver: zodResolver(validationSchema)
	})

	const submit = async (payload: UserAccountPayload) => {
		setLoading(true)
		try {
			if (payload.image instanceof File) {
				const formData = new FormData()
				formData.append('name', payload.name)
				formData.append('surname', payload.surname)
				formData.append('email', payload.email)
				if (payload.phone) {
					formData.append('phone', payload.phone)
				}
				formData.append('image', payload.image)

				await updateAccount(formData)
			} else {
				await updateAccount({
					name: payload.name,
					surname: payload.surname,
					email: payload.email,
					phone: payload.phone,
					image: null
				})
			}
			toast.success(t('settings.toast.success_title'), {
				description: t('settings.toast.success_description')
			})
		} catch (error) {
			toast.error(t('settings.toast.error_title'), {
				description: t('settings.toast.error_description')
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (user) {
			methods.reset({
				name: user.name,
				surname: user.surname,
				email: user.email,
				image: undefined,
				phone: user.phone
			})
		}
	}, [user, methods])

	useEffect(() => {
		const subscription = methods.watch((value, { name }) => {
			if (name === 'image' && value.image instanceof File) {
				const fileReader = new FileReader()
				fileReader.onload = (e) => {
					setPreviewImage(e.target?.result as string)
				}
				fileReader.readAsDataURL(value.image)
			}
		})
		return () => subscription.unsubscribe()
	}, [methods.watch])

	return (
		<DashboardLayout>
			<div className='header'>
				<Header title={t('settings.title')} />
			</div>
			<div className='container settings-container'>
				<h2>{t('settings.subtitle')} </h2>
				<Form methods={methods} onSubmit={methods.handleSubmit(submit)}>
					<div className='settings-image'>
						<img
							src={
								previewImage ||
								(user?.image
									? `${import.meta.env.VITE_API_URL}/uploads/avatars/${user.image}`
									: UserPlaceholder)
							}
							alt='user-placeholder'
						/>
					</div>
					<FormFileInput id='image' label={t('settings.image')} required />
					<FormInput
						id='name'
						label={t('settings.name')}
						placeholder={t('settings.name_placeholder')}
						required
					/>
					<FormInput
						id='surname'
						label={t('settings.surname')}
						placeholder={t('settings.surname_placeholder')}
						required
					/>
					<FormInput
						id='email'
						label={t('settings.email')}
						placeholder={t('settings.email_placeholder')}
						required
					/>
					<FormInput
						id='phone'
						label={t('settings.phone')}
						placeholder={t('settings.phone_placeholder')}
					/>
					<footer>
						<Button type='submit' variant='secondary' loading={loading} fullWidth>
							{t('settings.save_changes')}
						</Button>
						<Button
							onClick={() => setDeleteModalVisible(true)}
							variant='danger'
							loading={loading}
							fullWidth>
							{t('settings.delete_account')}
						</Button>
					</footer>
				</Form>
			</div>
			<AccountDeleteModal
				isVisible={isDeleteModalVisible}
				toggleVisibility={() => setDeleteModalVisible(!isDeleteModalVisible)}
				onConfirm={() => deleteAccount()}
			/>
		</DashboardLayout>
	)
}

export default Settings
