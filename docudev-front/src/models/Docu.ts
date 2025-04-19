import { User } from 'models/Auth'
import { Team } from 'models/Team'

export interface Docu {
	_id: string
	title: string
	content: string
	owner: User['_id']
	team?: Team['_id']
	createdAt: Date
	updatedAt: Date
}

export type DocuFormPayload = Pick<Docu, 'title' | 'content' | 'team'>
