import { useEffect, useState, useRef } from 'react'
import { useNavigate, useParams, Navigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { useForm } from 'react-hook-form'
import { DOCU_URL, DOCUS_URL, TEAM_URL } from 'constants/routes'
import { codeBlock } from 'constants/editor'
import { DocuFormPayload } from 'models/Docu'
import { ActiveUser } from 'models/Collaboration'
import useTeams from 'hooks/useTeams'
import useDocu from 'hooks/useDocu'
import { useAuthStore } from 'stores/authStore'
import { getRandomColor } from 'utils/collaboration'
import Header from 'components/elements/Header/Header'
import Container from 'components/elements/Container/Container'
import Editor from 'components/elements/Editor/Editor'
import Button from 'components/elements/Button/Button'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Loading from 'components/elements/Loading/Loading'
import DocuFormModal from '../Modals/DocuFormModal'
import RemoveFromTeamModal from '../Modals/RemoveFromTeamModal'
import DeleteDocuModal from '../Modals/DeleteDocuModal'
import CollaborationStatus from './CollaborationStatus/CollaborationStatus'
import { BlockNoteView } from '@blocknote/shadcn'
import { useBlockNote } from '@blocknote/react'
import { WebsocketProvider } from 'y-websocket'
import { es } from '@blocknote/core/locales'
import { en } from '@blocknote/core/locales'
import * as Y from 'yjs'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { formatDateWithTime } from 'utils/dates'
import { EyeIcon } from 'assets/svgs'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/shadcn/style.css'
import './DocuEditor.css'

const DocuEditor = () => {
	const { t, i18n } = useTranslation()
	const { docuId } = useParams()
	const navigate = useNavigate()
	const { user } = useAuthStore()
	const editorRef = useRef<HTMLDivElement>(null)

	const dictionary = i18n.language.startsWith('es') ? es : en

	const [doc] = useState(() => new Y.Doc())
	const [provider, setProvider] = useState<WebsocketProvider | null>(null)
	const [isSynced, setIsSynced] = useState(false)
	const [initialSyncDone, setInitialSyncDone] = useState(false)
	const [activeUsers, setActiveUsers] = useState<ActiveUser[]>([])
	const [editorReady, setEditorReady] = useState(false)
	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [isRemoveFromTeamModalOpen, setIsRemoveFromTeamModalOpen] = useState(false)
	const [localUser] = useState(() => ({
		id: user?._id,
		name: `${user?.name} ${user?.surname}`,
		color: getRandomColor(),
		image: user!.image
	}))

	const {
		docu,
		isLoadingDocu,
		errorDocu,
		createDocu,
		isCreatingDocu,
		updateDocu,
		isUpdatingDocu,
		removeFromTeam,
		isRemovingFromTeam,
		deleteDocu,
		isDeletingDocu
	} = useDocu(docuId ? { docuId } : {})
	const { teams, isLoadingTeams } = useTeams()

	useEffect(() => {
		if (!docuId) return
		const wsProvider = new WebsocketProvider(import.meta.env.VITE_WEBSOCKET_URL, docuId, doc)
		wsProvider.on('status', (event: any) => {
			if (event.status === 'connected') {
				setEditorReady(true)
			}
		})
		wsProvider.on('connection-error', () => {})
		wsProvider.on('connection-close', () => setEditorReady(false))
		wsProvider.awareness.setLocalStateField('user', {
			id: localUser.id,
			name: localUser.name,
			color: localUser.color,
			image: localUser.image
		})
		wsProvider.on('sync', () => setIsSynced(true))
		const updateActiveUsers = () => {
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
		}
		wsProvider.awareness.on('change', updateActiveUsers)
		setProvider(wsProvider)
		return () => {
			wsProvider.awareness.off('change', updateActiveUsers)
			wsProvider.disconnect()
			wsProvider.destroy()
			setProvider(null)
			setEditorReady(false)
		}
	}, [docuId, doc, localUser])

	const editor = useBlockNote(
		{
			collaboration:
				docuId && provider
					? {
							provider: provider,
							fragment: doc.getXmlFragment('document'),
							user: {
								name: localUser.name,
								color: localUser.color,
								...(localUser.image && { image: localUser.image }),
								...(localUser.id && { id: localUser.id })
							}
						}
					: undefined,
			initialContent: undefined,
			dictionary,
			tables: {
				splitCells: true,
				cellBackgroundColor: true,
				cellTextColor: true,
				headers: true
			},
			codeBlock
		},
		[provider, docuId, localUser, editorReady]
	)

	useEffect(() => {
		if (!editor || !isSynced || !docu?.content || initialSyncDone) return
		const fragment = doc.getXmlFragment('document')
		if (fragment.length === 0) {
			const parsedContent = JSON.parse(docu.content)
			editor.replaceBlocks(editor.document, parsedContent)
			setInitialSyncDone(true)
		}
	}, [editor, isSynced, docu, initialSyncDone, doc])

	const validationSchema = z.object({
		title: z
			.string()
			.min(1, t('docus.form.validations.title.required'))
			.min(2, t('docus.form.validations.title.min_length'))
			.max(50, t('docus.form.validations.title.max_length')),
		content: z.string().optional(),
		team: z.string().optional().nullable()
	})

	const methods = useForm<DocuFormPayload>({
		defaultValues: {
			title: '',
			content: '',
			team: undefined
		},
		resolver: zodResolver(validationSchema)
	})

	const handleSubmit = async (data: any) => {
		const editorContent = JSON.stringify(editor.document)
		const docuData = { ...data, content: editorContent }
		if (docuId) {
			await updateDocu(docuData)
			navigate(`${DOCU_URL}/${docuId}`)
		} else {
			await createDocu(docuData)
			docuData.team ? navigate(`${TEAM_URL}/${docuData.team}`) : navigate(DOCUS_URL)
		}
		setIsModalOpen(false)
	}

	const handleRemoveFromTeam = async () => {
		if (docuId) {
			await removeFromTeam()
			setIsRemoveFromTeamModalOpen(false)
			if (user?._id !== docu?.owner?._id) {
				navigate(DOCUS_URL)
			}
		}
	}

	const handleDeleteDocu = async () => {
		if (docuId) {
			await deleteDocu()
			setIsDeleteModalOpen(false)
			navigate(DOCUS_URL)
		}
	}

	useEffect(() => {
		if (docu && !isModalOpen) {
			const teamValue = docu.team
				? typeof docu.team === 'object' && '_id' in docu.team
					? docu.team._id
					: docu.team
				: ''
			methods.reset({
				title: docu.title || '',
				content: docu.content || '',
				team: teamValue
			})
		}
	}, [docu, methods])

	if (errorDocu) return <Navigate to={DOCUS_URL} />

	return (
		<DashboardLayout>
			{isLoadingDocu || isLoadingTeams || !editor ? (
				<Loading />
			) : (
				<>
					<Header
						title={
							docuId ? (
								<>
									{t('update_docu.title')}:{' '}
									<span className='docu-editor-header-title'>{docu?.title}</span>
								</>
							) : (
								t('create_docu.title')
							)
						}>
						<div className='docu-editor-header-actions'>
							<Button
								variant='primary'
								onClick={() => setIsModalOpen(true)}
								disabled={
									typeof docu?.team === 'object' &&
									typeof docu.team?.owner === 'object' &&
									docu.team.owner.role !== 'admin'
								}>
								{t('docus.save_docu')}
							</Button>
							{docuId && (
								<>
									<Button
										variant='danger'
										onClick={() => setIsRemoveFromTeamModalOpen(true)}
										disabled={!docu?.team}>
										{t('docus.remove_from_team')}
									</Button>
									<Button
										variant='danger'
										onClick={() => setIsDeleteModalOpen(true)}
										disabled={docu?.owner?._id !== user?._id}>
										{t('docus.delete_docu')}
									</Button>
								</>
							)}
						</div>
					</Header>
					<Container>
						{docu ? (
							<div className='docu-editor-details'>
								<div className='docu-editor-details-info'>
									<div className='docu-editor-details-left'>
										<span>
											<span>{t('docus.owner')}:</span> {docu.owner?.name} {docu.owner?.surname}
										</span>
										{docu.team && (
											<span>
												<span>{t('docus.team')}:</span>
												<span
													onClick={() =>
														typeof docu.team === 'object' &&
														'_id' in docu.team &&
														navigate(`${TEAM_URL}/${docu.team._id}`)
													}
													className='docu-editor-team-name'
													style={{
														color: typeof docu.team === 'object' ? docu.team.color : undefined
													}}>
													{' '}
													{typeof docu.team === 'object' ? docu.team.name : ''}
												</span>
											</span>
										)}
									</div>
									<div className='docu-editor-details-right'>
										<span>
											<span>{t('docus.created')}:</span> {formatDateWithTime(docu.createdAt)}
										</span>
										<span>
											<span>{t('docus.updated')}:</span> {formatDateWithTime(docu.updatedAt)}
										</span>
										<div className='docu-editor-details-views'>
											<EyeIcon width={18} height={18} />
											<span>{docu.views}</span>
										</div>
									</div>
								</div>
								{docuId && (
									<CollaborationStatus
										isConnected={provider?.wsconnected ?? false}
										activeUsers={activeUsers}
									/>
								)}
							</div>
						) : (
							<h2>{t('create_docu.subtitle')}</h2>
						)}
						<Editor editorRef={editorRef}>
							<BlockNoteView editor={editor} ref={editorRef} />
						</Editor>
					</Container>
				</>
			)}
			<DocuFormModal
				isVisible={isModalOpen}
				toggleVisibility={() => setIsModalOpen(false)}
				methods={methods}
				teams={teams}
				isLoading={isLoadingDocu}
				isSubmitting={isCreatingDocu || isUpdatingDocu}
				onSubmit={handleSubmit}
				docu={docu}
			/>
			{docu?.team && typeof docu.team === 'object' && (
				<RemoveFromTeamModal
					isVisible={isRemoveFromTeamModalOpen}
					toggleVisibility={() => setIsRemoveFromTeamModalOpen(false)}
					onConfirm={handleRemoveFromTeam}
					isLoading={isRemovingFromTeam}
					teamName={docu.team.name}
				/>
			)}
			<DeleteDocuModal
				isVisible={isDeleteModalOpen}
				toggleVisibility={() => setIsDeleteModalOpen(false)}
				onConfirm={handleDeleteDocu}
				isLoading={isDeletingDocu}
			/>
		</DashboardLayout>
	)
}

export default DocuEditor
