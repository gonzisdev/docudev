import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '../stores/authStore'

declare module 'axios' {
	interface InternalAxiosRequestConfig {
		skipAuth?: boolean
	}
}

const BASE_URL = import.meta.env.VITE_API_URL || 'https://YOUR-URL/'

const createApiInstance = (baseURL: string = BASE_URL): AxiosInstance => {
	const api: AxiosInstance = axios.create({ baseURL })

	// Request interceptor
	api.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
			if (config.skipAuth) {
				delete config.headers.Authorization
				return config
			}

			const token = useAuthStore.getState().user?.token
			if (token) {
				config.headers.Authorization = `Bearer ${token}`
			}
			return config
		},
		(error) => Promise.reject(error)
	)

	// Response interceptor
	api.interceptors.response.use(
		(response: AxiosResponse) => {
			const contentType = response.headers['content-type']
			if (contentType && contentType.includes('application/json')) {
				if (response.data?.error) {
					return Promise.reject(new Error(response.data.error))
				}
				return response.data
			}
			return response.data
		},
		(error) => {
			if (error.response && error.response.status === 401 && error.response.data?.tokenExpired) {
				const authStore = useAuthStore.getState()
				authStore.logout()
			} else if (useAuthStore.getState().isAuthenticated) {
				useAuthStore.getState().refreshUser()
			}
			const errorMessage =
				error.response?.data?.error || error.response?.data || error.message || 'Unknown error'
			return Promise.reject(new Error(errorMessage))
		}
	)

	return api
}

export default createApiInstance
