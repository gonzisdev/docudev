import { Team } from 'models/Team'
import { User } from 'models/Auth'

export interface Notification {
	_id: string
	type: 'invite-accepted' | 'team-invite'
	sender: User['_id'] | { _id: User['_id']; name: User['name']; surname: User['surname'] }
	receiver: User['_id']
	team: Team['_id'] | { _id: Team['_id']; name: Team['name'] }
	status: 'pending' | 'accepted' | 'rejected' | 'read'
	createdAt: string
	updatedAt: string
}

export type NotificationFormPayload = Pick<User, 'email'> & {
	teamId?: Team['_id']
}

export type NotificationInviteResponse = Extract<Notification['status'], 'accepted' | 'rejected'>
export type NotificationMarkAsRead = Extract<Notification['status'], 'read'>
