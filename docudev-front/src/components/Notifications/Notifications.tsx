import { Trans, useTranslation } from 'react-i18next'
import { useNavigate } from 'react-router-dom'
import { Notification, NotificationInviteResponse } from 'models/Notification'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import useNotifications from 'hooks/useNotifications'
import usePagination from 'hooks/usePagination'
import Header from 'components/elements/Header/Header'
import Container from 'components/elements/Container/Container'
import Card from 'components/elements/Card/Card'
import Loading from 'components/elements/Loading/Loading'
import Button from 'components/elements/Button/Button'
import Pagination from 'components/elements/Pagination/Pagination'
import './Notifications.css'
import { DOCU_URL } from 'constants/routes'

const Notifications = () => {
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { notifications, isLoadingNotifications, responseInvite, markAsRead, deleteNotification } =
		useNotifications({ forceRefresh: true })

	const {
		currentItems: paginatedNotifications,
		currentPage,
		pageCount,
		handlePageChange
	} = usePagination<Notification>({
		data: notifications
	})

	const handleDocuClick = async (notification: Notification) => {
		if (notification.status === 'pending') {
			await markAsRead({ notificationId: notification._id, response: 'read' })
		}
		if (typeof notification.docu === 'object') {
			navigate(`${DOCU_URL}/${notification.docu._id}`)
		}
	}

	const renderText = (notification: Notification) => {
		if (
			notification.type === 'team-invite' &&
			typeof notification.sender === 'object' &&
			typeof notification.team === 'object'
		) {
			return (
				<Trans
					i18nKey='notifications.team_invite_text'
					values={{
						user: `${notification.sender.name} ${notification.sender.surname}`,
						team: notification.team.name
					}}
					components={{
						user: <span className='notification-user' />,
						team: <span className='notification-team' />
					}}
				/>
			)
		}

		if (
			notification.type === 'invite-accepted' &&
			typeof notification.sender === 'object' &&
			typeof notification.team === 'object'
		) {
			return (
				<Trans
					i18nKey='notifications.invite_accepted_text'
					values={{
						user: `${notification.sender.name} ${notification.sender.surname}`,
						team: notification.team.name
					}}
					components={{
						user: <span className='notification-user' />,
						team: <span className='notification-team' />
					}}
				/>
			)
		}

		if (
			notification.type === 'mention' &&
			typeof notification.sender === 'object' &&
			typeof notification.docu === 'object'
		) {
			return (
				<Trans
					i18nKey='notifications.mention_text'
					values={{
						user: `${notification.sender.name} ${notification.sender.surname}`,
						docu: notification.docu.title
					}}
					components={{
						user: <span className='notification-user' />,
						docu: (
							<span className='notification-docu' onClick={() => handleDocuClick(notification)} />
						)
					}}
				/>
			)
		}
		return notification.type
	}

	const handleInviteResponse = async (
		notificationId: Notification['_id'],
		response: NotificationInviteResponse
	) => await responseInvite({ notificationId, response })

	const handleMarkAsRead = async (notificationId: Notification['_id']) =>
		await markAsRead({ notificationId, response: 'read' })

	const handleDeleteNotification = async (notificationId: Notification['_id']) =>
		await deleteNotification({ notificationId })

	const isActionableNotification = (notification: Notification) => {
		return (
			(notification.type === 'team-invite' && notification.status === 'pending') ||
			(notification.type === 'invite-accepted' && notification.status === 'pending')
		)
	}

	return (
		<DashboardLayout>
			{isLoadingNotifications ? (
				<Loading />
			) : (
				<>
					<Header title={t('notifications.title')} />
					<Container subtitle={t('notifications.subtitle')}>
						{paginatedNotifications?.length ? (
							<>
								<div className='notifications-list'>
									{paginatedNotifications.map((notification) => (
										<div
											className={`notification-card${
												notification.status !== 'pending' ? ' read' : ''
											}`}
											key={notification._id}>
											<Button
												variant='link'
												className='notification-delete'
												onClick={() => handleDeleteNotification(notification._id)}>
												×
											</Button>
											<div className='notification-card-content'>
												<p className='notification-title'>{renderText(notification)}</p>
												{notification.status !== 'pending' && notification.status !== 'read' && (
													<p
														className={`notification-status${
															notification.status === 'rejected' ? ' error' : ''
														}`}>
														{t(`notifications.${notification.status}`)}
													</p>
												)}
												{isActionableNotification(notification) ? (
													<div className='notification-actions'>
														{notification.type === 'team-invite' &&
															notification.status === 'pending' && (
																<>
																	<Button
																		variant='secondary'
																		onClick={() =>
																			handleInviteResponse(notification._id, 'accepted')
																		}>
																		{t('notifications.accept')}
																	</Button>
																	<Button
																		variant='danger'
																		onClick={() =>
																			handleInviteResponse(notification._id, 'rejected')
																		}>
																		{t('notifications.reject')}
																	</Button>
																	<Button
																		variant='primary'
																		className='mark-as-read'
																		onClick={() => handleMarkAsRead(notification._id)}>
																		{t('notifications.mark_as_read')}
																	</Button>
																</>
															)}
														{notification.type === 'invite-accepted' &&
															notification.status === 'pending' && (
																<Button
																	variant='primary'
																	className='mark-as-read'
																	onClick={() => handleMarkAsRead(notification._id)}>
																	{t('notifications.mark_as_read')}
																</Button>
															)}
													</div>
												) : (
													notification.type === 'mention' &&
													notification.status === 'pending' && (
														<div className='notification-actions'>
															<Button
																variant='primary'
																className='mark-as-read'
																onClick={() => handleMarkAsRead(notification._id)}>
																{t('notifications.mark_as_read')}
															</Button>
														</div>
													)
												)}
											</div>
										</div>
									))}
								</div>
								<Pagination
									pageCount={pageCount}
									currentPage={currentPage}
									onPageChange={handlePageChange}
								/>
							</>
						) : (
							<Card empty>{t('notifications.no_notifications')}</Card>
						)}
					</Container>
				</>
			)}
		</DashboardLayout>
	)
}

export default Notifications
