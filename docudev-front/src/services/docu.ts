import customFetch from './customFetch'
import { Docu, DocuFormPayload, DocusParams, DocusResponse } from 'models/Docu'
import { endpoints } from './endpoints'

export const createDocuService = async (data: DocuFormPayload) => {
	const response = await customFetch<boolean>(endpoints.createDocu, {
		method: 'POST',
		bodyReq: data
	})
	return response
}

export const getDocusService = async (params?: DocusParams) => {
	const response = await customFetch<DocusResponse>(endpoints.docus, {
		params: params ? { ...params } : undefined
	})
	return response
}

export const getDocuService = async (docuId: Docu['_id']) => {
	const response = await customFetch<Docu>(`${endpoints.docus}/${docuId}`)
	return response
}

export const updateDocuService = async (docuId: Docu['_id'], data: DocuFormPayload) => {
	const response = await customFetch<boolean>(`${endpoints.updateDocu}/${docuId}`, {
		method: 'PUT',
		bodyReq: data
	})
	return response
}

export const deleteDocuService = async (docuId: Docu['_id']) => {
	const response = await customFetch<boolean>(`${endpoints.deleteDocu}/${docuId}`, {
		method: 'DELETE'
	})
	return response
}
