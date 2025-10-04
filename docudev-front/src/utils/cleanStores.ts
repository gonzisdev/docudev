import { useAuthStore } from 'stores/authStore'
import { useDocSidebarStore } from 'stores/docSidebarStore'
import { useLanguageStore } from 'stores/languageStore'
import { useSidebarStore } from 'stores/sidebarStore'

export const clearAllStores = () => {
	useAuthStore.persist.clearStorage()
	useSidebarStore.persist.clearStorage()
	useDocSidebarStore.persist.clearStorage()
	useLanguageStore.persist.clearStorage()
}
