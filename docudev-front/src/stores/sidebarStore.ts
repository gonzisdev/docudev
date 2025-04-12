import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

interface SidebarState {
	collapsed: boolean
	toggleSidebar: () => void
	setCollapsed: (value: boolean) => void
}

export const useSidebarStore = create<SidebarState>()(
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
			name: 'sidebar',
			storage: createJSONStorage(() => localStorage)
		}
	)
)
