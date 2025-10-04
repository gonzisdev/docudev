import { useEffect } from 'react'
import { useAuthStore } from '../stores/authStore'

export const useAuthInit = () => {
	const refreshUser = useAuthStore((s) => s.refreshUser)

	useEffect(() => {
		refreshUser()
	}, [refreshUser])
}

export default useAuthInit
