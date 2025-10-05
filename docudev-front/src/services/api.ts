import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios'
import { useAuthStore } from '../stores/authStore'
import { endpoints } from './endpoints'

declare module 'axios' {
	interface InternalAxiosRequestConfig {
		skipAuth?: boolean
	}
}

const BASE_URL = import.meta.env.VITE_API_URL || 'https://YOUR-URL/'

const createApiInstance = (baseURL: string = BASE_URL): AxiosInstance => {
	const api: AxiosInstance = axios.create({ baseURL, withCredentials: true })

	// Request interceptor
	api.interceptors.request.use(
		(config: InternalAxiosRequestConfig) => {
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
		async (error) => {
			const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }
			if (
				error.response?.status === 401 &&
				error.response?.data?.shouldRefresh &&
				!originalRequest._retry &&
				!originalRequest.url?.includes(endpoints.refreshToken)
			) {
				originalRequest._retry = true
				const authStore = useAuthStore.getState()
				try {
					await authStore.refreshToken()
					return api(originalRequest)
				} catch (refreshError) {
					const authStore = useAuthStore.getState()
					authStore.logout()
					return Promise.reject(refreshError)
				}
			}

			if (
				error.response?.status === 401 &&
				error.response?.data?.invalidToken &&
				!error.response?.data?.shouldRefresh
			) {
				const authStore = useAuthStore.getState()
				authStore.logout()
			}

			const errorMessage =
				error.response?.data?.error || error.response?.data || error.message || 'Unknown error'

			return Promise.reject(new Error(errorMessage))
		}
	)

	return api
}
export default createApiInstance
