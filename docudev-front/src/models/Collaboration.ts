import { PartialBlock } from '@blocknote/core'

export interface CollaborationOptions {
	docuId: string | undefined
	initialContent?: PartialBlock[]
	dictionary?: any
	codeBlock?: any
	username: string
	userImage?: string
}

export interface ActiveUser {
	id: string
	name: string
	color: string
	image?: string
}
