import { FormFileProps, InputFormValues } from 'models/Form'
import { Controller, useFormContext } from 'react-hook-form'
import FileInput from 'components/elements/FileInput/FileInput'
import FormItemLayout from 'layouts/FormLayout/FormItemLayout/FormItemLayout'

type Props = FormFileProps

const FormFileInput = ({ id, typeFile, label, required = false, icon, helperText }: Props) => {
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
				defaultValue=''
				render={({ field: { onChange } }) => (
					<FileInput onChange={onChange} id={id} type={typeFile} />
				)}
			/>
		</FormItemLayout>
	)
}

export default FormFileInput
