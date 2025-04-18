import './Warning.css'

interface Props {
	title: string
	description: string
}

const Warning = ({ title, description }: Props) => {
	return (
		<div className='admin-warning-alert'>
			<div className='warning-icon'>⚠️</div>
			<div className='warning-content'>
				<h4>{title}</h4>
				<p>{description}</p>
			</div>
		</div>
	)
}

export default Warning
