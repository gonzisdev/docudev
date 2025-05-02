import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useRef, useState } from 'react'
import { DOCUS_URL, EDIT_DOCU_URL } from 'constants/routes'
import { codeBlock } from 'constants/editor'
import { useTranslation } from 'react-i18next'
import useDocu from 'hooks/useDocu'
import useTeam from 'hooks/useTeam'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Header from 'components/elements/Header/Header'
import Container from 'components/elements/Container/Container'
import Loading from 'components/elements/Loading/Loading'
import Button from 'components/elements/Button/Button'
import DeleteDocuModal from '../Modals/DeleteDocuModal'
import { useCreateBlockNote } from '@blocknote/react'
import { PartialBlock } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/shadcn'
import { exportToPdf } from 'utils/pdf'
import { formatDateWithTime } from 'utils/dates'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/shadcn/style.css'
import './Docu.css'

const Docu = () => {
	const { docuId } = useParams()
	const { t } = useTranslation()
	const navigate = useNavigate()
	const editorRef = useRef(null)
	const { docu, isLoadingDocu, errorDocu, deleteDocu, isDeletingDocu } = useDocu({ docuId })
	const { team, isLoadingTeam } = useTeam({ teamId: docu?.team })

	const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined>(undefined)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	const editor = useCreateBlockNote({
		initialContent,
		codeBlock
	})

	const openDeleteModal = () => setIsDeleteModalOpen(true)
	const closeDeleteModal = () => setIsDeleteModalOpen(false)

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
		}
	}, [docu, editor])

	if (errorDocu) return <Navigate to={DOCUS_URL} />

	return (
		<DashboardLayout>
			{docuId && (isLoadingDocu || isLoadingTeam) ? (
				<Loading />
			) : (
				<>
					<Header title={docu?.title}>
						{' '}
						<div className='docu-header-actions'>
							<Button variant='secondary' onClick={() => navigate(`${EDIT_DOCU_URL}/${docuId}`)}>
								{t('docus.update_docu')}
							</Button>
							<Button
								variant='secondary'
								onClick={() => exportToPdf(editorRef.current, docu?.title)}>
								{t('docus.export_pdf')}
							</Button>
							<Button variant='danger' onClick={openDeleteModal}>
								{t('docus.delete_docu')}
							</Button>
						</div>
					</Header>
					<Container>
						{docu && (
							<div className='docu-details'>
								<div className='docu-details-info'>
									<div className='docu-details-left'>
										<span>
											<span>{t('docus.owner')}:</span> {docu.owner?.name} {docu.owner?.surname}
										</span>
										{docu.team && (
											<span>
												<span>{t('docus.team')}:</span>{' '}
												<span className='team-tag'>{team?.name}</span>
											</span>
										)}
									</div>
									<div className='docu-details-right'>
										<span>
											<span>{t('docus.created')}:</span> {formatDateWithTime(docu.createdAt)}
										</span>
										<span>
											<span>{t('docus.updated')}:</span> {formatDateWithTime(docu.updatedAt)}
										</span>
									</div>
								</div>
							</div>
						)}
						{docu?.content && (
							<div className='docu-editor'>
								<BlockNoteView editor={editor} editable={false} ref={editorRef} />
							</div>
						)}
					</Container>
				</>
			)}
			<DeleteDocuModal
				isVisible={isDeleteModalOpen}
				toggleVisibility={closeDeleteModal}
				onConfirm={handleDeleteDocu}
				isLoading={isDeletingDocu}
			/>
		</DashboardLayout>
	)
}

export default Docu
