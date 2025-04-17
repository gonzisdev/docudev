import { User } from './Auth'

export interface Team {
	_id: string
	name: string
	owner: User['_id']
	description: string
	collaborators: User['_id'][]
	docus: string[]
	createdAt: string
	updatedAt: string
}

export type TeamFormPayload = Pick<Team, 'name' | 'description'>
