export const formatDate = (date: Date | string) => {
	// DD/MM/YYYY
	const options: Intl.DateTimeFormatOptions = {
		year: 'numeric',
		month: '2-digit',
		day: '2-digit'
	}

	if (typeof date === 'string') {
		return new Intl.DateTimeFormat('es-ES', options).format(new Date(date))
	}

	return new Intl.DateTimeFormat('es-ES', options).format(date)
}
