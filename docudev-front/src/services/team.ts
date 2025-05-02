import customFetch from './customFetch'
import { Team, TeamFormPayload } from 'models/Team'
import { endpoints } from './endpoints'

export const createTeamService = async (data: TeamFormPayload) => {
	return await customFetch<boolean>(endpoints.createTeam, {
		method: 'POST',
		bodyReq: data
	})
}

export const getTeamsService = async () => {
	return await customFetch<Team[]>(endpoints.teams)
}

export const getTeamService = async (teamId: Team['_id']) => {
	return await customFetch<Team>(`${endpoints.teams}/${teamId}`)
}

export const updateTeamService = async (teamId: Team['_id'], data: TeamFormPayload) => {
	return await customFetch<boolean>(`${endpoints.updateTeam}/${teamId}`, {
		method: 'PATCH',
		bodyReq: data
	})
}

export const leaveTeamService = async (teamId: Team['_id']) => {
	return await customFetch<boolean>(`${endpoints.leaveTeam}/${teamId}`, {
		method: 'PATCH'
	})
}

export const deleteTeamService = async (teamId: Team['_id']) => {
	return await customFetch<boolean>(`${endpoints.deleteTeam}/${teamId}`, {
		method: 'DELETE'
	})
}
