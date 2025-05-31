import { Navigate, useNavigate, useParams } from 'react-router-dom'
import { useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { DOCUS_URL, EDIT_DOCU_URL, TEAM_URL } from 'constants/routes'
import { codeBlock } from 'constants/editor'
import { TeamMember } from 'models/Docu'
import { useAuthStore } from 'stores/authStore'
import useDocu from 'hooks/useDocu'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Header from 'components/elements/Header/Header'
import Container from 'components/elements/Container/Container'
import Editor from 'components/elements/Editor/Editor'
import Loading from 'components/elements/Loading/Loading'
import Button from 'components/elements/Button/Button'
import CommentsPanel from '../CommentsPanel/CommentsPanel'
import DeleteDocuModal from '../Modals/DeleteDocuModal'
import RemoveFromTeamModal from '../Modals/RemoveFromTeamModal'
import { useCreateBlockNote } from '@blocknote/react'
import { PartialBlock } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/shadcn'
import { exportToPdf } from 'utils/pdf'
import { formatDateWithTime } from 'utils/dates'
import { EyeIcon } from 'assets/svgs'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/shadcn/style.css'
import './Docu.css'

const Docu = () => {
	const { docuId } = useParams()
	const { t } = useTranslation()
	const navigate = useNavigate()
	const editorRef = useRef(null)
	const { user } = useAuthStore()
	const {
		docu,
		isLoadingDocu,
		errorDocu,
		removeFromTeam,
		isRemovingFromTeam,
		deleteDocu,
		isDeletingDocu
	} = useDocu({ docuId })

	const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined>(undefined)
	const [isRemoveFromTeamModalOpen, setIsRemoveFromTeamModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)

	const editor = useCreateBlockNote({
		initialContent,
		codeBlock
	})

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

	const teamUsers = useMemo(() => {
		if (!docu?.team || typeof docu.team !== 'object') return []
		const users: TeamMember[] = []
		const owner = docu.team.owner
		if (owner && typeof owner === 'object') {
			users.push({
				_id: owner._id,
				name: owner.name,
				surname: owner.surname,
				image: owner.image
			})
		}
		if (Array.isArray(docu.team.collaborators)) {
			docu.team.collaborators.forEach((collab) => {
				if (collab && typeof collab === 'object') {
					users.push({
						_id: collab._id,
						name: collab.name,
						surname: collab.surname,
						image: collab.image
					})
				}
			})
		}
		return users.filter((user, index, self) => index === self.findIndex((u) => u._id === user._id))
	}, [docu?.team])

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
			{docuId && isLoadingDocu ? (
				<Loading />
			) : (
				<>
					<Header title={docu?.title}>
						<div className='docu-header-actions'>
							<Button variant='secondary' onClick={() => navigate(`${EDIT_DOCU_URL}/${docuId}`)}>
								{t('docus.update_docu')}
							</Button>
							<Button
								variant='secondary'
								onClick={() => exportToPdf(editorRef.current, docu?.title)}>
								{t('docus.export_pdf')}
							</Button>
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
												<span
													onClick={() =>
														typeof docu.team === 'object' &&
														'_id' in docu.team &&
														navigate(`${TEAM_URL}/${docu.team._id}`)
													}
													className='docu-team-name'
													style={{
														color: typeof docu.team === 'object' ? docu.team.color : undefined
													}}>
													{' '}
													{typeof docu.team === 'object' ? docu.team.name : ''}
												</span>
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
										<div className='docu-details-views'>
											<EyeIcon width={18} height={18} />
											<span>{docu.views}</span>
										</div>
									</div>
								</div>
							</div>
						)}
						{docu?.content && (
							<Editor
								editorRef={editorRef}
								commentsPanel={
									docuId && (
										<CommentsPanel
											docuId={docuId}
											teamUsers={teamUsers}
											currentUser={{
												_id: user!._id,
												name: user!.name,
												surname: user!.surname,
												image: user!.image
											}}
										/>
									)
								}>
								<BlockNoteView editor={editor} editable={false} />
							</Editor>
						)}
					</Container>
				</>
			)}
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

export default Docu
