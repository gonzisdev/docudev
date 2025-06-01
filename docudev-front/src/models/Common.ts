export type ISODateString = string // ISO 8601 date string 0000-00-00T00:00:00.000Z
export type InputType = 'text' | 'password' | 'email' | 'number' | 'tel'
export type FileInputType = '.jpg' | '.png' | '.pdf'
export type DateTypeValidation = 'dd/MM/yyyy' | 'dd/MM/yyyy HH:mm' | 'yyyy'
export interface Option {
	label: string
	value: string
	isDisabled?: boolean
}
