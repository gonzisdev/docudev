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
	updatePlanService,
	logoutService,
	refreshTokenService
} from '../services/auth'
import { clearAllStores } from 'utils/cleanStores'

interface AuthState {
	user: User | null
	setUser: (user: User | null) => void
	refreshUser: () => Promise<User | null>
	refreshToken: () => Promise<boolean>
	login: (data: UserFormPayload) => Promise<User | void>
	register: (data: UserRegisterPayload) => Promise<boolean>
	logout: () => Promise<boolean>
	recoverPassword: (email: User['email']) => Promise<boolean>
	newPassword: (data: UserNewPasswordPayload) => Promise<boolean>
	updateAccount: (data: UserAccountPayload | FormData) => Promise<boolean>
	updatePlan: () => Promise<boolean>
	deleteAccount: () => Promise<boolean>
}

export const useAuthStore = create<AuthState>()(
	persist(
		(set) => ({
			user: null,
			setUser: (user) => set({ user }),
			refreshUser: async () => {
				try {
					const user = await getUserService()
					set({ user })
					return user
				} catch {
					set({ user: null })
					return null
				}
			},
			refreshToken: async () => {
				try {
					await refreshTokenService()
					return true
				} catch {
					return false
				}
			},
			login: async (data: UserFormPayload) => {
				const user = await loginService(data)
				if (user) {
					set({ user })
					return user
				}
			},
			register: async (data: UserRegisterPayload) => {
				return await createAccountService(data)
			},
			logout: async () => {
				await logoutService()
				clearAllStores()
				set({ user: null })
				return true
			},
			recoverPassword: async (email: User['email']) => {
				return await recoverPasswordService(email)
			},
			newPassword: async (data: UserNewPasswordPayload) => {
				return await newPasswordService(data)
			},
			updateAccount: async (data: UserAccountPayload | FormData) => {
				const result = await updateAccountService(data)
				if (result) {
					const user = await getUserService()
					set({ user })
				}
				return result
			},
			updatePlan: async () => {
				const result = await updatePlanService()
				if (result) {
					const user = await getUserService()
					set({ user })
				}
				return result
			},
			deleteAccount: async () => {
				const result = await deleteAccountService()
				if (result) {
					set({ user: null })
				}
				return result
			}
		}),
		{
			name: 'auth',
			storage: createJSONStorage(() => localStorage),
			partialize: (state) => ({
				user: state.user
			})
		}
	)
)
