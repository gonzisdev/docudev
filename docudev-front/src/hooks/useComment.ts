import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { commentsQueryKey, docuQueryKey } from 'constants/queryKeys'
import { Comment, CommentPayload } from 'models/Comment'
import { Docu } from 'models/Docu'
import { createCommentService, deleteCommentService, getCommentsService } from 'services/comment'

interface Props {
	docuId?: Docu['_id']
	onCommentsChanged?: () => void
}

const useComments = ({ docuId, onCommentsChanged }: Props = {}) => {
	const queryClient = useQueryClient()

	const { data: comments, isLoading: isLoadingComments } = useQuery({
		queryKey: [commentsQueryKey, docuId],
		queryFn: () => getCommentsService(docuId!),
		enabled: !!docuId,
		refetchOnWindowFocus: true,
		retry: false
	})

	const { mutateAsync: createComment, isPending: isCreatingComment } = useMutation({
		mutationFn: ({ content, mentions = [] }: CommentPayload) =>
			createCommentService(docuId!, { content, mentions }),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [commentsQueryKey, docuId]
			})
			queryClient.invalidateQueries({
				queryKey: [docuQueryKey, docuId]
			})
			if (onCommentsChanged) onCommentsChanged()
		}
	})

	const { mutateAsync: deleteComment } = useMutation({
		mutationFn: (commentId: Comment['_id']) => deleteCommentService(docuId!, commentId),
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [commentsQueryKey, docuId]
			})
			queryClient.invalidateQueries({
				queryKey: [docuQueryKey, docuId]
			})
			if (onCommentsChanged) onCommentsChanged()
		}
	})

	return {
		comments: comments || [],
		isLoadingComments,
		createComment,
		isCreatingComment,
		deleteComment
	}
}

export default useComments
