import { isValid, parse } from 'date-fns'
import { DateTypeValidation } from 'models/Common'
import { FieldErrors } from 'react-hook-form'
import { z } from 'zod'

export const getFormInputError = (
	id: string,
	errors: FieldErrors,
	touched: Record<string, boolean | undefined>
): string | undefined => {
	if (errors[id] || touched[id]) {
		return errors[id]?.message?.toString()
	}
	return undefined
}

export const createDateFormatValidator = (format: DateTypeValidation, message: string) => {
	return z.string().refine(
		(value) => {
			const date = parse(value, format, new Date())
			return isValid(date)
		},
		{
			message
		}
	)
}

export const formatNumber = (num: string) => {
	const parts = num.split('.')
	parts[0] = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')
	return parts.join('.')
}
