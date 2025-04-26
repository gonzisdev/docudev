import { useEffect, useRef, useState } from 'react'
import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DOCU_URL, DOCUS_URL } from 'constants/routes'
import { codeBlock } from 'constants/editor'
import { DocuFormPayload } from 'models/Docu'
import useDocu from 'hooks/useDocu'
import useTeams from 'hooks/useTeams'
import { useCollaborativeEditor } from 'hooks/useCollaborativeEditor'
import { useAuthStore } from 'stores/authStore'
import Header from 'components/elements/Header/Header'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Button from 'components/elements/Button/Button'
import DocuFormModal from '../Modals/DocuFormModal'
import DeleteDocuModal from '../Modals/DeleteDocuModal'
import Loading from 'components/elements/Loading/Loading'
import CollaborationStatus from './CollaborationStatus/CollaborationStatus'
import { BlockNoteView } from '@blocknote/shadcn'
import { PartialBlock } from '@blocknote/core'
import { es } from '@blocknote/core/locales'
import { en } from '@blocknote/core/locales'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { exportToPdf } from 'utils/pdf'
import { formatDateWithTime } from 'utils/dates'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/shadcn/style.css'
import './DocuEditor.css'

const DocuEditor = () => {
	const { t, i18n } = useTranslation()
	const navigate = useNavigate()
	const dictionary = i18n.language.startsWith('es') ? es : en
	const editorRef = useRef(null)
	const { docuId } = useParams()

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined>(undefined)

	const {
		docu,
		isLoadingDocu,
		errorDocu,
		createDocu,
		isCreatingDocu,
		updateDocu,
		isUpdatingDocu,
		deleteDocu,
		isDeletingDocu
	} = useDocu(docuId ? { docuId } : {})
	const { teams, isLoadingTeams } = useTeams()
	const { user } = useAuthStore()

	const findTeamName = (teamId: string) => {
		if (!teams) return ''
		const team = teams.find((team) => team._id === teamId)
		return team ? team.name : ''
	}

	const {
		editor,
		isLoading: isLoadingEditor,
		isConnected,
		activeUsers
	} = useCollaborativeEditor({
		docuId,
		initialContent,
		dictionary,
		codeBlock,
		username: `${user?.name} ${user?.surname}`,
		userImage: user?.image as string
	})

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

	const openModal = () => setIsModalOpen(true)
	const closeModal = () => {
		setIsModalOpen(false)
		methods.reset({
			title: docu?.title || '',
			content: docu?.content || '',
			team: docu?.team
		})
	}

	const openDeleteModal = () => setIsDeleteModalOpen(true)
	const closeDeleteModal = () => setIsDeleteModalOpen(false)

	const handleSubmit = async (data: DocuFormPayload) => {
		const editorContent = JSON.stringify(editor.document)
		const docuData = {
			...data,
			content: editorContent
		}
		if (docuId) {
			await updateDocu({ docuId, data: docuData })
			navigate(`${DOCU_URL}/${docuId}`)
		} else {
			await createDocu(docuData)
			navigate(DOCUS_URL)
		}
		closeModal()
	}

	const handleDeleteDocu = async () => {
		if (docuId) {
			await deleteDocu({ docuId })
			closeDeleteModal()
			navigate(DOCUS_URL)
		}
	}

	useEffect(() => {
		if (docu) {
			const parsedContent = JSON.parse(docu.content!)
			setInitialContent(parsedContent)
			if (editor && parsedContent) {
				editor.replaceBlocks(editor.document, parsedContent)
			}
			methods.reset({
				title: docu.title,
				content: docu.content,
				team: docu.team
			})
		}
	}, [docu, editor])

	if (errorDocu) return <Navigate to={DOCUS_URL} />

	return (
		<DashboardLayout>
			{(docuId && (isLoadingDocu || isLoadingTeams)) || isLoadingEditor || !editor ? (
				<Loading />
			) : (
				<>
					<div className='docu-editor-header'>
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
							}
						/>{' '}
						<div className='docu-editor-header-actions'>
							{docuId ? (
								<>
									<Button variant='primary' onClick={openModal}>
										{t('docus.save_docu')}
									</Button>
									<Button
										variant='secondary'
										onClick={() => exportToPdf(editorRef.current, docu?.title)}>
										{t('docus.export_pdf')}
									</Button>
									<Button variant='danger' onClick={openDeleteModal}>
										{t('docus.delete_docu')}
									</Button>
								</>
							) : (
								<Button variant='primary' onClick={openModal}>
									{t('docus.save_docu')}
								</Button>
							)}
						</div>
					</div>

					<div className='docu-editor-container'>
						{docu ? (
							<div className='docu-editor-details'>
								<div className='docu-editor-details-info'>
									<div className='docu-editor-details-left'>
										<span>
											<span>{t('docus.owner')}:</span> {docu.owner?.name} {docu.owner?.surname}
										</span>
										{docu.team && (
											<span>
												<span>{t('docus.team')}:</span>{' '}
												<span className='team-tag'>{findTeamName(docu.team)}</span>
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
									</div>
								</div>
								{docuId && (
									<CollaborationStatus isConnected={isConnected} activeUsers={activeUsers} />
								)}
							</div>
						) : (
							<h2>{t('create_docu.subtitle')}</h2>
						)}
						<div className='docu-editor-editor'>
							<BlockNoteView editor={editor} ref={editorRef} />
						</div>
					</div>
				</>
			)}
			<DocuFormModal
				isVisible={isModalOpen}
				toggleVisibility={closeModal}
				methods={methods}
				docuId={docuId}
				teams={teams}
				isLoading={isLoadingDocu}
				isSubmitting={isCreatingDocu || isUpdatingDocu}
				onSubmit={handleSubmit}
			/>
			<DeleteDocuModal
				isVisible={isDeleteModalOpen}
				toggleVisibility={closeDeleteModal}
				onConfirm={handleDeleteDocu}
				isLoading={isDeletingDocu}
			/>
		</DashboardLayout>
	)
}

export default DocuEditor
