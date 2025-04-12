import { RefObject, useEffect } from 'react'

const useClickOutside = (refs: RefObject<HTMLElement>[], callback: () => void, active: boolean) => {
	useEffect(() => {
		if (!active) return

		const handleClickOutside = (event: MouseEvent) => {
			if (refs.every((ref) => ref.current && !ref.current.contains(event.target as Node))) {
				callback()
			}
		}

		document.addEventListener('mousedown', handleClickOutside)
		return () => {
			document.removeEventListener('mousedown', handleClickOutside)
		}
	}, [refs, callback, active])
}

export default useClickOutside
