import { Docu } from './Docu'
import { User } from './Auth'

export interface Comment {
	_id: string
	content: string
	docu: Docu['_id']
	author:
		| User['_id']
		| {
				_id: User['_id']
				name: User['name']
				surname: User['surname']
				image?: User['image']
		  }
	mentions: Array<
		| User['_id']
		| {
				_id: User['_id']
				name: User['name']
				surname: User['surname']
				image?: User['image']
		  }
	>
	createdAt: string
	updatedAt: string
}

export interface CommentPayload {
	content: Comment['content']
	mentions?: Comment['mentions']
}
