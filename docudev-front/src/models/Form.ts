import { FileInputType, InputType } from './Common'

export interface FormProps {
	id: string
	type?: InputType
	label?: string
	placeholder?: string
	required?: boolean
	icon?: React.ReactNode
	readonly?: boolean
	helperText?: string
}

export interface FormFileProps extends FormProps {
	typeFile?: FileInputType
}

export interface InputFormValues {
	[key: string]: string
}

export interface NumberInputFormValues {
	[key: string]: number
}
