import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
	docuQueryKey,
	docusQueryKey,
	teamDocusQueryKey,
	teamQueryKey,
	teamsQueryKey
} from 'constants/queryKeys'
import { Docu, DocuFormPayload } from 'models/Docu'
import { useTranslation } from 'react-i18next'
import {
	createDocuService,
	deleteDocuService,
	getDocuService,
	updateDocuService
} from 'services/docu'
import { toast } from 'sonner'

interface Props {
	docuId?: Docu['_id']
}

const useDocu = ({ docuId }: Props) => {
	const { t } = useTranslation()
	const queryClient = useQueryClient()

	const {
		data: docu,
		isLoading: isLoadingDocu,
		error: errorDocu
	} = useQuery({
		queryKey: [docuQueryKey, docuId],
		queryFn: () => getDocuService(docuId!),
		enabled: !!docuId,
		refetchOnWindowFocus: 'always',
		retry: false
	})

	const { mutateAsync: createDocu, isPending: isCreatingDocu } = useMutation({
		mutationFn: createDocuService,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [docusQueryKey]
			})
			queryClient.invalidateQueries({
				queryKey: [teamQueryKey, docu?.team]
			})
			queryClient.invalidateQueries({
				queryKey: [teamsQueryKey, docu?.team]
			})
			queryClient.invalidateQueries({
				queryKey: [teamDocusQueryKey]
			})
			toast.success(t('create_docu.toast.success_title'), {
				description: t('create_docu.toast.success_description')
			})
		},
		onError: () => {
			toast.error(t('create_docu.toast.error_title'), {
				description: t('create_docu.toast.error_description')
			})
		}
	})

	const { mutateAsync: updateDocu, isPending: isUpdatingDocu } = useMutation({
		mutationFn: docuId ? (data: DocuFormPayload) => updateDocuService(docuId, data) : undefined,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [docuQueryKey, docuId]
			})
			queryClient.invalidateQueries({
				queryKey: [docusQueryKey]
			})
			queryClient.invalidateQueries({
				queryKey: [teamQueryKey, docu?.team]
			})
			queryClient.invalidateQueries({
				queryKey: [teamsQueryKey, docu?.team]
			})
			toast.success(t('update_docu.toast.success_title'), {
				description: t('update_docu.toast.success_description')
			})
		},
		onError: () => {
			toast.error(t('update_docu.toast.error_title'), {
				description: t('update_docu.toast.error_description')
			})
		}
	})

	const { mutateAsync: deleteDocu, isPending: isDeletingDocu } = useMutation({
		mutationFn: docuId ? () => deleteDocuService(docuId) : undefined,
		onSuccess: () => {
			queryClient.invalidateQueries({
				queryKey: [docuQueryKey, docuId]
			})
			queryClient.invalidateQueries({
				queryKey: [docusQueryKey]
			})
			queryClient.invalidateQueries({
				queryKey: [teamQueryKey, docu?.team]
			})
			queryClient.invalidateQueries({
				queryKey: [teamsQueryKey, docu?.team]
			})
			toast.success(t('delete_docu.toast.success_title'), {
				description: t('delete_docu.toast.success_description')
			})
		},
		onError: () => {
			toast.error(t('delete_docu.toast.error_title'), {
				description: t('delete_docu.toast.error_description')
			})
		}
	})

	return {
		docu,
		isLoadingDocu,
		errorDocu,
		createDocu,
		isCreatingDocu,
		updateDocu,
		isUpdatingDocu,
		deleteDocu,
		isDeletingDocu
	}
}

export default useDocu
