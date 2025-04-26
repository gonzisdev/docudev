import { useEffect, useState } from 'react'
import { ActiveUser, CollaborationOptions } from 'models/Collaboration'
import * as Y from 'yjs'
import { WebsocketProvider } from 'y-websocket'
import { IndexeddbPersistence } from 'y-indexeddb'
import { useCreateBlockNote } from '@blocknote/react'
import { v4 as uuidv4 } from 'uuid'
import { getRandomColor } from 'utils/getRandomColor'

export const useCollaborativeEditor = ({
	docuId,
	initialContent,
	dictionary,
	codeBlock,
	username,
	userImage
}: CollaborationOptions) => {
	const [doc] = useState<Y.Doc>(() => new Y.Doc())
	const [provider, setProvider] = useState<WebsocketProvider | null>(null)
	const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
	const [isConnected, setIsConnected] = useState(false)
	const [isLoading, setIsLoading] = useState(true)
	const [userId] = useState(() => uuidv4())
	const [userColor] = useState(() => getRandomColor())

	const editor = useCreateBlockNote({
		collaboration:
			docuId && provider
				? {
						provider,
						fragment: doc.getXmlFragment('document'),
						user: {
							name: username,
							color: userColor
						},
						showCursorLabels: 'always'
					}
				: undefined,
		initialContent: !docuId ? initialContent : undefined,
		dictionary,
		codeBlock
	})

	useEffect(() => {
		if (!docuId) {
			setIsLoading(false)
			return
		}
		const indexeddbProvider = new IndexeddbPersistence(`docudev-${docuId}`, doc)
		indexeddbProvider.on('synced', () => {
			setIsLoading(false)
		})

		const wsProvider = new WebsocketProvider(import.meta.env.VITE_WEBSOCKET_URL, docuId, doc, {
			connect: true
		})

		wsProvider.awareness.setLocalStateField('user', {
			id: userId,
			name: username,
			color: userColor,
			image: userImage
		})

		wsProvider.on(
			'status',
			({ status }: { status: 'connected' | 'disconnected' | 'connecting' }) => {
				setIsConnected(status === 'connected')
			}
		)

		wsProvider.awareness.on('change', () => {
			const users: ActiveUser[] = []
			wsProvider.awareness.getStates().forEach((state: any) => {
				if (state.user) {
					users.push({
						id: state.user.id,
						name: state.user.name,
						color: state.user.color,
						image: state.user.image
					})
				}
			})
			setActiveUsers(users)
		})

		setProvider(wsProvider)

		return () => {
			wsProvider.disconnect()
			indexeddbProvider.destroy()
		}
	}, [docuId, doc, userId, username, userColor])

	return {
		editor,
		isLoading,
		isConnected,
		activeUsers,
		provider
	}
}
