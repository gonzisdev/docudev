import './TableActionLayout.css'

interface Props {
	children: React.ReactNode
	onClick?: () => void
}

const TableActionLayout = ({ children, onClick }: Props) => {
	return (
		<div className='table-action-layout' onClick={onClick}>
			{children}
		</div>
	)
}

export default TableActionLayout
