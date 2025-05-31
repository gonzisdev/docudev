import { FormProps, InputFormValues } from 'models/Form'
import 'react-datepicker/dist/react-datepicker.css'
import DateInput, { dateType } from 'components/elements/DateInput/DateInput'
import FormItemLayout from 'layouts/FormLayout/FormItemLayout/FormItemLayout'
import { getFormInputError } from 'components/elements/Form/formUtils'
import { Controller, useFormContext } from 'react-hook-form'

interface Props extends FormProps {
	dateType?: dateType
	placeholder?: string
	helperText?: string
}

const FormDateInput = ({
	id,
	label,
	required = false,
	dateType = 'date',
	placeholder,
	helperText
}: Props) => {
	const {
		control,
		formState: { errors, touchedFields }
	} = useFormContext<InputFormValues>()

	return (
		<FormItemLayout
			id={id}
			label={label}
			errorMessage={getFormInputError(id, errors, touchedFields)}
			required={required}
			helperText={helperText}>
			<Controller
				name={id}
				control={control}
				defaultValue=''
				render={({ field: { onChange, onBlur, value } }) => (
					<DateInput
						id={id}
						type={dateType}
						value={value}
						hasError={!!errors[id]}
						onChange={onChange}
						onBlur={onBlur}
						placeholderText={placeholder}
					/>
				)}
			/>
		</FormItemLayout>
	)
}

export default FormDateInput
