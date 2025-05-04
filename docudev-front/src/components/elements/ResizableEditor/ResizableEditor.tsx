import { useState, useRef, useEffect } from 'react'
import './ResizableEditor.css'
import { useTranslation } from 'react-i18next'

interface Props {
	children: React.ReactNode
	editorRef: React.RefObject<HTMLDivElement | null>
}

const ResizableEditor = ({ children, editorRef }: Props) => {
	const { t } = useTranslation()
	const editorContainerRef = useRef<HTMLDivElement>(null)

	const [editorSize, setEditorSize] = useState({ width: '100%' })
	const [isResizing, setIsResizing] = useState(false)

	const startResize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.preventDefault()
		const timer = setTimeout(() => {
			setIsResizing(true)
		}, 150)
		const handleMouseUp = () => {
			clearTimeout(timer)
			document.removeEventListener('mouseup', handleMouseUp)
		}
		document.addEventListener('mouseup', handleMouseUp, { once: true })
	}

	const stopResize = () => {
		setIsResizing(false)
	}

	const handleResize = (e: MouseEvent) => {
		if (!isResizing || !editorContainerRef.current) return
		const container = editorContainerRef.current
		const containerRect = container.getBoundingClientRect()
		const newWidth = Math.max(300, e.clientX - containerRect.left)
		const containerWidth = containerRect.width
		const widthPercentage = Math.min(100, Math.max(30, (newWidth / containerWidth) * 100))
		setEditorSize({
			width: `${widthPercentage}%`
		})
	}

	const resetEditorSize = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
		e.stopPropagation()
		setEditorSize({ width: '100%' })
	}

	useEffect(() => {
		if (isResizing) {
			document.addEventListener('mousemove', handleResize)
			document.addEventListener('mouseup', stopResize)
		}
		return () => {
			document.removeEventListener('mousemove', handleResize)
			document.removeEventListener('mouseup', stopResize)
		}
	}, [isResizing])

	return (
		<div className='editor-container' ref={editorContainerRef}>
			<div
				className='docu-editor'
				ref={editorRef}
				style={{
					width: editorSize.width
				}}>
				{children}
			</div>
			<div
				className='resize-handle'
				onClick={resetEditorSize}
				onMouseDown={startResize}
				title={t('docus.resize_editor_hint')}></div>
		</div>
	)
}

export default ResizableEditor
