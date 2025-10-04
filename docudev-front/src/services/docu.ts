import customFetch from './customFetch'
import {
	Docu,
	DocuCount,
	DocuFormPayload,
	DocuImage,
	DocusParams,
	DocusResponse
} from 'models/Docu'
import { Team } from 'models/Team'
import { endpoints } from './endpoints'

export const createDocuService = async (data: DocuFormPayload) => {
	return await customFetch<boolean>(endpoints.createDocu, {
		method: 'POST',
		bodyReq: data
	})
}

export const getDocusService = async (params?: DocusParams) => {
	return await customFetch<DocusResponse>(endpoints.docus, {
		params: params ? { ...params } : undefined
	})
}

export const getDocuCountsService = async (teamId?: Team['_id']) => {
	return await customFetch<DocuCount>(`${endpoints.docuCounts}`, {
		params: teamId ? { teamId } : undefined
	})
}

export const getDocuService = async (docuId: Docu['_id']) => {
	return await customFetch<Docu>(`${endpoints.docus}/${docuId}`)
}

export const updateDocuService = async (docuId: Docu['_id'], data: DocuFormPayload) => {
	return await customFetch<boolean>(`${endpoints.updateDocu}/${docuId}`, {
		method: 'PUT',
		bodyReq: data
	})
}

export const removeDocuFromTeamService = async (docuId: Docu['_id']) => {
	return await customFetch<boolean>(`${endpoints.removeDocuFromTeam}/${docuId}`, {
		method: 'PATCH'
	})
}

export const deleteDocuService = async (docuId: Docu['_id']) => {
	return await customFetch<boolean>(`${endpoints.deleteDocu}/${docuId}`, {
		method: 'DELETE'
	})
}

export const uploadDocuImageService = async (docuId: Docu['_id'], file: File) => {
	const formData = new FormData()
	formData.append('image', file)
	return await customFetch<DocuImage>(`${endpoints.docus}/${docuId}/images`, {
		method: 'POST',
		bodyReq: formData
	})
}

export const getDocuImagesService = async (docuId: Docu['_id']) => {
	return await customFetch<DocuImage[]>(`${endpoints.docus}/${docuId}/images`)
}

export const deleteDocuImageService = async (
	docuId: Docu['_id'],
	filename: DocuImage['filename']
) => {
	return await customFetch<boolean>(`${endpoints.docus}/${docuId}/images/${filename}`, {
		method: 'DELETE'
	})
}
