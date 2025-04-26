import customFetch from './customFetch'
import {
	User,
	UserFormPayload,
	UserNewPasswordPayload,
	UserAccountPayload,
	UserRegisterPayload
} from '../models/Auth'
import { endpoints } from './endpoints'

export const createAccountService = async (data: UserRegisterPayload) => {
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

export const updateAccountService = async (data: UserAccountPayload | FormData) => {
	const response = await customFetch<boolean>(endpoints.updateAccount, {
		method: 'PUT',
		bodyReq: data
	})
	return response
}

export const deleteAccountService = async () => {
	const response = await customFetch<boolean>(endpoints.deleteAccount, {
		method: 'DELETE'
	})
	return response
}

export const updatePlanService = async () => {
	const response = await customFetch<boolean>(endpoints.updatePlan, {
		method: 'PATCH'
	})
	return response
}

export const getUserService = async () => {
	const response = await customFetch<User>(endpoints.user)
	return response
}
