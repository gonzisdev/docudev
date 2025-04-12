import { FormProps, NumberInputFormValues } from 'models/Form'
import { Controller, useFormContext } from 'react-hook-form'
import { getFormInputError } from './formUtils'
import FormItemLayout from 'layouts/FormLayout/FormItemLayout/FormItemLayout'
import NumberInput from '../NumberInput/NumberInput'

type Props = FormProps

const FormNumberInput = ({
	id,
	label,
	placeholder,
	required = false,
	icon,
	readonly = false
}: Props) => {
	const {
		control,
		formState: { errors, touchedFields }
	} = useFormContext<NumberInputFormValues>()

	return (
		<FormItemLayout
			id={id}
			label={label}
			errorMessage={getFormInputError(id, errors, touchedFields)}
			required={required}
			icon={icon}>
			<Controller
				name={id}
				control={control}
				defaultValue={0}
				render={({ field: { onChange, onBlur, value } }) => (
					<NumberInput
						id={id}
						placeholder={placeholder}
						readOnly={readonly}
						hasError={!!errors[id]}
						onChange={onChange}
						onBlur={onBlur}
						value={value}
					/>
				)}
			/>
		</FormItemLayout>
	)
}

export default FormNumberInput
