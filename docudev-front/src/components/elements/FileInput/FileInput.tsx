import { useRef, useState } from 'react'
import { FileArrowUpIcon, FileIcon } from 'assets/svgs'
import { useTranslation } from 'react-i18next'
import Button from 'components/elements/Button/Button'
import DOMPurify from 'dompurify'
import './FileInput.css'

interface Props {
	id?: string
	onChange: (file: File) => void
	type?: '.jpg' | '.png' | '.pdf'
}

const FileInput = ({ id, onChange, type = '.pdf' }: Props) => {
	const [fileUploaded, setFileUploaded] = useState<File | null>(null)
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

	return (
		<div className={`file-input-wrapper ${fileUploaded ? 'uploaded' : ''}`}>
			{fileUploaded ? <FileIcon /> : <FileArrowUpIcon />}
			<p>{fileUploaded ? DOMPurify.sanitize(fileUploaded.name) : t('forms.attach_file')}</p>
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
