import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Button from 'components/elements/Button/Button'
import Card from 'components/elements/Card/Card'
import Form from 'components/elements/Form/Form'
import FormDateInput from 'components/elements/Form/FormDateInput'
import FormFileInput from 'components/elements/Form/FormFileInput'
import FormInput from 'components/elements/Form/FormInput'
import FormNumberInput from 'components/elements/Form/FormNumberInput'
import FormRadioButtons from 'components/elements/Form/FormRadioButtons'
import FormSelect from 'components/elements/Form/FormSelect'
import Header from 'components/elements/Header/Header'

const options = [
	{
		label: 'Opción 1',
		value: '1'
	},
	{
		label: 'Opción 2',
		value: '2'
	}
]

const Forms = () => {
	const { t } = useTranslation()

	const methods = useForm({
		defaultValues: {
			name: 'John',
			date: new Date().toISOString(),
			select: '1',
			file: null,
			number: 0,
			textarea: ''
		}
	})

	return (
		<DashboardLayout>
			<Header title={t('common.forms')} />
			<Card>
				<div className='forms'>
					<Form methods={{ ...methods }} onSubmit={methods.handleSubmit(console.log)}>
						<FormInput id='name' label='Nombre' />
						<FormDateInput id='date' label='Fecha' />
						<FormSelect id='select' label='Seleccionar' options={options} />
						<FormFileInput id='file' label='Archivo' />
						<FormNumberInput id='number' label='Número' />
						<FormRadioButtons id='radio' options={options} />
						<FormInput id='textarea' label='Comentario' numberOfLines={5} />
						<Button type='submit' onClick={methods.handleSubmit(console.log)}>
							{t('general.save')}
						</Button>
					</Form>
				</div>
			</Card>
		</DashboardLayout>
	)
}

export default Forms
