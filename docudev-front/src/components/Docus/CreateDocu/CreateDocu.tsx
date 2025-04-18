import { useTranslation } from 'react-i18next'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Header from 'components/elements/Header/Header'
import { useCreateBlockNote } from '@blocknote/react'
import { BlockNoteView } from '@blocknote/shadcn'
import { es } from '@blocknote/core/locales'
import { en } from '@blocknote/core/locales'
import { codeBlock } from 'constants/editor'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/shadcn/style.css'
import './CreateDocu.css'

const CreateDocu = () => {
	const { t, i18n } = useTranslation()
	const dictionary = i18n.language.startsWith('es') ? es : en

	const editor = useCreateBlockNote({
		dictionary,
		codeBlock
	})

	return (
		<DashboardLayout>
			<div className='create_docu-header'>
				<Header title={t('create_docu.title')} />
			</div>
			<div className='create_docu-container'>
				<h2>{t('create_docu.subtitle')}</h2>
				<div className='create_docu-editor'>
					<BlockNoteView editor={editor} />
				</div>
			</div>
		</DashboardLayout>
	)
}

export default CreateDocu
