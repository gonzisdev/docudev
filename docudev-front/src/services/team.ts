import customFetch from './customFetch'
import { Team, TeamFormPayload } from 'models/Team'
import { endpoints } from './endpoints'
import { User } from 'models/Auth'

export const createTeamService = async (data: TeamFormPayload) => {
	return await customFetch<Team>(endpoints.createTeam, {
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

export const removeCollaboratorService = async (
	teamId: Team['_id'],
	collaboratorId: User['_id']
) => {
	return await customFetch<boolean>(`${endpoints.removeCollaborator}/${teamId}`, {
		method: 'PATCH',
		bodyReq: { collaboratorId }
	})
}

export const removeCollaboratorsService = async (
	teamId: Team['_id'],
	collaborators: User['_id'][]
) => {
	return await customFetch<boolean>(`${endpoints.removeCollaborators}/${teamId}`, {
		method: 'PATCH',
		bodyReq: { collaborators }
	})
}

export const deleteTeamService = async (teamId: Team['_id']) => {
	return await customFetch<boolean>(`${endpoints.deleteTeam}/${teamId}`, {
		method: 'DELETE'
	})
}
