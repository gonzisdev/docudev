import { User } from 'models/Auth'
import { Team } from 'models/Team'

export type DocuOwner = Pick<User, '_id' | 'name' | 'surname' | 'image'>
export type TeamMember = Pick<User, '_id' | 'name' | 'surname' | 'image' | 'role'>

export interface Docu {
	_id: string
	title: string
	content?: string
	owner: DocuOwner
	team?:
		| Team['_id']
		| {
				_id: Team['_id']
				name: Team['name']
				color: Team['color']
				owner: TeamMember | User['_id']
				collaborators?: TeamMember[] | User['_id'][]
		  }
	views: number
	createdAt: Date
	updatedAt: Date
}

export interface DocusResponse {
	data: Docu[]
	pagination: {
		total: number
		page: number
		limit: number
		pages: number
	}
}

export type DocuFormPayload = Pick<Docu, 'title' | 'content' | 'team'>

export interface DocusParams {
	page?: number
	limit?: number
	search?: string
	teamId?: string
	ownerId?: string
	sortField?: string
	sortDirection?: string
}

export interface GroupedDocus {
	withTeam: Record<string, Docu[]>
	withoutTeam: Docu[]
}
