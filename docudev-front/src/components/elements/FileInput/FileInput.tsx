import { useRef, useState } from 'react'
import { FileArrowUpIcon, FileIcon } from 'assets/svgs'
import { useTranslation } from 'react-i18next'
import Button from 'components/elements/Button/Button'
import DOMPurify from 'dompurify'
import './FileInput.css'

interface Props {
	id?: string
	onChange: (file: File) => void
	type?: '.jpg' | '.png' | '.pdf' | '.gif' | '.webp' | string
}

const FileInput = ({ id, onChange, type = 'image/*' }: Props) => {
	const [fileUploaded, setFileUploaded] = useState<File | null>(null)
	const [isDragging, setIsDragging] = useState(false)
	const { t } = useTranslation()

	const fileInputRef = useRef<HTMLInputElement>(null)

	const onPressInputFile = () => {
		fileInputRef.current?.click()
	}

	const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
		const file = event.target.files?.[0]
		if (file) {
			onChange(file)
			setFileUploaded(file)
		}
	}

	const handleDragEnter = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(true)
	}

	const handleDragLeave = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)
	}

	const handleDragOver = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		if (!isDragging) {
			setIsDragging(true)
		}
	}

	const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
		e.preventDefault()
		e.stopPropagation()
		setIsDragging(false)

		const files = e.dataTransfer.files
		if (files && files.length > 0) {
			const file = files[0]
			const fileType = file.type

			if (type === 'image/*' && !fileType.startsWith('image/')) {
				return
			}
			onChange(file)
			setFileUploaded(file)
		}
	}

	return (
		<div
			className={`file-input-wrapper ${fileUploaded ? 'uploaded' : ''} ${isDragging ? 'dragging' : ''}`}
			onDragEnter={handleDragEnter}
			onDragLeave={handleDragLeave}
			onDragOver={handleDragOver}
			onDrop={handleDrop}>
			{fileUploaded ? <FileIcon /> : <FileArrowUpIcon />}
			<p>
				{fileUploaded
					? DOMPurify.sanitize(fileUploaded.name)
					: isDragging
						? t('forms.drop_here') || 'Suelta aquí tu archivo'
						: t('forms.attach_file')}
			</p>
			<input
				id={id}
				className='file-input'
				type='file'
				ref={fileInputRef}
				onChange={handleFileChange}
				accept={type}
				aria-label={fileUploaded ? fileUploaded.name : t('forms.attach_file')}
			/>
			<Button type='button' variant='primary' onClick={onPressInputFile}>
				{fileUploaded ? t('forms.change_file') : t('forms.search_file')}
			</Button>
		</div>
	)
}

export default FileInput
