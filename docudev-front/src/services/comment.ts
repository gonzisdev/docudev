import customFetch from './customFetch'
import { Docu } from 'models/Docu'
import { endpoints } from './endpoints'
import { Comment, CommentPayload } from 'models/Comment'

export const createCommentService = async (docuId: Docu['_id'], data: CommentPayload) => {
	return await customFetch<Comment>(`${endpoints.comments}/${docuId}`, {
		method: 'POST',
		bodyReq: data
	})
}

export const getCommentsService = async (docuId: Docu['_id']) => {
	return await customFetch<Comment[]>(`${endpoints.comments}/${docuId}`)
}

export const deleteCommentService = async (docuId: Docu['_id'], commentId: Comment['_id']) => {
	return await customFetch<boolean>(`${endpoints.comments}/${docuId}/${commentId}`, {
		method: 'DELETE'
	})
}
