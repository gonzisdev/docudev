import './TableActionLayout.css'

interface Props {
	children: React.ReactNode
}

const TableActionLayout = ({ children }: Props) => {
	return <div className='table-action-layout'>{children}</div>
}

export default TableActionLayout
