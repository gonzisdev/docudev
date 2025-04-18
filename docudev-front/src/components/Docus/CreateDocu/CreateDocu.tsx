import { useTranslation } from 'react-i18next'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Header from 'components/elements/Header/Header'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import { es } from '@blocknote/core/locales'
import { en } from '@blocknote/core/locales'
import { codeBlock } from 'constants/editor'
import { jsPDF } from 'jspdf'
import html2canvas from 'html2canvas'
import { useRef } from 'react'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/shadcn/style.css'
import './CreateDocu.css'
import Button from 'components/elements/Button/Button'

const CreateDocu = () => {
	const { t, i18n } = useTranslation()
	const dictionary = i18n.language.startsWith('es') ? es : en
	const editorRef = useRef(null)

	const editor = useCreateBlockNote({
		dictionary,
		codeBlock
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

	return (
		<DashboardLayout>
			<div className='create-docu-header'>
				<Header title={t('create_docu.title')} />{' '}
				<Button onClick={exportToPdf}>Exportar a PDF</Button>
			</div>
			<div className='create_docu-container'>
				<h2>{t('create_docu.subtitle')}</h2>
				<div className='create_docu-editor'>
					<BlockNoteView editor={editor} ref={editorRef} />
				</div>
			</div>
		</DashboardLayout>
	)
}

export default CreateDocu
