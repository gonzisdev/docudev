import { REGISTER_URL } from 'constants/routes'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import AuthLayout from 'layouts/AuthLayout/AuthLayout'
import Form from 'components/elements/Form/Form'
import FormInput from 'components/elements/Form/FormInput'
import Button from 'components/elements/Button/Button'
import { useAuthStore } from 'stores/authStore'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { toast } from 'sonner'
import './ForgotPassword.css'

const ForgotPassword = () => {
	const { t } = useTranslation()
	const { recoverPassword } = useAuthStore()

	const [loading, setLoading] = useState(false)

	const validationSchema = z.object({
		email: z
			.string()
			.min(1, t('forgot_password.validations.email.required'))
			.email(t('forgot_password.validations.email.invalid'))
	})

	const methods = useForm({
		defaultValues: {
			email: ''
		},
		resolver: zodResolver(validationSchema)
	})

	const submit = async ({ email }: { email: string }) => {
		setLoading(true)
		try {
			await recoverPassword(email)
			toast.success(t('forgot_password.toast.success_title'), {
				description: t('forgot_password.toast.success_description')
			})
		} catch (error) {
			toast.error(t('forgot_password.toast.error_title'), {
				description: t('forgot_password.toast.error_description')
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<AuthLayout>
			<div className='forgot-password'>
				<h1>{t('forgot_password.title')}</h1>
				<p className='forgot-password-description'>{t('forgot_password.description')}</p>

				<Form methods={methods} onSubmit={methods.handleSubmit(submit)}>
					<FormInput
						id='email'
						label={t('forgot_password.email')}
						placeholder={t('forgot_password.email_placeholder')}
						required
					/>
					<footer>
						<Button loading={loading} type='submit' fullWidth>
							{t('forgot_password.recover')}
						</Button>
						<div className='login-question'>
							<span>{t('forgot_password.question')}</span>
							<Link to={REGISTER_URL} className='forgot-password-link'>
								{t('forgot_password.register')}
							</Link>
						</div>
					</footer>
				</Form>
			</div>
		</AuthLayout>
	)
}

export default ForgotPassword
