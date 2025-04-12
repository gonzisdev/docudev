import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { Link, useNavigate } from 'react-router-dom'
import { FORGOT_PASSWORD_URL, HOME_URL, REGISTER_URL } from 'constants/routes'
import { Trans, useTranslation } from 'react-i18next'
import AuthLayout from 'layouts/AuthLayout/AuthLayout'
import FormInput from 'components/elements/Form/FormInput'
import Form from 'components/elements/Form/Form'
import Button from 'components/elements/Button/Button'
import { UserFormPayload } from 'models/Auth'
import { useAuthStore } from 'stores/authStore'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import * as z from 'zod'
import './Login.css'

const Login = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { user, login } = useAuthStore()

	const [loading, setLoading] = useState(false)

	const validationSchema = z.object({
		email: z
			.string()
			.min(1, t('login.validations.email.required'))
			.email(t('login.validations.email.invalid')),
		password: z
			.string()
			.min(1, t('login.validations.password.required'))
			.min(7, t('login.validations.password.min_length'))
	})

	const methods = useForm<UserFormPayload>({
		defaultValues: {
			email: '',
			password: ''
		},
		resolver: zodResolver(validationSchema)
	})

	useEffect(() => {
		if (user && user._id) {
			navigate(HOME_URL)
		}
	}, [user])

	const submit = async (credentials: UserFormPayload) => {
		setLoading(true)
		try {
			await login(credentials)
			toast.success(t('login.toast.success_title'), {
				description: t('login.toast.success_description')
			})
		} catch (error) {
			toast.error(t('login.toast.error_title'), {
				description: t('login.toast.error_description')
			})
		} finally {
			setLoading(false)
		}
	}

	return (
		<AuthLayout>
			<div className='login'>
				<h1>{t('login.title')}</h1>
				<p className='login-description'>{t('login.description')}</p>
				<Form methods={methods} onSubmit={methods.handleSubmit(submit)}>
					<FormInput
						id='email'
						label={t('login.email')}
						placeholder={t('login.email_placeholder')}
						required
					/>
					<FormInput
						id='password'
						label={t('login.password')}
						placeholder={t('login.password_placeholder')}
						required
						type='password'
					/>
					<div className='login-links'>
						<Link to={REGISTER_URL} className='link '>
							{t('register.title')}
						</Link>
						<Link to={FORGOT_PASSWORD_URL} className='link '>
							{t('login.forgot_password')}
						</Link>
					</div>
					<footer>
						<Button type='submit' variant='secondary' loading={loading} fullWidth>
							{t('login.sign_in')}
						</Button>
						<Trans
							i18nKey='login.terms'
							components={{
								terms: <Link to='/terms' className='terms-link' />,
								privacy: <Link to='/privacy' className='terms-link' />
							}}
						/>
					</footer>
				</Form>
			</div>
		</AuthLayout>
	)
}

export default Login
