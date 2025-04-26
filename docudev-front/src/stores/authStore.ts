import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import {
	User,
	UserFormPayload,
	UserNewPasswordPayload,
	UserAccountPayload,
	UserRegisterPayload
} from '../models/Auth'
import {
	loginService,
	createAccountService,
	recoverPasswordService,
	newPasswordService,
	getUserService,
	updateAccountService,
	deleteAccountService,
	updatePlanService
} from '../services/auth'

interface AuthState {
	user: User | null
	setUser: (user: User) => void
	refreshUser: () => Promise<User | null>
	login: (data: UserFormPayload) => Promise<User | void>
	register: (data: UserRegisterPayload) => Promise<boolean>
	logout: () => void
	recoverPassword: (email: User['email']) => Promise<boolean>
	newPassword: (data: UserNewPasswordPayload) => Promise<boolean>
	updateAccount: (data: UserAccountPayload | FormData) => Promise<boolean>
	updatePlan: () => Promise<boolean>
	deleteAccount: () => Promise<boolean>
	isAuthenticated: boolean
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set, get) => {
			return {
				user: null,
				setUser: (user) =>
					set((state) => ({
						...state,
						user,
						isAuthenticated: !!user
					})),
				refreshUser: async () => {
					if (!get().isAuthenticated) return null
					const user = await getUserService()
					set((state) => ({
						...state,
						user,
						isAuthenticated: !!user
					}))
					return user
				},
				login: async (data: UserFormPayload) => {
					const store = get()
					const response = await loginService(data)
					if (response && response.token) {
						store.setUser(response)
						set({ isAuthenticated: true })
						return response
					}
				},
				register: async (data: UserRegisterPayload) => {
					return await createAccountService(data)
				},
				logout: () =>
					set((state) => {
						return {
							...state,
							user: null,
							isAuthenticated: false
						}
					}),
				recoverPassword: async (email: string) => {
					return await recoverPasswordService(email)
				},
				newPassword: async (data: UserNewPasswordPayload) => {
					return await newPasswordService(data)
				},
				updateAccount: async (data: UserAccountPayload | FormData) => {
					const result = await updateAccountService(data)
					if (result) {
						const user = await getUserService()
						set((state) => ({
							...state,
							user,
							isAuthenticated: !!user
						}))
					}
					return result
				},
				updatePlan: async () => {
					const result = await updatePlanService()
					if (result) {
						const user = await getUserService()
						set((state) => ({
							...state,
							user,
							isAuthenticated: !!user
						}))
					}
					return result
				},
				deleteAccount: async () => {
					const result = await deleteAccountService()
					if (result) {
						set((state) => ({
							...state,
							user: null,
							isAuthenticated: false
						}))
					}
					return result
				},
				isAuthenticated: false
			}
		},
		{
			name: 'auth',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				user: state.user,
				isAuthenticated: state.isAuthenticated
			})
		}
	)
)
