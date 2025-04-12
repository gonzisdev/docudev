import { User, UserFormPayload, UserNewPasswordPayload } from '../models/Auth'
import customFetch from './customFetch'
import { endpoints } from './endpoints'

export const createAccountService = async (data: UserFormPayload) => {
	const response = await customFetch<boolean>(endpoints.createAccount, {
		method: 'POST',
		bodyReq: data,
		skipAuth: true
	})
	return response
}

export const loginService = async (data: UserFormPayload) => {
	const response = await customFetch<User>(endpoints.login, {
		method: 'POST',
		bodyReq: data,
		skipAuth: true
	})
	return response
}

export const recoverPasswordService = async (email: User['email']) => {
	const response = await customFetch<boolean>(endpoints.recoverPassword, {
		method: 'POST',
		bodyReq: { email },
		skipAuth: true
	})
	return response
}

export const newPasswordService = async (data: UserNewPasswordPayload) => {
	const response = await customFetch<boolean>(endpoints.newPassword, {
		method: 'PATCH',
		bodyReq: data,
		skipAuth: true
	})
	return response
}
