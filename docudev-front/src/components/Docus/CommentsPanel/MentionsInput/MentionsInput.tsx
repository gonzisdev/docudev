import { useState, useRef, useEffect, forwardRef } from 'react'
import './MentionsInput.css'

export interface MentionUser {
	id: string
	name: string
	mentionId: string
}

interface Props {
	value: string
	onChange: (e: { target: { value: string; selectionStart: number; selectionEnd: number } }) => void
	placeholder?: string
	numberOfLines?: number
	hasError?: boolean
	readOnly?: boolean
	mentionedUsers: MentionUser[]
	onDeleteMention?: (mentionId: string) => void
}

const MentionsInput = forwardRef<HTMLDivElement, Props>(
	(
		{
			value,
			onChange,
			placeholder,
			numberOfLines = 3,
			hasError = false,
			readOnly = false,
			mentionedUsers,
			onDeleteMention
		},
		ref
	) => {
		const internalRef = useRef<HTMLDivElement>(null)
		const inputRef = (ref || internalRef) as React.RefObject<HTMLDivElement>
		const lastCursorPosition = useRef<number | null>(null)
		const isUpdatingContent = useRef(false)
		const [isFocused, setIsFocused] = useState(false)

		const getCursorPositionInPlainText = (el: HTMLElement): number => {
			const selection = window.getSelection()
			if (!selection || selection.rangeCount === 0) return 0
			const range = document.createRange()
			range.selectNodeContents(el)
			const currentRange = selection.getRangeAt(0)
			range.setEnd(currentRange.startContainer, currentRange.startOffset)
			const textBeforeCursor = range.toString()
			let position = textBeforeCursor.length
			mentionedUsers.forEach((user) => {
				const mentionInDom = `@${user.name}`
				const mentionInText = `@${user.name}[${user.mentionId}]`
				const diff = mentionInText.length - mentionInDom.length
				const regex = new RegExp(escapeRegExp(mentionInDom), 'g')
				const matches = textBeforeCursor.match(regex) || []
				position += matches.length * diff
			})
			return position
		}

		const restoreCursorPosition = (position: number) => {
			if (!inputRef.current) return
			try {
				if (!value) return
				let currentPos = 0
				let targetNode: Node | null = null
				let targetOffset = 0
				let done = false
				const findPositionInNode = (node: Node) => {
					if (done) return
					if (node.nodeType === Node.TEXT_NODE) {
						const textLength = node.textContent?.length || 0
						if (currentPos <= position && position <= currentPos + textLength) {
							targetNode = node
							targetOffset = position - currentPos
							done = true
							return
						}
						currentPos += textLength
					} else if (node.nodeType === Node.ELEMENT_NODE) {
						if ((node as Element).classList?.contains('mention')) {
							const mentionId = (node as Element).getAttribute('data-mention-id')
							const mentionUser = mentionedUsers.find((u) => u.mentionId === mentionId)
							if (mentionUser) {
								const mentionTextLength = `@${mentionUser.name}[${mentionUser.mentionId}]`.length
								if (position >= currentPos && position <= currentPos + mentionTextLength) {
									const nextSibling = node.nextSibling
									if (nextSibling && nextSibling.nodeType === Node.TEXT_NODE) {
										targetNode = nextSibling
										targetOffset = 0
									} else {
										const textNode = document.createTextNode('\u200B')
										node.parentNode?.insertBefore(textNode, node.nextSibling)
										targetNode = textNode
										targetOffset = 0
									}
									done = true
									return
								}
								currentPos += mentionTextLength
							} else {
								currentPos += node.textContent?.length || 0
							}
						} else {
							const childNodes = Array.from(node.childNodes)
							for (let i = 0; i < childNodes.length; i++) {
								findPositionInNode(childNodes[i])
								if (done) break
							}
						}
					}
				}
				Array.from(inputRef.current.childNodes).forEach((node) => {
					if (!done) findPositionInNode(node)
				})
				if (targetNode) {
					const range = document.createRange()
					range.setStart(targetNode, targetOffset)
					range.collapse(true)

					const selection = window.getSelection()
					if (selection) {
						selection.removeAllRanges()
						selection.addRange(range)
					}
				} else {
					const range = document.createRange()
					if (inputRef.current.lastChild) {
						range.setStartAfter(inputRef.current.lastChild)
					} else {
						range.setStart(inputRef.current, 0)
					}
					range.collapse(true)

					const selection = window.getSelection()
					if (selection) {
						selection.removeAllRanges()
						selection.addRange(range)
					}
				}
			} catch (error) {
				console.error('Error restaurando posición del cursor:', error)
			}
		}
		const formatContent = () => {
			if (!inputRef.current) return

			let contentToFormat = value
			if (!contentToFormat) {
				inputRef.current.innerHTML = ''
				return
			}
			const hasFocus = document.activeElement === inputRef.current
			if (hasFocus && lastCursorPosition.current === null) {
				lastCursorPosition.current = getCursorPositionInPlainText(inputRef.current)
			}
			mentionedUsers.forEach((user) => {
				const mentionText = `@${user.name}[${user.mentionId}]`
				const mentionHtml = `<span class="mention" data-mention-id="${user.mentionId}">@${user.name}</span>`
				contentToFormat = contentToFormat.replace(
					new RegExp(escapeRegExp(mentionText), 'g'),
					mentionHtml
				)
			})
			inputRef.current.innerHTML = contentToFormat
		}

		const handleInput = () => {
			if (!inputRef.current || isUpdatingContent.current) return
			lastCursorPosition.current = getCursorPositionInPlainText(inputRef.current)
			const plainText = extractPlainText()
			onChange({
				target: {
					value: plainText,
					selectionStart: lastCursorPosition.current,
					selectionEnd: lastCursorPosition.current
				}
			})
		}

		const extractPlainText = (): string => {
			if (!inputRef.current) return ''
			let result = ''
			const processNode = (node: Node): string => {
				if (node.nodeType === Node.TEXT_NODE) {
					return node.textContent || ''
				} else if (node.nodeType === Node.ELEMENT_NODE) {
					if ((node as Element).classList?.contains('mention')) {
						const mentionId = (node as Element).getAttribute('data-mention-id')
						const user = mentionedUsers.find((u) => u.mentionId === mentionId)

						if (user) {
							return `@${user.name}[${user.mentionId}]`
						} else {
							return node.textContent || ''
						}
					} else {
						let text = ''
						for (let i = 0; i < node.childNodes.length; i++) {
							text += processNode(node.childNodes[i])
						}
						return text
					}
				}
				return ''
			}
			for (let i = 0; i < inputRef.current.childNodes.length; i++) {
				result += processNode(inputRef.current.childNodes[i])
			}
			return result
		}

		const escapeRegExp = (string: string) => string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

		const handleFocus = () => setIsFocused(true)
		const handleBlur = () => setIsFocused(false)
		const handleClick = (e: React.MouseEvent) => {
			const target = e.target as HTMLElement
			if (target.classList?.contains('mention') && onDeleteMention) {
				const mentionId = target.getAttribute('data-mention-id')
				if (mentionId) {
					e.preventDefault()
					onDeleteMention(mentionId)
				}
			}
		}

		const containerClass = `mentions-input-container ${hasError ? 'error' : ''} ${isFocused ? 'focused' : ''} ${readOnly ? 'readonly' : ''}`
		const minHeight = `${numberOfLines * 1.5}rem`

		useEffect(() => {
			if (inputRef.current) {
				;(inputRef.current as any).setCursorPosition = (position: number) => {
					lastCursorPosition.current = position
					setTimeout(() => {
						restoreCursorPosition(position)
					}, 10)
				}
			}
		}, [])

		useEffect(() => {
			if (!inputRef.current) return
			isUpdatingContent.current = true
			const selection = window.getSelection()
			const hasFocus = document.activeElement === inputRef.current
			if (selection && selection.rangeCount > 0 && hasFocus) {
				const range = selection.getRangeAt(0)
				if (inputRef.current.contains(range.startContainer)) {
					lastCursorPosition.current = getCursorPositionInPlainText(inputRef.current)
				}
			}
			formatContent()
			if (hasFocus && lastCursorPosition.current !== null) {
				restoreCursorPosition(lastCursorPosition.current)
			}
			isUpdatingContent.current = false
		}, [value, mentionedUsers])

		return (
			<div className={containerClass}>
				<div
					ref={inputRef}
					className='mentions-input'
					contentEditable={!readOnly}
					onInput={handleInput}
					onFocus={handleFocus}
					onBlur={handleBlur}
					onClick={handleClick}
					style={{ minHeight }}
					data-placeholder={placeholder}
					suppressContentEditableWarning={true}
				/>
			</div>
		)
	}
)

export default MentionsInput
