import { useEffect, useState } from 'react'
import Input from 'components/elements/Input/Input'
import { InputType } from 'models/Common'

interface DebouncedInputProps {
	id?: string
	value: string | number
	onChange: (value: string | number) => void
	debounce?: number
	type?: InputType
	placeholder?: string
}

const DebouncedInput = ({
	id = `debounced-input-${Math.random().toString(36).substring(2, 9)}`,
	value: initialValue,
	onChange,
	debounce = 500,
	type = 'text',
	placeholder
}: DebouncedInputProps) => {
	const [value, setValue] = useState(initialValue)

	useEffect(() => {
		setValue(initialValue)
	}, [initialValue])

	useEffect(() => {
		const timeout = setTimeout(() => {
			onChange(value)
		}, debounce)

		return () => clearTimeout(timeout)
	}, [value])

	return (
		<Input
			id={id}
			type={type}
			value={String(value)}
			placeholder={placeholder}
			onChange={(e) => setValue(e.target.value)}
		/>
	)
}

export default DebouncedInput
