import { InputHTMLAttributes, useEffect, useState } from 'react'

const DebouncedInput = ({
	value: initialValue,
	onChange,
	debounce = 500,
	...props
}: {
	value: string | number
	onChange: (value: string | number) => void
	debounce?: number
} & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) => {
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
		<input
			{...props}
			value={value}
			onClick={(e) => e.stopPropagation()}
			onChange={(e) => {
				setValue(e.target.value)
			}}
		/>
	)
}

export default DebouncedInput
