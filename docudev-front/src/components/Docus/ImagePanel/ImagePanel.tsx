import { toast } from 'sonner'
import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { DocuImage } from 'models/Docu'
import FileInput from 'components/elements/FileInput/FileInput'
import Loading from 'components/elements/Loading/Loading'
import './ImagePanel.css'

interface Props {
	docuImages: DocuImage[]
	uploadDocuImage: (args: { file: File }) => Promise<DocuImage>
	isUploadingDocuImage: boolean
	deleteDocuImage: (filename: DocuImage['filename']) => Promise<boolean>
}

const ImagePanel = ({
	docuImages,
	uploadDocuImage,
	isUploadingDocuImage,
	deleteDocuImage
}: Props) => {
	const { t } = useTranslation()
	const fileInputRef = useRef<HTMLInputElement>(null)

	const handleUpload = async (file: File) => {
		await uploadDocuImage({ file })
		if (fileInputRef.current) fileInputRef.current.value = ''
	}

	const handleDelete = async (filename: DocuImage['filename']) => await deleteDocuImage(filename)

	const handleCopy = (url: DocuImage['url']) => {
		navigator.clipboard.writeText(url)
		toast.success(t('forms.url_copied'))
	}

	return (
		<div className='image-panel'>
			<FileInput onChange={handleUpload} type='image/*' ref={fileInputRef} />
			<div className='images-list'>
				{docuImages.map((img) => (
					<div key={img.filename} className='image-item'>
						<img
							src={`${import.meta.env.VITE_API_URL}${img.url}`}
							alt='Docu image'
							title='Click to copy URL'
							onClick={() => handleCopy(`${import.meta.env.VITE_API_URL}${img.url}`)}
						/>
						<button onClick={() => handleDelete(img.filename)}>&times;</button>
					</div>
				))}
				<div className='loading-item '>{isUploadingDocuImage && <Loading />}</div>
			</div>
		</div>
	)
}

export default ImagePanel
