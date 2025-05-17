export const endpoints = {
	createAccount: 'auth/create-account',
	login: 'auth/login',
	user: 'auth/user',
	recoverPassword: 'auth/recover-password',
	newPassword: 'auth/new-password',
	updateAccount: 'auth/update-account',
	deleteAccount: 'auth/delete',
	updatePlan: 'auth/update-plan',

	teams: 'teams',
	createTeam: 'teams/create-team',
	updateTeam: 'teams/update-team',
	deleteTeam: 'teams/delete-team',
	leaveTeam: 'teams/leave',
	removeCollaborator: 'teams/remove-collaborator',
	removeCollaborators: 'teams/remove-collaborators',

	docus: 'docus',
	createDocu: 'docus/create-docu',
	updateDocu: 'docus/update-docu',
	deleteDocu: 'docus/delete-docu',

	notifications: 'notifications',
	sendInvite: 'notifications/invite',
	respondInvite: 'notifications/respond',
	markAsRead: 'notifications/read',
	deleteNotification: 'notifications/delete',

	stats: 'stats',

	comments: 'comments'
}
