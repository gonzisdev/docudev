import { useEffect, useRef } from 'react'
import './TableSelectionCheckbox.css'

interface Props {
	indeterminate: boolean
	checked: boolean
	disabled?: boolean
	onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}

const TableSelectionCheckbox = ({ indeterminate, checked, disabled, onChange }: Props) => {
	const ref = useRef<HTMLInputElement>(null)

	useEffect(() => {
		if (ref.current && typeof indeterminate === 'boolean') {
			ref.current.indeterminate = !checked && indeterminate
		}
	}, [ref, indeterminate])

	return (
		<input
			ref={ref}
			type='checkbox'
			className='table-selection-checkbox'
			checked={checked}
			disabled={disabled}
			onChange={onChange}
		/>
	)
}

export default TableSelectionCheckbox
