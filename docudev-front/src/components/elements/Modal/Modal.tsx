import React, { ReactNode, useEffect, useRef } from 'react'
import './Modal.css'
import Button from 'components/elements/Button/Button'

interface ModalProps {
	isVisible: boolean
	toggleVisibility: () => void
	title: string
	children: ReactNode
	footer?: ReactNode
	size?: 'small' | 'medium' | 'large'
	closeOnClickOutside?: boolean
}

const Modal: React.FC<ModalProps> = ({
	isVisible,
	toggleVisibility,
	title,
	children,
	footer,
	size = 'medium',
	closeOnClickOutside = true
}) => {
	const modalRef = useRef<HTMLDivElement>(null)

	useEffect(() => {
		if (isVisible) {
			document.body.style.overflow = 'hidden'
		} else {
			document.body.style.overflow = 'auto'
		}
		return () => {
			document.body.style.overflow = 'auto'
		}
	}, [isVisible])

	useEffect(() => {
		const handleEscape = (e: KeyboardEvent) => {
			if (e.key === 'Escape' && isVisible) {
				toggleVisibility()
			}
		}

		window.addEventListener('keydown', handleEscape)
		return () => window.removeEventListener('keydown', handleEscape)
	}, [isVisible, toggleVisibility])

	const handleOutsideClick = (e: React.MouseEvent) => {
		if (closeOnClickOutside && modalRef.current && !modalRef.current.contains(e.target as Node)) {
			toggleVisibility()
		}
	}

	if (!isVisible) return null

	return (
		<div className='modal-overlay' onClick={handleOutsideClick}>
			<div className={`modal-container modal-${size}`} ref={modalRef}>
				<div className='modal-header'>
					<h1>{title}</h1>
					<Button variant='only-icon' onClick={toggleVisibility} className='modal-close-button'>
						X
					</Button>
				</div>
				<div className='modal-content'>{children}</div>
				{footer && <div className='modal-footer'>{footer}</div>}
			</div>
		</div>
	)
}

export default Modal
