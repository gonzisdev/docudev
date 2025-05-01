import { User } from './Auth'

export interface Team {
	_id: string
	name: string
	owner: User['_id'] | User
	description: string
	collaborators: User[]
	docus: string[]
	createdAt: string
	updatedAt: string
}

export type TeamFormPayload = Pick<Team, 'name' | 'description'>
