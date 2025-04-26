import { useTranslation } from 'react-i18next'
import { ActiveUser } from 'models/Collaboration'
import './CollaborationStatus.css'

interface Props {
	isConnected: boolean
	activeUsers: ActiveUser[]
}

const CollaborationStatus = ({ isConnected, activeUsers }: Props) => {
	const { t } = useTranslation()

	const groupedUsers = activeUsers.reduce(
		(acc, user) => {
			const existingUser = acc.find((u) => u.name === user.name)
			if (existingUser) {
				existingUser.count = (existingUser.count || 1) + 1
			} else {
				acc.push({ ...user, count: 1 })
			}
			return acc
		},
		[] as (ActiveUser & { count?: number })[]
	)

	return (
		<div className='collaboration-status-container'>
			<div className='connection-status'>
				<span className={`status-indicator ${isConnected ? 'connected' : 'disconnected'}`} />
				<span>{isConnected ? t('collaboration.connected') : t('collaboration.disconnected')}</span>
			</div>
			<div className='cursor-status'>
				<span
					className='cursor-indicator'
					style={{ backgroundColor: isConnected ? '#4CAF50' : '#F44336' }}></span>
			</div>
			{activeUsers.length > 0 && (
				<div className='active-users-container'>
					<span className='active-users-label'>{t('collaboration.active_users')}: </span>
					<div className='user-avatars'>
						{groupedUsers.map((user) => (
							<div
								key={user.id}
								className='user-avatar'
								style={{
									borderColor: user.color,
									backgroundColor: !user.image ? user.color : undefined
								}}
								title={user.name}>
								{user.image ? (
									<>
										<img
											src={`${import.meta.env.VITE_API_URL}/uploads/${user.image}`}
											alt={user.name}
											className='user-image'
										/>
										<div className='user-initials'>{user.name.charAt(0).toUpperCase()}</div>
									</>
								) : (
									user.name.charAt(0).toUpperCase()
								)}
							</div>
						))}
					</div>
				</div>
			)}
		</div>
	)
}

export default CollaborationStatus
