import { User } from 'models/Auth'
import { Team } from 'models/Team'

export type DocuOwner = Pick<User, '_id' | 'name' | 'surname'>

export interface Docu {
	_id: string
	title: string
	content: string
	owner: DocuOwner
	team?: Team['_id']
	createdAt: Date
	updatedAt: Date
}

export type DocuFormPayload = Pick<Docu, 'title' | 'content' | 'team'>
