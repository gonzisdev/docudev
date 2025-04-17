import { ReactNode } from 'react'
import { useTranslation } from 'react-i18next'
import Modal from 'components/elements/Modal/Modal'
import Button from 'components/elements/Button/Button'
import './ConfirmationModal.css'

interface Props {
	isVisible: boolean
	toggleVisibility: () => void
	title: string
	message: ReactNode
	confirmText?: string
	cancelText?: string
	onConfirm: () => void
	onCancel?: () => void
	isLoading?: boolean
}

const ConfirmationModal = ({
	isVisible,
	toggleVisibility,
	title,
	message,
	confirmText,
	cancelText,
	onConfirm,
	onCancel,
	isLoading = false
}: Props) => {
	const { t } = useTranslation()

	const handleCancel = () => {
		if (onCancel) {
			onCancel()
		}
		toggleVisibility()
	}

	const handleConfirm = () => {
		onConfirm()
	}

	return (
		<Modal
			isVisible={isVisible}
			toggleVisibility={toggleVisibility}
			title={title}
			footer={
				<>
					<Button variant='secondary' onClick={handleCancel} disabled={isLoading}>
						{cancelText || t('general.cancel')}
					</Button>
					<Button variant='primary' onClick={handleConfirm} loading={isLoading}>
						{confirmText || t('general.confirm')}
					</Button>
				</>
			}>
			<div className='confirmation-modal-content'>
				<div className='confirmation-modal-message'>{message}</div>
			</div>
		</Modal>
	)
}

export default ConfirmationModal
