import { FormProps, InputFormValues } from 'models/Form'
import { Controller, useFormContext } from 'react-hook-form'
import { Option } from 'models/Common'
import FormItemLayout from 'layouts/FormLayout/FormItemLayout/FormItemLayout'
import RadioButtons from 'components/elements/RadioButtons/RadioButtons'

interface Props extends FormProps {
	options: Option[]
}

const FormRadioButton = ({
	id,
	label,
	options,
	required = false,
	icon,
	readonly = false,
	helperText
}: Props) => {
	const {
		control,
		formState: { errors }
	} = useFormContext<InputFormValues>()

	return (
		<FormItemLayout
			id={id}
			label={label}
			errorMessage={errors[id] ? errors[id].message?.toString() : ''}
			required={required}
			icon={icon}
			helperText={helperText}>
			<Controller
				name={id}
				control={control}
				defaultValue={''}
				render={({ field: { onChange, onBlur, value } }) => (
					<RadioButtons
						id={id}
						value={value}
						readOnly={readonly}
						hasError={!!errors[id]}
						onChange={onChange}
						onBlur={onBlur}
						options={options}
					/>
				)}
			/>
		</FormItemLayout>
	)
}

export default FormRadioButton
