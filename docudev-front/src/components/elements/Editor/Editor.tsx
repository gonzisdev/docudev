import { useRef } from 'react'
import './Editor.css'

interface Props {
	children: React.ReactNode
	editorRef?: React.RefObject<HTMLDivElement | null>
	commentsPanel?: React.ReactNode
	imagesPanel?: React.ReactNode
}

const Editor = ({ children, editorRef, commentsPanel, imagesPanel }: Props) => {
	const editorContainerRef = useRef<HTMLDivElement>(null)
	const defaultEditorRef = useRef<HTMLDivElement>(null)
	const finalEditorRef = editorRef || defaultEditorRef

	return (
		<div className='editor-wrapper '>
			<div className='editor-container' ref={editorContainerRef}>
				<div className='docu-editor' ref={finalEditorRef}>
					{children}
				</div>
			</div>
			<div className='side-panels'>
				{imagesPanel}
				{commentsPanel}
			</div>
		</div>
	)
}

export default Editor
