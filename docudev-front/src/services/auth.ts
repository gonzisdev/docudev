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
	return await customFetch<boolean>(endpoints.createAccount, {
		method: 'POST',
		bodyReq: data,
		skipAuth: true
	})
}

export const loginService = async (data: UserFormPayload) => {
	return await customFetch<User>(endpoints.login, {
		method: 'POST',
		bodyReq: data,
		skipAuth: true
	})
}

export const recoverPasswordService = async (email: User['email']) => {
	return await customFetch<boolean>(endpoints.recoverPassword, {
		method: 'POST',
		bodyReq: { email },
		skipAuth: true
	})
}

export const newPasswordService = async (data: UserNewPasswordPayload) => {
	return await customFetch<boolean>(endpoints.newPassword, {
		method: 'PATCH',
		bodyReq: data,
		skipAuth: true
	})
}

export const updateAccountService = async (data: UserAccountPayload | FormData) => {
	return await customFetch<boolean>(endpoints.updateAccount, {
		method: 'PUT',
		bodyReq: data
	})
}

export const deleteAccountService = async () => {
	return await customFetch<boolean>(endpoints.deleteAccount, {
		method: 'DELETE'
	})
}

export const updatePlanService = async () => {
	return await customFetch<boolean>(endpoints.updatePlan, {
		method: 'PATCH'
	})
}

export const getUserService = async () => {
	return await customFetch<User>(endpoints.user)
}
