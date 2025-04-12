export const formatPrice = (price: number) => {
	return price.toLocaleString('es-ES', {
		style: 'currency',
		currency: 'EUR',
		minimumFractionDigits: 0
	})
}
