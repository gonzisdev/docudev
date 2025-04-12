import { useState } from 'react'
import { Link, useSearchParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import AuthLayout from 'layouts/AuthLayout/AuthLayout'
import Form from 'components/elements/Form/Form'
import FormInput from 'components/elements/Form/FormInput'
import Button from 'components/elements/Button/Button'
import VerificationInput from 'react-verification-input'
import { NewPasswordFormValues, User } from 'models/Auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
import * as z from 'zod'
import './RecoverPassword.css'
import { LOGIN_URL } from 'constants/routes'
import { useAuthStore } from 'stores/authStore'

const RecoverPassword = () => {
	const { t } = useTranslation()
	const [searchParams] = useSearchParams()
	const email = searchParams.get('email')
	const { newPassword } = useAuthStore()

	const [loading, setLoading] = useState(false)
	const [code, setCode] = useState<User['code']>('')

	const validationSchema = z.object({
		password: z
			.string()
			.min(1, t('register.validations.password.required'))
			.min(8, t('register.validations.password.min_length')),
		confirmPassword: z.string().min(1, t('register.validations.confirm_password.required'))
	})

	const methods = useForm({
		defaultValues: {
			password: '',
			confirmPassword: ''
		},
		resolver: zodResolver(validationSchema)
	})

	const handleVerificationComplete = (code: User['code']) => {
		setCode(code)
	}

	const submit = async (values: NewPasswordFormValues) => {
		setLoading(true)
		try {
			await newPassword({
				email: email!,
				code,
				password: values.password
			})
			toast.success(t('recover_password.toast.success_title'), {
				description: t('recover_password.toast.success_description')
			})
		} catch (error) {
			toast.error(t('recover_password.toast.error_title'), {
				description: t('recover_password.toast.error_description')
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<AuthLayout>
			<div className='recovery-pass-component'>
				{email && code?.length !== 6 ? (
					<>
						<h1>{t('recover_password.title')}</h1>
						<p className='recovery-pass-description'>{t('recover_password.code_description')}</p>
						<VerificationInput
							value={code}
							validChars='0-9'
							onChange={setCode}
							onComplete={handleVerificationComplete}
							placeholder='0'
							classNames={{
								container: 'verification-container',
								character: 'verification-character',
								characterSelected: 'verification-character--selected'
							}}
							length={6}
							autoFocus
						/>
					</>
				) : (
					<>
						<h1>{t('recover_password.title')}</h1>
						<p className='recovery-pass-description'>{t('recover_password.description')}</p>
						<Form methods={methods} onSubmit={methods.handleSubmit(submit)}>
							<FormInput
								id='password'
								type='password'
								label={t('recover_password.password')}
								placeholder={t('recover_password.password_placeholder')}
							/>
							<FormInput
								id='confirmPassword'
								type='password'
								label={t('recover_password.confirm_password')}
								placeholder={t('recover_password.password_placeholder')}
							/>
							<footer>
								<Button type='submit' loading={loading} fullWidth>
									{t('recover_password.change_password')}
								</Button>

								<Link to={LOGIN_URL} className='recover-password-link'>
									{t('recover_password.login')}
								</Link>
							</footer>
						</Form>
					</>
				)}
			</div>
		</AuthLayout>
	)
}

export default RecoverPassword
