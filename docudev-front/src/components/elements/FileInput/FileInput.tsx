import { useRef, useState, forwardRef, useEffect } from 'react'
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

const FileInput = forwardRef<HTMLInputElement, Props>(({ id, onChange, type = 'image/*' }, ref) => {
	const { t } = useTranslation()
	const [fileUploaded, setFileUploaded] = useState<File | null>(null)
	const [isDragging, setIsDragging] = useState(false)

	const fileInputRef = useRef<HTMLInputElement>(null)
	const inputRef = (ref as React.RefObject<HTMLInputElement>) || fileInputRef

	const isImage = type === 'image/*'

	const onPressInputFile = () => {
		inputRef.current?.click()
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

	useEffect(() => {
		if (inputRef.current && inputRef.current.value === '') {
			setFileUploaded(null)
		}
	}, [inputRef.current?.value])

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
						? isImage
							? t('forms.drop_image_here')
							: t('forms.drop_file_here')
						: isImage
							? t('forms.attach_image')
							: t('forms.attach_file')}
			</p>
			<input
				id={id}
				className='file-input'
				type='file'
				ref={inputRef}
				onChange={handleFileChange}
				accept={type}
				aria-label={
					fileUploaded
						? fileUploaded.name
						: isImage
							? t('forms.attach_image')
							: t('forms.attach_file')
				}
			/>
			<Button type='button' variant='primary' onClick={onPressInputFile}>
				{fileUploaded
					? t('forms.change_file')
					: isImage
						? t('forms.search_image') || 'Buscar imagen'
						: t('forms.search_file')}
			</Button>
		</div>
	)
})

export default FileInput
