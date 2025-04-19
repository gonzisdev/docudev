import customFetch from './customFetch'
import { Team, TeamFormPayload } from 'models/Team'
import { endpoints } from './endpoints'

export const createTeamService = async (data: TeamFormPayload) => {
	const response = await customFetch<boolean>(endpoints.createTeam, {
		method: 'POST',
		bodyReq: data
	})
	return response
}

export const getTeamsService = async () => {
	const response = await customFetch<Team[]>(endpoints.teams)
	return response
}

export const getTeamService = async (teamId: Team['_id']) => {
	const response = await customFetch<Team>(`${endpoints.teams}/${teamId}`)
	return response
}

export const updateTeamService = async (teamId: Team['_id'], data: TeamFormPayload) => {
	const response = await customFetch<boolean>(`${endpoints.teams}/${teamId}`, {
		method: 'PATCH',
		bodyReq: data
	})
	return response
}

export const deleteTeamService = async (teamId: Team['_id']) => {
	const response = await customFetch<boolean>(`${endpoints.teams}/${teamId}`, {
		method: 'DELETE'
	})
	return response
}
