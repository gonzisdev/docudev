import { useNavigate, useParams } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { EDIT_DOCU_URL } from 'constants/routes'
import { codeBlock } from 'constants/editor'
import { useTranslation } from 'react-i18next'
import useDocu from 'hooks/useDocu'
import DashboardLayout from 'layouts/DashboardLayout/DashboardLayout'
import Header from 'components/elements/Header/Header'
import Loading from 'components/elements/Loading/Loading'
import Button from 'components/elements/Button/Button'
import { useCreateBlockNote } from '@blocknote/react'
import { PartialBlock } from '@blocknote/core'
import { BlockNoteView } from '@blocknote/shadcn'
import '@blocknote/core/fonts/inter.css'
import '@blocknote/shadcn/style.css'
import './Docu.css'

const Docu = () => {
	const { docuId } = useParams()
	const { t } = useTranslation()
	const navigate = useNavigate()
	const { docu, isLoadingDocu } = useDocu({ docuId })

	const [initialContent, setInitialContent] = useState<PartialBlock[] | undefined>(undefined)

	const editor = useCreateBlockNote({
		initialContent,
		codeBlock
	})

	useEffect(() => {
		if (docu) {
			const parsedContent = JSON.parse(docu.content)
			setInitialContent(parsedContent)
			if (editor && parsedContent) {
				editor.replaceBlocks(editor.document, parsedContent)
			}
		}
	}, [docu, editor])

	return (
		<DashboardLayout>
			<div className='docu-header'>
				<Header title={'DOCU'} />
				<Button
					variant='secondary'
					className='docu-create-button'
					onClick={() => navigate(`${EDIT_DOCU_URL}/${docuId}`)}>
					{t('docus.update_docu')}
				</Button>
			</div>
			{docuId && isLoadingDocu ? (
				<Loading />
			) : (
				<div className='docu-container'>
					<h2>SUBTITULO</h2>
					{docu?.content && (
						<div className='docu-editor'>
							<BlockNoteView editor={editor} editable={false} />
						</div>
					)}
				</div>
			)}
		</DashboardLayout>
	)
}

export default Docu
