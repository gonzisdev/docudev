import { Team } from 'models/Team'

export const findTeamName = (teams: Team[], teamId: Team['_id']) => {
	if (!teams) return ''
	const team = teams.find((team) => team._id === teamId)
	return team ? team.name : ''
}
