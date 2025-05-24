import { Team } from 'models/Team'
import { User } from 'models/Auth'
import { Docu } from './Docu'

export interface Notification {
	_id: string
	type: 'team-invite' | 'invite-accepted' | 'invite-rejected' | 'mention'
	sender: User['_id'] | { _id: User['_id']; name: User['name']; surname: User['surname'] }
	receiver: User['_id']
	team?: Team['_id'] | { _id: Team['_id']; name: Team['name'] }
	docu?: Docu['_id'] | Docu
	comment?: string
	status: 'pending' | 'accepted' | 'rejected' | 'read'
	createdAt: string
	updatedAt: string
}

export type NotificationFormPayload = Pick<User, 'email'> & {
	teamId?: Team['_id']
}

export type NotificationInviteResponse = Extract<Notification['status'], 'accepted' | 'rejected'>
export type NotificationMarkAsRead = Extract<Notification['status'], 'read'>
