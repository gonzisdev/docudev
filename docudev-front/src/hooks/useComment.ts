import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { commentQueryKey, commentsQueryKey, docuQueryKey } from 'constants/queryKeys'
import { CommentPayload } from 'models/Comment'
import { Docu } from 'models/Docu'
import { createCommentService, deleteCommentService, getCommentsService } from 'services/comment'

interface Props {
	docuId?: Docu['_id']
}

const useComments = ({ docuId }: Props = {}) => {
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
		}
	})

	const { mutateAsync: deleteComment } = useMutation({
		mutationFn: (commentId: string) => deleteCommentService(docuId!, commentId),
		onSuccess: (_, commentId) => {
			queryClient.invalidateQueries({
				queryKey: [commentsQueryKey, docuId]
			})
			queryClient.invalidateQueries({
				queryKey: [commentQueryKey, commentId]
			})
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
