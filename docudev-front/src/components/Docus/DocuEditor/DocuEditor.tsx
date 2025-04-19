import { useEffect, useRef, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { DOCUS_URL, HOME_URL } from 'constants/routes'
import { codeBlock } from 'constants/editor'
import { DocuFormPayload } from 'models/Docu'
import { useAuthStore } from 'stores/authStore'
import useDocu from 'hooks/useDocu'
import useTeams from 'hooks/useTeams'
import useTeam from 'hooks/useTeam'
import Header from 'components/elements/Header/Header'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Button from 'components/elements/Button/Button'
import ConfirmationModal from 'components/elements/ConfirmationModal/ConfirmationModal'
import Modal from 'components/elements/Modal/Modal'
import Form from 'components/elements/Form/Form'
import FormSelect from 'components/elements/Form/FormSelect'
import Loading from 'components/elements/Loading/Loading'
import FormInput from 'components/elements/Form/FormInput'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import { PartialBlock } from '@blocknote/core'
import { es } from '@blocknote/core/locales'
import { en } from '@blocknote/core/locales'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/shadcn/style.css'
import './DocuEditor.css'

const DocuEditor = () => {
	const { t, i18n } = useTranslation()
	const navigate = useNavigate()
	const dictionary = i18n.language.startsWith('es') ? es : en
	const editorRef = useRef(null)
	const { docuId } = useParams()
	const { user } = useAuthStore()

	const [isModalOpen, setIsModalOpen] = useState(false)
	const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false)
	const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined>(undefined)

	const {
		docu,
		isLoadingDocu,
		createDocu,
		isCreatingDocu,
		updateDocu,
		isUpdatingDocu,
		deleteDocu,
		isDeletingDocu
	} = useDocu(docuId ? { docuId } : {})
	const { teams } = useTeams()
	const { team, isLoadingTeam } = useTeam(docu ? { teamId: docu.team } : {})

	const editor = useCreateBlockNote({
		dictionary,
		codeBlock,
		initialContent
	})

	const exportToPdf = async () => {
		if (!editorRef.current) return
		const editorElement = editorRef.current
		const canvas = await html2canvas(editorElement, {
			scale: 5,
			useCORS: true
		})
		const imgData = canvas.toDataURL('image/png')
		const imgWidth = 210
		const imgHeight = (canvas.height * imgWidth) / canvas.width
		const pdf = new jsPDF('p', 'mm', [imgWidth, imgHeight])
		pdf.addImage(imgData, 'PNG', 0, 0, imgWidth, imgHeight)
		pdf.save('documento.pdf')
	}

	const validationSchema = z.object({
		title: z
			.string()
			.min(1, t('docus.form.validations.title.required'))
			.min(2, t('docus.form.validations.title.min_length'))
			.max(50, t('docus.form.validations.title.max_length')),
		content: z.string().optional(),
		team: z.string().optional()
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
		} else {
			await createDocu(docuData)
			navigate(DOCUS_URL)
		}
		close()
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
			const parsedContent = JSON.parse(docu.content)
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

	useEffect(() => {
		if (!isLoadingDocu && docu && !isLoadingTeam && team && user) {
			const isOwner = docu.owner === user._id
			const isTeamMember = team.collaborators.some((collaborator) => collaborator === user._id)
			if (!isOwner && !isTeamMember) {
				navigate(HOME_URL)
			}
		}
	}, [docu, team, user, isLoadingDocu, isLoadingTeam])

	return (
		<DashboardLayout>
			<div className='docu-editor-header'>
				<Header title={docuId ? t('update_docu.title') : t('create_docu.title')} />{' '}
				<div className='docu-editor-header-actions'>
					<Button variant='secondary' onClick={exportToPdf}>
						{t('docus.export_pdf')}
					</Button>
					{docuId ? (
						<>
							<Button variant='primary' onClick={openModal}>
								{t('docus.save_docu')}
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
			{docuId && isLoadingDocu ? (
				<Loading />
			) : (
				<div className='docu-editor-container'>
					<h2>{docuId ? t('update_docu.subtitle') : t('create_docu.subtitle')}</h2>
					<div className='docu-editor-editor'>
						<BlockNoteView editor={editor} ref={editorRef} />
					</div>
				</div>
			)}
			<Modal
				isVisible={isModalOpen}
				toggleVisibility={closeModal}
				title={docuId ? t('update_docu.title') : t('create_docu.title')}>
				{docuId && isLoadingDocu ? (
					<Loading />
				) : (
					<Form methods={methods} onSubmit={methods.handleSubmit(handleSubmit)}>
						<FormInput
							id='title'
							label={t('docus.form.title')}
							placeholder={t('docus.form.title_placeholder')}
							required
						/>
						{teams && teams.length > 0 && (
							<FormSelect
								id='team'
								label={t('docus.form.team')}
								placeholder={t('docus.form.team_placeholder')}
								options={teams.map((team) => ({
									value: team._id,
									label: team.name
								}))}
								isClearable={true}
							/>
						)}
						<footer>
							<Button
								type='submit'
								variant='secondary'
								loading={isCreatingDocu || isUpdatingDocu}
								fullWidth>
								{docuId ? t('update_docu.title') : t('create_docu.title')}
							</Button>
						</footer>
					</Form>
				)}
			</Modal>
			<ConfirmationModal
				isVisible={isDeleteModalOpen}
				toggleVisibility={closeDeleteModal}
				title={t('delete_docu.title')}
				message={t('delete_docu.description')}
				onConfirm={handleDeleteDocu}
				isLoading={isDeletingDocu}
			/>
		</DashboardLayout>
	)
}

export default DocuEditor
