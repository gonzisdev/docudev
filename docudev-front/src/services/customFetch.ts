import createApiInstance from './api'
import { AxiosProgressEvent } from 'axios'

interface Options {
	method?: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'
	bodyReq?: object | FormData
	params?: Record<string, string | number>
	headers?: Record<string, string>
	hideHeaders?: boolean

	baseURL?: string
	onUploadProgress?: (progressEvent: AxiosProgressEvent) => void
}

export default async function customFetch<T>(
	URL: string,
	{
		baseURL,
		method = 'GET',
		bodyReq,
		params,
		headers = {},
		hideHeaders = false,
		onUploadProgress
	}: Options = {}
): Promise<T> {
	let contentType = headers['Content-Type'] || 'application/json'
	if (bodyReq instanceof FormData) {
		contentType = 'multipart/form-data'
	}
	headers = {
		'Content-Type': contentType,
		...headers
	}

	const api = createApiInstance(baseURL)

	const config = {
		method,
		headers: hideHeaders ? {} : headers,
		data: bodyReq,
		params,
		onUploadProgress: contentType === 'multipart/form-data' ? onUploadProgress : undefined
	}

	return await api(URL, config)
}
