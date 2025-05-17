import { useState, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import { Docu, TeamMember } from 'models/Docu'
import { Comment } from 'models/Comment'
import useComments from 'hooks/useComment'
import Button from 'components/elements/Button/Button'
import Loading from 'components/elements/Loading/Loading'
import MentionsInput from './MentionsInput/MentionsInput'
import { TrashIcon } from 'assets/svgs'
import { formatDateWithTime } from 'utils/dates'
import UserPlaceholder from 'assets/images/user-placeholder.jpg'
import './CommentsPanel.css'

interface ExtendedDivElement extends HTMLDivElement {
	setCursorPosition?: (position: number) => void
}

interface Props {
	docuId: Docu['_id']
	teamUsers: TeamMember[]
	currentUser: TeamMember
}

const CommentsPanel = ({ docuId, teamUsers, currentUser }: Props) => {
	const { t } = useTranslation()
	const textareaRef = useRef<ExtendedDivElement>(null)
	const { comments, isLoadingComments, createComment, isCreatingComment, deleteComment } =
		useComments({ docuId })

	const [comment, setComment] = useState('')
	const [mentionSearch, setMentionSearch] = useState('')
	const [mentionIndex, setMentionIndex] = useState(-1)
	const [showMentions, setShowMentions] = useState(false)
	const [cursorPosition, setCursorPosition] = useState(0)
	const [mentionedUsers, setMentionedUsers] = useState<
		Array<{
			id: string
			name: string
			mentionId: string
		}>
	>([])

	const handleCommentChange = (e: { target: { value: string; selectionStart?: number } }) => {
		const newValue = e.target.value
		const prevValue = comment
		if (newValue.length < prevValue.length) {
			const mentionRegex = /@([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ\s]+)\[mention-[0-9]+\]/g
			let match
			const mentionsInPrevText = []
			while ((match = mentionRegex.exec(prevValue)) !== null) {
				mentionsInPrevText.push({
					fullText: match[0],
					startPos: match.index,
					endPos: match.index + match[0].length
				})
			}
			const cursorPos = e.target.selectionStart || 0
			for (const mention of mentionsInPrevText) {
				if (cursorPos >= mention.startPos && cursorPos <= mention.endPos) {
					const idMatch = mention.fullText.match(/\[mention-([0-9]+)\]/)
					if (idMatch) {
						const mentionId = `mention-${idMatch[1]}`
						const beforeMention = prevValue.slice(0, mention.startPos)
						const afterMention = prevValue.slice(mention.endPos)
						setComment(beforeMention + afterMention)
						setMentionedUsers((prev) => prev.filter((m) => m.mentionId !== mentionId))
						return
					}
				}
			}
		}
		setComment(newValue)
		const position = e.target.selectionStart || 0
		setCursorPosition(position)
		const textBeforeCursor = newValue.slice(0, position)
		const mentionMatch = textBeforeCursor.match(/@(\w*)$/)
		if (mentionMatch) {
			setMentionSearch(mentionMatch[1])
			setMentionIndex(textBeforeCursor.lastIndexOf('@'))
			setShowMentions(true)
		} else {
			setShowMentions(false)
			setMentionSearch('')
			setMentionIndex(-1)
		}
	}

	const filteredUsers = teamUsers
		.filter(
			(user) =>
				user._id &&
				user.name.toLowerCase().includes(mentionSearch.toLowerCase()) &&
				!mentionedUsers.find((m) => m.id === user._id)
		)
		.slice(0, 5)

	const handleMentionSelect = (user: TeamMember) => {
		if (!user._id) return
		const mentionId = `mention-${Date.now()}`
		const fullName = user.surname ? `${user.name} ${user.surname}` : user.name
		const beforeMention = comment.slice(0, mentionIndex)
		const afterMention = comment.slice(cursorPosition)
		const mentionText = `@${fullName}[${mentionId}]`
		const newCommentText = `${beforeMention}${mentionText} ${afterMention}`
		const newCursorPosition = mentionIndex + mentionText.length + 1
		setComment(newCommentText)
		setMentionedUsers([
			...mentionedUsers,
			{
				id: user._id,
				name: fullName,
				mentionId: mentionId
			}
		])

		setShowMentions(false)
		setCursorPosition(newCursorPosition)
		setTimeout(() => {
			if (textareaRef.current) {
				textareaRef.current.focus()
				if (typeof textareaRef.current.setCursorPosition === 'function') {
					textareaRef.current.setCursorPosition(newCursorPosition)
				}
			}
			setTimeout(() => {
				if (textareaRef.current) {
					const mentions = textareaRef.current.querySelectorAll('.mention')
					const lastMention = mentions[mentions.length - 1]
					if (lastMention) {
						const selection = window.getSelection()
						const range = document.createRange()
						if (lastMention.nextSibling && lastMention.nextSibling.nodeType === Node.TEXT_NODE) {
							range.setStart(lastMention.nextSibling, 1)
						} else {
							range.setStartAfter(lastMention)
							const textNode = document.createTextNode(' ')
							lastMention.parentNode?.insertBefore(textNode, lastMention.nextSibling)
						}
						range.collapse(true)
						if (selection) {
							selection.removeAllRanges()
							selection.addRange(range)
						}
					}
				}
			}, 20)
		}, 30)
	}

	const handleSubmit = async (e: React.FormEvent) => {
		e.preventDefault()
		if (!comment.trim()) return
		let cleanContent = comment
		mentionedUsers.forEach((mention) => {
			const regex = new RegExp(`@${mention.name}\\[${mention.mentionId}\\]`, 'g')
			cleanContent = cleanContent.replace(regex, `@${mention.name}`)
		})
		const mentionIds = mentionedUsers.map((user) => user.id)
		await createComment({
			content: cleanContent,
			mentions: mentionIds
		})
		setComment('')
		setMentionedUsers([])
	}

	const highlightMentions = (text: Comment['content'], mentions: Comment['mentions'] = []) => {
		if (!text || !mentions || mentions.length === 0) return text || ''
		let processedText = text
		const validMentions = mentions.filter(
			(mention): mention is TeamMember => typeof mention !== 'string' && mention !== null
		)
		validMentions.forEach((mention) => {
			const mentionName = `${mention.name} ${mention.surname || ''}`.trim()
			const escapedName = mentionName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
			const pattern = new RegExp(`(^|\\s)@(${escapedName})\\b`, 'g')
			processedText = processedText.replace(pattern, '$1<span class="mention">@$2</span>')
		})
		return processedText
	}

	return (
		<div className='comments-panel'>
			<h3>{t('comments.title')}</h3>
			<form onSubmit={handleSubmit} className='comment-form'>
				<div className='textarea-wrapper'>
					<MentionsInput
						ref={textareaRef as React.RefObject<HTMLDivElement>}
						value={comment}
						onChange={handleCommentChange}
						placeholder={t('comments.placeholder')}
						numberOfLines={3}
						hasError={false}
						readOnly={isCreatingComment}
						mentionedUsers={mentionedUsers}
						onDeleteMention={(mentionId) => {
							const mentionToRemove = mentionedUsers.find((m) => m.mentionId === mentionId)
							if (mentionToRemove) {
								const regex = new RegExp(`@${mentionToRemove.name}\\[${mentionId}\\]`, 'g')
								setComment(comment.replace(regex, ''))
								setMentionedUsers((prev) => prev.filter((m) => m.mentionId !== mentionId))
							}
						}}
					/>
					{showMentions && filteredUsers.length > 0 && (
						<div className='mentions-dropdown'>
							{filteredUsers.map((user) => (
								<div
									key={user._id}
									className='mention-suggestion'
									onClick={() => handleMentionSelect(user)}>
									<div className='mention-avatar'>
										{user.image ? (
											<img
												src={`${import.meta.env.VITE_API_URL}/uploads/${user.image}`}
												alt={`${user.name} ${user.surname}`}
												onError={(e) => {
													e.currentTarget.src = UserPlaceholder
												}}
											/>
										) : (
											<img src={UserPlaceholder} alt={`${user.name} ${user.surname}`} />
										)}
									</div>
									<span>
										{user.name} {user.surname}
									</span>
								</div>
							))}
						</div>
					)}
				</div>
				<Button type='submit' disabled={!comment.trim() || isCreatingComment} variant='secondary'>
					{isCreatingComment ? t('comments.sending') : t('comments.send')}
				</Button>
			</form>
			<div className='comments-list'>
				{isLoadingComments ? (
					<Loading />
				) : comments.length === 0 ? (
					<div className='no-comments'>{t('comments.none')}</div>
				) : (
					comments.map((comment) => {
						if (typeof comment.author === 'object') {
							return (
								<div key={comment._id} className='comment-item'>
									<div className='comment-header'>
										<div className='comment-author'>
											{comment.author.image ? (
												<img
													src={`${import.meta.env.VITE_API_URL}/uploads/${comment.author.image}`}
													alt={`${comment.author.name} ${comment.author.surname}`}
													className='author-avatar'
												/>
											) : (
												<img
													src={UserPlaceholder}
													alt={`${comment.author.name} ${comment.author.surname}`}
													className='author-avatar'
												/>
											)}
											<span className='author-name'>
												{comment.author.name} {comment.author.surname}
											</span>
										</div>
										<span className='comment-date'>{formatDateWithTime(comment.createdAt)}</span>
									</div>
									<div
										className='comment-content'
										dangerouslySetInnerHTML={{
											__html: highlightMentions(comment.content, comment.mentions)
										}}
									/>
									{comment.author._id === currentUser._id && (
										<div className='delete-comment' onClick={() => deleteComment(comment._id)}>
											<TrashIcon className='delete-icon' />
										</div>
									)}
								</div>
							)
						}
					})
				)}
			</div>
		</div>
	)
}

export default CommentsPanel
