import { FieldValues, FormProvider, UseFormReturn } from 'react-hook-form'
import './Form.css'

interface Props<T extends FieldValues> {
	methods: UseFormReturn<T>
	children: React.ReactNode
	onSubmit?: (event: React.FormEvent<HTMLFormElement>) => void
}

const Form = <T extends FieldValues>({ methods, children, onSubmit }: Props<T>) => {
	return (
		<FormProvider {...methods}>
			<form
				className='form-layout'
				onSubmit={(e) => {
					e.preventDefault()
					onSubmit && onSubmit(e)
				}}>
				{children}
			</form>
		</FormProvider>
	)
}

export default Form
