import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { notificationsQueryKey } from 'constants/queryKeys'
import {
	Notification,
	NotificationInviteResponse,
	NotificationMarkAsRead
} from 'models/Notification'
import { useTranslation } from 'react-i18next'
import {
	deleteNotificationService,
	getNotificationsService,
	markAsReadService,
	responseInviteService,
	sentInvitateService
} from 'services/notification'
import { toast } from 'sonner'

const useNotifications = () => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	const { data: notifications, isLoading: isLoadingNotifications } = useQuery({
		queryKey: [notificationsQueryKey],
		queryFn: getNotificationsService,
		staleTime: 5 * 60 * 1000, // 5 minutes
		refetchInterval: 5 * 60 * 1000, // 5 minutes
		refetchOnWindowFocus: 'always'
	})

	const { mutateAsync: sendInvite, isPending: isSendingInvite } = useMutation({
		mutationFn: sentInvitateService,
		onSuccess: () => {
			toast.success(t('notifications.toast.success_title'), {
				description: t('notifications.toast.success_description')
			})
		},
		onError: () => {
			toast.error(t('notifications.toast.error_title'), {
				description: t('notifications.toast.error_description')
			})
		}
	})

	const { mutateAsync: responseInvite } = useMutation({
		mutationFn: ({
			notificationId,
			response
		}: {
			notificationId: Notification['_id']
			response: NotificationInviteResponse
		}) => responseInviteService(notificationId, response),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [notificationsQueryKey]
			})
		}
	})

	const { mutateAsync: markAsRead } = useMutation({
		mutationFn: ({
			notificationId,
			response
		}: {
			notificationId: Notification['_id']
			response: NotificationMarkAsRead
		}) => markAsReadService(notificationId, response),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [notificationsQueryKey]
			})
		}
	})

	const { mutateAsync: deleteNotification } = useMutation({
		mutationFn: ({ notificationId }: { notificationId: Notification['_id'] }) =>
			deleteNotificationService(notificationId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [notificationsQueryKey]
			})
		}
	})

	return {
		notifications,
		isLoadingNotifications,
		sendInvite,
		isSendingInvite,
		responseInvite,
		markAsRead,
		deleteNotification
	}
}

export default useNotifications
