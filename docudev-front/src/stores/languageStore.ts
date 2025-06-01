import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { Language } from 'models/Language'

interface SettingsState {
	language: Language
	setLanguage: (language: Language) => void
}

export const useLanguageStore = create<SettingsState>()(
	persist(
		(set) => ({
			language: 'es',
			setLanguage: (language) => set({ language })
		}),
		{
			name: 'language'
		}
	)
)
