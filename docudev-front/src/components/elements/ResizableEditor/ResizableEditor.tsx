import { useRef } from 'react'

import './ResizableEditor.css'

interface Props {
	children: React.ReactNode
	editorRef?: React.RefObject<HTMLDivElement | null>
}

const ResizableEditor = ({ children, editorRef }: Props) => {
	const editorContainerRef = useRef<HTMLDivElement>(null)
	const defaultEditorRef = useRef<HTMLDivElement>(null)
	const finalEditorRef = editorRef || defaultEditorRef

	return (
		<div className='editor-container' ref={editorContainerRef}>
			<div className='docu-editor' ref={finalEditorRef}>
				{children}
			</div>
		</div>
	)
}

export default ResizableEditor
