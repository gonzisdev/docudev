import { Option } from 'models/Common'
import { FormProps, InputFormValues } from 'models/Form'
import { getFormInputError } from 'components/elements/Form/formUtils'
import { Controller, useFormContext } from 'react-hook-form'
import { forwardRef } from 'react'
import { GroupBase, SelectInstance } from 'react-select'
import FormItemLayout from 'layouts/FormLayout/FormItemLayout/FormItemLayout'
import Select from 'components/elements/Select/Select'

interface Props extends FormProps {
	options: Option[]
	placeholder?: string
	disabled?: boolean
}

const FormSelect = forwardRef<SelectInstance<Option, false, GroupBase<Option>>, Props>(
	({ id, label, required = false, options, placeholder, disabled }, ref) => {
		const {
			control,
			formState: { errors, touchedFields }
		} = useFormContext<InputFormValues>()

		return (
			<FormItemLayout
				id={id}
				label={label}
				errorMessage={getFormInputError(id, errors, touchedFields)}
				required={required}>
				<Controller
					name={id}
					control={control}
					defaultValue=''
					render={({ field: { onChange, onBlur, value } }) => (
						<Select
							ref={ref}
							id={id}
							value={value}
							onChange={onChange}
							onBlur={onBlur}
							options={options}
							hasError={!!errors[id]}
							placeholder={placeholder}
							disabled={disabled}
						/>
					)}
				/>
			</FormItemLayout>
		)
	}
)

export default FormSelect
