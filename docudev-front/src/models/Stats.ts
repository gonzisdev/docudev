import { Team } from './Team'
import { Docu } from './Docu'
import { User } from './Auth'

export interface GeneralStats {
	totalTeams: number
	totalDocus: number
	ownedDocus: number
	teamDocus: number
}

export interface TeamWithMemberCount {
	_id: Team['_id']
	name: Team['name']
	color: Team['color']
	memberCount: number
}

export interface TeamWithDocuCount {
	_id: Team['_id']
	name: Team['name']
	color: Team['color']
	docuCount: number
}

export interface ActiveUser {
	_id: User['_id']
	name: User['name']
	surname: User['surname']
	docuCount: number
}

export interface Stats {
	generalStats: GeneralStats
	teamsWithMostMembers: TeamWithMemberCount[]
	teamsWithMostDocus: TeamWithDocuCount[]
	mostActiveUsers: ActiveUser[]
	lastUpdatedDocus: Docu[]
	lastCreatedDocus: Docu[]
	mostViewedDocus: Docu[]
}
