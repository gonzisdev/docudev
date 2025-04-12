import { Link, useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { HOME_URL, LOGIN_URL } from 'constants/routes'
import { useForm } from 'react-hook-form'
import AuthLayout from 'layouts/AuthLayout/AuthLayout'
import Form from 'components/elements/Form/Form'
import FormInput from 'components/elements/Form/FormInput'
import Button from 'components/elements/Button/Button'
import { useAuthStore } from 'stores/authStore'
import { UserRegisterPayload } from 'models/Auth'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'
import * as z from 'zod'
import './Register.css'

const Register = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { user, register } = useAuthStore()

	const [loading, setLoading] = useState(false)

	const validationSchema = z
		.object({
			name: z
				.string()
				.min(1, t('register.validations.name.required'))
				.min(2, t('register.validations.name.min_length')),
			surname: z
				.string()
				.min(1, t('register.validations.surname.required'))
				.min(2, t('register.validations.surname.min_length')),
			email: z
				.string()
				.min(1, t('register.validations.email.required'))
				.email(t('register.validations.email.invalid')),
			password: z
				.string()
				.min(1, t('register.validations.password.required'))
				.min(8, t('register.validations.password.min_length')),
			confirmPassword: z.string().min(1, t('register.validations.confirm_password.required'))
		})
		.refine((data) => data.password === data.confirmPassword, {
			message: t('register.validations.confirm_password.match'),
			path: ['confirmPassword']
		})

	const methods = useForm({
		defaultValues: {
			name: '',
			surname: '',
			email: '',
			password: '',
			confirmPassword: ''
		},
		resolver: zodResolver(validationSchema)
	})

	const submit = async (values: UserRegisterPayload) => {
		setLoading(true)
		const data = {
			name: values.name,
			surname: values.surname,
			email: values.email,
			password: values.password
		}
		try {
			await register(data)
			toast.success(t('register.toast.success_title'), {
				description: t('register.toast.success_description')
			})
		} catch (error) {
			toast.error(t('register.toast.error_title'), {
				description: t('register.toast.error_description')
			})
		} finally {
			setLoading(false)
		}
	}

	useEffect(() => {
		if (user && user._id) {
			navigate(HOME_URL)
		}
	}, [user])

	return (
		<AuthLayout>
			<div className='register'>
				<h1>{t('register.title')}</h1>
				<p className='register-description'>{t('register.description')}</p>
				<Form methods={methods} onSubmit={methods.handleSubmit(submit)}>
					<FormInput
						id='name'
						label={t('register.name')}
						placeholder={t('register.name_placeholder')}
						required
					/>
					<FormInput
						id='surname'
						label={t('register.surname')}
						placeholder={t('register.surname_placeholder')}
						required
					/>
					<FormInput
						id='email'
						label={t('register.email')}
						placeholder={t('register.email_placeholder')}
						required
					/>
					<FormInput
						id='password'
						label={t('register.password')}
						placeholder={t('register.password_placeholder')}
						required
						type='password'
					/>
					<FormInput
						id='confirmPassword'
						label={t('register.confirm_password')}
						placeholder={t('register.password_placeholder')}
						required
						type='password'
					/>
					<footer>
						<Button loading={loading} type='submit' fullWidth>
							{t('register.sign_up')}
						</Button>
						<div className='login-question'>
							<span>{t('register.question')}</span>
							<Link className='link' to={LOGIN_URL}>
								{t('register.login')}
							</Link>
						</div>
						<Trans
							i18nKey='register.terms'
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

export default Register
