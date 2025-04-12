import { FormProps, InputFormValues } from 'models/Form'
import { getFormInputError } from 'components/elements/Form/formUtils'
import { Controller, useFormContext } from 'react-hook-form'
import { forwardRef } from 'react'
import FormItemLayout from 'layouts/FormLayout/FormItemLayout/FormItemLayout'
import Input from 'components/elements/Input/Input'

interface Props extends FormProps {
	numberOfLines?: number
	maxLength?: number
}

type Ref = HTMLInputElement | HTMLTextAreaElement

const FormInput = forwardRef<Ref, Props>(
	(
		{
			id,
			type = 'text',
			label,
			placeholder,
			required = false,
			icon,
			readonly = false,
			numberOfLines,
			maxLength = 100
		},
		ref
	) => {
		const {
			control,
			formState: { errors, touchedFields }
		} = useFormContext<InputFormValues>()

		const inputProps = !!numberOfLines ? { numberOfLines, maxLength } : { type, ref }

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
					defaultValue={type === 'number' ? undefined : ''}
					render={({ field: { onChange, onBlur, value } }) => (
						<Input
							id={id}
							placeholder={placeholder}
							readOnly={readonly}
							hasError={!!errors[id]}
							onChange={onChange}
							onBlur={onBlur}
							value={value}
							{...inputProps}
						/>
					)}
				/>
			</FormItemLayout>
		)
	}
)

export default FormInput
