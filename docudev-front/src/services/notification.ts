import {
	Notification,
	NotificationFormPayload,
	NotificationInviteResponse,
	NotificationMarkAsRead
} from 'models/Notification'
import customFetch from './customFetch'
import { endpoints } from './endpoints'

export const sentInvitateService = async (data: NotificationFormPayload) => {
	return await customFetch<boolean>(endpoints.sendInvite, {
		method: 'POST',
		bodyReq: data
	})
}

export const getNotificationsService = async () => {
	return await customFetch<Notification[]>(endpoints.notifications, {
		method: 'GET'
	})
}

export const responseInviteService = async (
	notificationId: Notification['_id'],
	response: NotificationInviteResponse
) => {
	await customFetch<boolean>(`${endpoints.respondInvite}/${notificationId}`, {
		method: 'PATCH',
		bodyReq: { response }
	})
	return response
}

export const markAsReadService = async (
	notificationId: Notification['_id'],
	response: NotificationMarkAsRead
) => {
	return await customFetch<boolean>(`${endpoints.markAsRead}/${notificationId}`, {
		method: 'PATCH',
		bodyReq: { response }
	})
}

export const deleteNotificationService = async (notificationId: Notification['_id']) => {
	return await customFetch<boolean>(`${endpoints.deleteNotification}/${notificationId}`, {
		method: 'DELETE'
	})
}
