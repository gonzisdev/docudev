import { DocuOwner } from 'models/Docu'

export const getSortOptions = (t: (key: string) => string) => [
	{ value: 'title_asc', label: t('docus.sort_title_asc') },
	{ value: 'title_desc', label: t('docus.sort_title_desc') },
	{ value: 'created_asc', label: t('docus.sort_created_asc') },
	{ value: 'created_desc', label: t('docus.sort_created_desc') },
	{ value: 'updated_asc', label: t('docus.sort_updated_asc') },
	{ value: 'updated_desc', label: t('docus.sort_updated_desc') }
]

export function getUniqueOwners(docus: { owner?: DocuOwner }[] = []) {
	const userMap = new Map<string, DocuOwner>()
	docus.forEach((docu) => {
		if (docu.owner && docu.owner._id) {
			userMap.set(docu.owner._id, docu.owner)
		}
	})
	return Array.from(userMap.values())
}
