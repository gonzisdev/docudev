import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface DocSidebarState {
	collapsed: boolean
	toggleSidebar: () => void
	setCollapsed: (value: boolean) => void
}

export const useDocSidebarStore = create<DocSidebarState>()(
	persist(
		(set) => {
			return {
				collapsed: false,
				toggleSidebar: () =>
					set((state) => ({
						...state,
						collapsed: !state.collapsed
					})),
				setCollapsed: (value: boolean) =>
					set((state) => ({
						...state,
						collapsed: value
					}))
			}
		},
		{
			name: 'doc-sidebar',
			storage: createJSONStorage(() => localStorage)
		}
	)
)
